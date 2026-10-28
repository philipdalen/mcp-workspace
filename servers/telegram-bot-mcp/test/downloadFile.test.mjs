// End-to-end tests for download_file: spawns the built server over stdio with Telegram mocked.
import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, realpathSync, rmSync, statSync, utimesSync, writeFileSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { FAKE_TOKEN, PDF_BYTES, PNG_BYTES } from './fixtures/telegram-fixtures.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const serverEntry = path.resolve(here, '../build/index.js');
const mockPreload = pathToFileURL(path.join(here, 'fixtures/mock-telegram.mjs')).href;

let root, serverTmp, cacheDir, staleLeftover, client;

before(async () => {
  root = realpathSync(mkdtempSync(path.join(tmpdir(), 'telegram-mcp-test-')));
  serverTmp = path.join(root, 'tmp');
  const cwd = path.join(root, 'cwd'); // empty cwd so dotenv cannot pick up a real .env
  for (const dir of [serverTmp, cwd]) mkdirSync(dir);

  // Simulate a file left behind by a previous server run that crashed or was killed.
  cacheDir = path.join(serverTmp, `telegram-mcp-downloads-${process.getuid()}`);
  mkdirSync(cacheDir, { mode: 0o700 });
  staleLeftover = path.join(cacheDir, 'deadbeef-file_old.pdf');
  writeFileSync(staleLeftover, 'stale');
  const expired = new Date(Date.now() - 25 * 60 * 60 * 1000);
  utimesSync(staleLeftover, expired, expired);

  client = new Client({ name: 'download-file-test', version: '0.0.0' });
  await client.connect(new StdioClientTransport({
    command: process.execPath,
    args: ['--import', mockPreload, serverEntry],
    cwd,
    env: { PATH: process.env.PATH, HOME: root, TMPDIR: serverTmp, TELEGRAM_BOT_TOKEN: FAKE_TOKEN },
    stderr: 'ignore',
  }));
});

after(async () => {
  await client?.close();
  rmSync(root, { recursive: true, force: true });
});

const download = (fileId) => client.callTool({ name: 'download_file', arguments: { fileId } }, undefined, { timeout: 5000 });
const textOf = (result) => result.content.filter((c) => c.type === 'text').map((c) => c.text).join('\n');
const localPathOf = (result) => /\*\*Local path:\*\* (.+)/.exec(textOf(result))?.[1];
const cacheEntries = () => readdirSync(cacheDir);

// Runs first: no download has happened yet, so only startup cleanup can remove the leftover.
test('startup removes expired files left by a previous run', async () => {
  for (let i = 0; i < 100 && existsSync(staleLeftover); i++) await sleep(10);
  assert.equal(existsSync(staleLeftover), false);
});

test('PDF is saved to a private local file readable outside the server process', async () => {
  const result = await download('pdf');
  assert.equal(result.isError, undefined, textOf(result));

  const text = textOf(result);
  assert.match(text, /\*\*MIME:\*\* application\/pdf/);
  assert.match(text, new RegExp(`\\*\\*Size:\\*\\* ${PDF_BYTES.length} bytes`));
  assert.doesNotMatch(text, /documents\/file_398\.pdf/, 'remote Telegram path must not be presented as a path');
  assert.doesNotMatch(text, /Base64/i);
  const until = Date.parse(/\*\*Available until:\*\* (\S+)/.exec(text)[1]);
  assert.ok(Math.abs(until - (Date.now() + 24 * 60 * 60 * 1000)) < 60_000, 'lifetime of 24 h is stated');

  const localPath = localPathOf(result);
  assert.ok(localPath && path.isAbsolute(localPath), `absolute path expected, got ${localPath}`);
  assert.match(path.basename(localPath), /^[0-9a-f]{8}-file_398\.pdf$/);
  assert.equal(path.dirname(localPath), cacheDir, 'stored in the private cache under the server host temp dir');
  assert.equal(statSync(cacheDir).mode & 0o777, 0o700);
  assert.equal(statSync(localPath).mode & 0o777, 0o600);

  // This test process is separate from the stdio server process, like the MCP client on the same host.
  assert.ok(readFileSync(localPath).equals(PDF_BYTES), 'local file holds the downloaded PDF bytes');
});

test('images are still returned inline and are not written to disk', async () => {
  const entriesBefore = cacheEntries().length;
  const result = await download('image');
  assert.equal(result.isError, undefined, textOf(result));
  const image = result.content.find((c) => c.type === 'image');
  assert.equal(image.mimeType, 'image/jpeg');
  assert.equal(image.data, PNG_BYTES.toString('base64'));
  assert.match(textOf(result), /^Downloaded image \(1 bytes, photos\/file_12\.jpg\)$/);
  assert.equal(cacheEntries().length, entriesBefore);
});

test('remote path traversal cannot escape the private download directory', async () => {
  for (const [fileId, expectedName] of [['traversal', '-evil_name_rm_-rf.pdf'], ['dotfile', '-telegram-file']]) {
    const localPath = localPathOf(await download(fileId));
    assert.ok(path.basename(localPath).endsWith(expectedName), localPath);
    assert.equal(path.dirname(localPath), cacheDir);
  }
});

test('HTTP failure reports an error and leaves no file behind', async () => {
  const entriesBefore = cacheEntries().length;
  const result = await download('missing');
  assert.equal(result.isError, true);
  assert.match(textOf(result), /404 Not Found/);
  assert.equal(cacheEntries().length, entriesBefore);
});

test('unknown file_id reports the Telegram error', async () => {
  const result = await download('nope');
  assert.equal(result.isError, true);
  assert.match(textOf(result), /invalid file_id/);
});

test('stalled download is aborted by the timeout', async () => {
  const entriesBefore = cacheEntries().length;
  const result = await download('slow');
  assert.equal(result.isError, true);
  assert.match(textOf(result), /timeout|aborted/i);
  assert.equal(cacheEntries().length, entriesBefore);
});

test('bot token is redacted from error messages', async () => {
  const result = await download('leaky');
  assert.equal(result.isError, true);
  assert.match(textOf(result), /ECONNRESET/);
  assert.match(textOf(result), /<redacted>/);
  assert.ok(!textOf(result).includes(FAKE_TOKEN));
});

test('oversized download is rejected and nothing is written', async () => {
  const entriesBefore = cacheEntries().length;
  const result = await download('huge');
  assert.equal(result.isError, true);
  assert.match(textOf(result), /exceeds the 20971520 byte download limit/);
  assert.equal(cacheEntries().length, entriesBefore);
});
