// Lifecycle tests for the download cache: expiry, slot capacity (also across processes),
// directory safety and the idle sweep.
import { afterEach, beforeEach, mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { chmodSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, realpathSync, rmSync, symlinkSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import { pathToFileURL } from 'node:url';
import {
  DOWNLOAD_RETENTION_MS, MAX_DOWNLOAD_BYTES, SLOT_COUNT, SWEEP_INTERVAL_MS,
  downloadCacheDir, pruneDownloadCache, saveDownload, startDownloadCacheMaintenance,
} from '../build/downloadCache.js';

const cacheModuleUrl = new URL('../build/downloadCache.js', import.meta.url).href;
const realTmp = tmpdir();
let root, cacheDir;

beforeEach(() => {
  root = realpathSync(mkdtempSync(path.join(realTmp, 'telegram-mcp-cache-test-')));
  process.env.TMPDIR = root; // os.tmpdir() honours TMPDIR on every call
  cacheDir = downloadCacheDir();
  mkdirSync(cacheDir, { mode: 0o700 });
});

afterEach(() => {
  mock.timers.reset();
  process.env.TMPDIR = realTmp;
  rmSync(root, { recursive: true, force: true });
});

const age = (target, ageMs) => {
  const mtime = new Date(Date.now() - ageMs);
  utimesSync(target, mtime, mtime);
  return target;
};

function cacheFile(relativePath, ageMs = 0) {
  const file = path.join(cacheDir, relativePath);
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, 'x');
  return age(file, ageMs);
}

const dataFiles = () => readdirSync(cacheDir)
  .filter((name) => name.startsWith('slot-'))
  .flatMap((slot) => readdirSync(path.join(cacheDir, slot)).filter((name) => !name.startsWith('reserved-')));

async function waitUntil(condition) {
  for (let i = 0; i < 200 && !condition(); i++) await sleep(5);
  assert.ok(condition(), 'condition not reached');
}

test('cleanup deletes only expired cache entries, each by its own age', async () => {
  // Crash mid-write: reservation marker and partial file, both expired.
  const crashed = [cacheFile('slot-0/reserved-a', DOWNLOAD_RETENTION_MS), cacheFile('slot-0/a-partial.pdf', DOWNLOAD_RETENTION_MS)];
  const expiredMarker = cacheFile('slot-1/reserved-b', DOWNLOAD_RETENTION_MS);
  const freshDownload = cacheFile('slot-1/b-file.pdf', DOWNLOAD_RETENTION_MS - 60_000);
  // Crash before a slot was claimed, and a save that is claiming one right now.
  const staleStage = path.join(cacheDir, 'stage-old');
  cacheFile('stage-old/reserved-c', DOWNLOAD_RETENTION_MS);
  age(staleStage, DOWNLOAD_RETENTION_MS);
  const activeStage = path.join(cacheDir, 'stage-new');
  mkdirSync(activeStage);
  // Not ours to delete.
  const unrelated = cacheFile('other.txt', 2 * DOWNLOAD_RETENTION_MS);
  const outside = path.join(root, 'outside.txt');
  writeFileSync(outside, 'not ours');
  age(outside, 2 * DOWNLOAD_RETENTION_MS);
  mkdirSync(path.join(cacheDir, 'slot-2'));
  symlinkSync(outside, path.join(cacheDir, 'slot-2', 'link'));

  await pruneDownloadCache();

  for (const gone of [...crashed, expiredMarker, staleStage]) assert.equal(existsSync(gone), false, gone);
  for (const kept of [freshDownload, activeStage, unrelated, outside]) assert.ok(existsSync(kept), kept);
  assert.ok(existsSync(path.join(cacheDir, 'slot-0')), 'slot directories are kept; empty means free');
});

test('saves are limited to one file per slot and a full cache rejects without evicting', async () => {
  await assert.rejects(saveDownload('documents/huge.pdf', Buffer.alloc(MAX_DOWNLOAD_BYTES + 1)), /exceeds the 20971520 byte/);
  assert.deepEqual(readdirSync(cacheDir), [], 'an oversized file reserves nothing');

  const saved = [];
  for (let i = 0; i < SLOT_COUNT; i++) saved.push(await saveDownload(`documents/f${i}.pdf`, Buffer.from(`file ${i}`)));
  assert.equal(new Set(saved.map((s) => path.dirname(s.localPath))).size, SLOT_COUNT, 'one slot per file');

  await assert.rejects(saveDownload('documents/extra.pdf', Buffer.from('extra')), /all 10 slots hold unexpired downloads/);
  saved.forEach((s, i) => assert.equal(readFileSync(s.localPath, 'utf8'), `file ${i}`));
  assert.ok(!readdirSync(cacheDir).some((name) => name.startsWith('stage-')), 'rejected save cleans up');

  // Once one download expires its slot is reused.
  const slot3 = path.dirname(saved[3].localPath);
  for (const name of readdirSync(slot3)) age(path.join(slot3, name), DOWNLOAD_RETENTION_MS);
  const reused = await saveDownload('documents/new.pdf', Buffer.from('new'));
  assert.equal(path.dirname(reused.localPath), slot3);
  assert.equal(dataFiles().length, SLOT_COUNT);
});

test('concurrent saves from separate processes never exceed the slot count', async () => {
  const processes = 6, savesEach = 4; // 24 simultaneous attempts for 10 slots
  const startAt = Date.now() + 1000;
  const script = `
    const { saveDownload } = await import(${JSON.stringify(cacheModuleUrl)});
    while (Date.now() < ${startAt}) {}
    const results = await Promise.allSettled(Array.from({ length: ${savesEach} }, (_, i) =>
      saveDownload('documents/race-' + process.pid + '-' + i + '.pdf', Buffer.alloc(1024))));
    process.stdout.write(String(results.filter((r) => r.status === 'fulfilled').length));`;
  const run = () => new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ['--input-type=module', '-e', script], { env: { ...process.env, TMPDIR: root } });
    let out = '';
    child.stdout.on('data', (chunk) => { out += chunk; });
    child.on('error', reject);
    child.on('close', (code) => (code === 0 ? resolve(Number(out)) : reject(new Error(`child exited ${code}`))));
  });

  const succeeded = (await Promise.all(Array.from({ length: processes }, run))).reduce((a, b) => a + b, 0);

  assert.equal(succeeded, SLOT_COUNT);
  for (let i = 0; i < SLOT_COUNT; i++) {
    const files = readdirSync(path.join(cacheDir, `slot-${i}`)).filter((name) => !name.startsWith('reserved-'));
    assert.equal(files.length, 1, `slot-${i}`);
  }
});

test('refuses a cache directory that is shared or a symlink', async () => {
  chmodSync(cacheDir, 0o755);
  await assert.rejects(saveDownload('documents/a.pdf', Buffer.alloc(1)), /Refusing to use download cache/);
  await assert.rejects(pruneDownloadCache(), /Refusing/);

  rmSync(cacheDir, { recursive: true });
  const target = path.join(root, 'elsewhere');
  mkdirSync(target, { mode: 0o700 });
  symlinkSync(target, cacheDir);
  await assert.rejects(saveDownload('documents/a.pdf', Buffer.alloc(1)), /Refusing/);
  assert.deepEqual(readdirSync(target), []);
});

test('idle sweep deletes files once they expire, without keeping the process alive', async () => {
  const realTimer = startDownloadCacheMaintenance();
  const keepsProcessAlive = realTimer.hasRef();
  clearInterval(realTimer);
  assert.equal(keepsProcessAlive, false);

  mock.timers.enable({ apis: ['setInterval', 'Date'], now: Date.now() });
  const file = cacheFile('slot-0/x-download.pdf', DOWNLOAD_RETENTION_MS - SWEEP_INTERVAL_MS / 2);
  const timer = startDownloadCacheMaintenance();
  await pruneDownloadCache(); // let the startup sweep settle: file is not yet expired
  assert.ok(existsSync(file));

  mock.timers.tick(SWEEP_INTERVAL_MS); // an hour passes with no downloads
  await waitUntil(() => !existsSync(file));
  clearInterval(timer);
});
