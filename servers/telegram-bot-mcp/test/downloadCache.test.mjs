// Lifecycle tests for the download cache: expiry, capacity, directory safety and the idle sweep.
import { afterEach, beforeEach, mock, test } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { syncBuiltinESMExports } from 'node:module';
import { chmodSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, realpathSync, rmSync, symlinkSync, truncateSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import {
  DOWNLOAD_RETENTION_MS, MAX_CACHE_BYTES, MAX_CACHE_FILES, SWEEP_INTERVAL_MS,
  downloadCacheDir, pruneDownloadCache, saveDownload, startDownloadCacheMaintenance,
} from '../build/downloadCache.js';

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

function cacheFile(name, { ageMs = 0, size } = {}) {
  const file = path.join(cacheDir, name);
  writeFileSync(file, 'x');
  if (size !== undefined) truncateSync(file, size); // sparse: no real disk usage
  const mtime = new Date(Date.now() - ageMs);
  utimesSync(file, mtime, mtime);
  return file;
}

async function waitUntil(condition) {
  for (let i = 0; i < 200 && !condition(); i++) await sleep(5);
  assert.ok(condition(), 'condition not reached');
}

test('expired files are deleted; fresh files, subdirectories and symlinks are kept', async () => {
  const fresh = cacheFile('fresh.pdf', { ageMs: DOWNLOAD_RETENTION_MS - 60_000 });
  const expired = cacheFile('expired.pdf', { ageMs: DOWNLOAD_RETENTION_MS });
  const subdir = path.join(cacheDir, 'subdir');
  mkdirSync(subdir);
  const outside = path.join(root, 'outside.txt');
  writeFileSync(outside, 'not ours');
  symlinkSync(outside, path.join(cacheDir, 'link'));
  const old = new Date(Date.now() - 2 * DOWNLOAD_RETENTION_MS);
  utimesSync(outside, old, old);

  const usage = await pruneDownloadCache();

  assert.equal(existsSync(expired), false);
  assert.ok(existsSync(fresh) && existsSync(subdir) && existsSync(outside));
  assert.equal(usage.files, 1);
});

test('a full cache rejects new downloads instead of deleting unexpired files', async () => {
  const big = cacheFile('big.pdf', { size: MAX_CACHE_BYTES - 5 });
  await assert.rejects(saveDownload('documents/new.pdf', Buffer.alloc(10)), /Download cache is full/);
  assert.ok(existsSync(big));
  assert.deepEqual(readdirSync(cacheDir), ['big.pdf']);

  // Once the old file has expired it is pruned, making room for the new one.
  const expired = new Date(Date.now() - DOWNLOAD_RETENTION_MS);
  utimesSync(big, expired, expired);
  const { localPath } = await saveDownload('documents/new.pdf', Buffer.alloc(10));
  assert.deepEqual(readdirSync(cacheDir), [path.basename(localPath)]);

  for (let i = 1; i < MAX_CACHE_FILES; i++) cacheFile(`f${i}`);
  await assert.rejects(saveDownload('documents/one-too-many.pdf', Buffer.alloc(1)), /limit 100 files/);
  assert.equal(readdirSync(cacheDir).length, MAX_CACHE_FILES);
});

test('a name collision fails the new save without deleting the existing file', async (t) => {
  t.mock.method(crypto, 'randomBytes', () => Buffer.from('00000000', 'hex'));
  syncBuiltinESMExports();
  t.after(() => { t.mock.restoreAll(); syncBuiltinESMExports(); });

  const first = await saveDownload('documents/same.pdf', Buffer.from('first'));
  await assert.rejects(saveDownload('documents/same.pdf', Buffer.from('second')), { code: 'EEXIST' });
  assert.equal(readFileSync(first.localPath, 'utf8'), 'first');
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
  const file = cacheFile('download.pdf', { ageMs: DOWNLOAD_RETENTION_MS - SWEEP_INTERVAL_MS / 2 });
  const timer = startDownloadCacheMaintenance();
  await pruneDownloadCache(); // let the startup sweep settle: file is not yet expired
  assert.ok(existsSync(file));

  mock.timers.tick(SWEEP_INTERVAL_MS); // an hour passes with no downloads
  await waitUntil(() => !existsSync(file));
  clearInterval(timer);
});
