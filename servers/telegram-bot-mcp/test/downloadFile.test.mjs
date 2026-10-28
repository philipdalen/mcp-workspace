// End-to-end tests for download_file: spawns the built server over stdio with Telegram mocked.
import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, realpathSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { FAKE_TOKEN, PDF_BYTES, PNG_BYTES } from './fixtures/telegram-fixtures.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const serverEntry = path.resolve(here, '../build/index.js');
const mockPreload = pathToFileURL(path.join(here, 'fixtures/mock-telegram.mjs')).href;

let root, serverTmp, client;

before(async () => {
  root = realpathSync(mkdtempSync(path.join(tmpdir(), 'telegram-mcp-test-')));
  serverTmp = path.join(root, 'tmp');
  const cwd = path.join(root, 'cwd'); // empty cwd so dotenv cannot pick up a real .env
  for (const dir of [serverTmp, cwd]) mkdirSync(dir);

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
const tmpEntries = () => readdirSync(serverTmp);

test('PDF is saved to a private local file readable outside the server process', async () => {
  const result = await download('pdf');
  assert.equal(result.isError, undefined, textOf(result));

  const text = textOf(result);
  assert.match(text, /\*\*MIME:\*\* application\/pdf/);
  assert.match(text, new RegExp(`\\*\\*Size:\\*\\* ${PDF_BYTES.length} bytes`));
  assert.doesNotMatch(text, /documents\/file_398\.pdf/, 'remote Telegram path must not be presented as a path');
  assert.doesNotMatch(text, /Base64/i);

  const localPath = localPathOf(result);
  assert.ok(localPath && path.isAbsolute(localPath), `absolute path expected, got ${localPath}`);
  assert.equal(path.basename(localPath), 'file_398.pdf');
  assert.equal(path.dirname(path.dirname(localPath)), serverTmp, 'stored under the server host temp dir');
  assert.equal(statSync(path.dirname(localPath)).mode & 0o777, 0o700);
  assert.equal(statSync(localPath).mode & 0o777, 0o600);

  // This test process is separate from the stdio server process, like the MCP client on the same host.
  assert.ok(readFileSync(localPath).equals(PDF_BYTES), 'local file holds the downloaded PDF bytes');
});

test('images are still returned inline and are not written to disk', async () => {
  const entriesBefore = tmpEntries().length;
  const result = await download('image');
  assert.equal(result.isError, undefined, textOf(result));
  const image = result.content.find((c) => c.type === 'image');
  assert.equal(image.mimeType, 'image/jpeg');
  assert.equal(image.data, PNG_BYTES.toString('base64'));
  assert.match(textOf(result), /^Downloaded image \(1 bytes, photos\/file_12\.jpg\)$/);
  assert.equal(tmpEntries().length, entriesBefore);
});

test('remote path traversal cannot escape the private download directory', async () => {
  for (const [fileId, expectedName] of [['traversal', 'evil_name_rm_-rf.pdf'], ['dotfile', 'telegram-file']]) {
    const localPath = localPathOf(await download(fileId));
    assert.equal(path.basename(localPath), expectedName);
    assert.equal(path.dirname(path.dirname(localPath)), serverTmp);
  }
});

test('HTTP failure reports an error and leaves no file behind', async () => {
  const entriesBefore = tmpEntries().length;
  const result = await download('missing');
  assert.equal(result.isError, true);
  assert.match(textOf(result), /404 Not Found/);
  assert.equal(tmpEntries().length, entriesBefore);
});

test('unknown file_id reports the Telegram error', async () => {
  const result = await download('nope');
  assert.equal(result.isError, true);
  assert.match(textOf(result), /invalid file_id/);
});

test('stalled download is aborted by the timeout', async () => {
  const entriesBefore = tmpEntries().length;
  const result = await download('slow');
  assert.equal(result.isError, true);
  assert.match(textOf(result), /timeout|aborted/i);
  assert.equal(tmpEntries().length, entriesBefore);
});

test('bot token is redacted from error messages', async () => {
  const result = await download('leaky');
  assert.equal(result.isError, true);
  assert.match(textOf(result), /ECONNRESET/);
  assert.match(textOf(result), /<redacted>/);
  assert.ok(!textOf(result).includes(FAKE_TOKEN));
});
