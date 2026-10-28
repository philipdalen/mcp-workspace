import { randomBytes } from 'node:crypto';
import { lstat, mkdir, readdir, rename, rmdir, unlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

// Lifecycle of downloaded non-image files.
//
// The cache has SLOT_COUNT fixed slot directories (slot-0 ... slot-9), each holding at most one
// download of at most MAX_DOWNLOAD_BYTES, so file data never exceeds SLOT_COUNT * MAX_DOWNLOAD_BYTES.
// A slot is free when its directory is empty or missing. To claim one, a saver builds a private
// stage-<id> directory containing a reservation marker and rename()s it onto slot-N; rename only
// replaces a missing or empty directory, so exactly one saver wins each free slot, across threads
// and processes. Slot directories are never deleted by cleanup: entries are deleted individually,
// by their unique names, once their own mtime is DOWNLOAD_RETENTION_MS old, and a slot becomes free
// again when it is empty. A fresh entry can therefore never be deleted by a concurrent or stale sweep.
export const DOWNLOAD_RETENTION_MS = 24 * 60 * 60 * 1000;
export const SWEEP_INTERVAL_MS = 60 * 60 * 1000;
export const MAX_DOWNLOAD_BYTES = 20 * 1024 * 1024; // Telegram Bot API getFile limit
export const SLOT_COUNT = 10;

const slotNames = Array.from({ length: SLOT_COUNT }, (_, i) => `slot-${i}`);

export function downloadCacheDir(): string {
  return path.join(tmpdir(), `telegram-mcp-downloads-${process.getuid?.() ?? 'user'}`);
}

// Only ever operate on a real directory we own that nobody else can access.
async function assertPrivateDir(dir: string): Promise<void> {
  const stats = await lstat(dir);
  const ownedByUs = !process.getuid || stats.uid === process.getuid();
  if (!stats.isDirectory() || !ownedByUs || (stats.mode & 0o077) !== 0) {
    throw new Error(`Refusing to use download cache ${dir}: not a private directory owned by this user`);
  }
}

const isExpired = (mtimeMs: number) => Date.now() - mtimeMs >= DOWNLOAD_RETENTION_MS;
const ignoreCodes = (...codes: string[]) => (error: NodeJS.ErrnoException) => {
  if (!codes.includes(error.code ?? '')) throw error;
};

// Deletes expired files directly inside `dir`; returns the oldest remaining file mtime.
async function deleteExpiredFiles(dir: string): Promise<number | undefined> {
  const entries = await readdir(dir, { withFileTypes: true }).catch((error) => {
    ignoreCodes('ENOENT')(error);
    return [];
  });
  let oldestMs: number | undefined;
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const filePath = path.join(dir, entry.name);
    const stats = await lstat(filePath).catch(ignoreCodes('ENOENT'));
    if (!stats) continue;
    if (isExpired(stats.mtimeMs)) await unlink(filePath).catch(ignoreCodes('ENOENT'));
    else oldestMs = Math.min(oldestMs ?? stats.mtimeMs, stats.mtimeMs);
  }
  return oldestMs;
}

// Deletes expired files in the slots and removes expired stage directories left by crashes.
// Returns the oldest unexpired file time, used to tell callers when a slot frees up.
export async function pruneDownloadCache(): Promise<{ oldestMs?: number }> {
  const dir = downloadCacheDir();
  try {
    await assertPrivateDir(dir);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return {};
    throw error;
  }

  let oldestMs: number | undefined;
  for (const slot of slotNames) {
    const slotOldest = await deleteExpiredFiles(path.join(dir, slot));
    if (slotOldest !== undefined) oldestMs = Math.min(oldestMs ?? slotOldest, slotOldest);
  }
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (!entry.isDirectory() || !entry.name.startsWith('stage-')) continue;
    const stageDir = path.join(dir, entry.name);
    const stats = await lstat(stageDir).catch(ignoreCodes('ENOENT'));
    if (!stats || !isExpired(stats.mtimeMs)) continue;
    await deleteExpiredFiles(stageDir);
    await rmdir(stageDir).catch(ignoreCodes('ENOENT', 'ENOTEMPTY', 'EEXIST'));
  }
  return { oldestMs };
}

// Telegram's file_path is a remote path (e.g. "documents/file_398.pdf"), never a local one.
// Keep only a sanitized basename so it cannot escape its slot directory.
function localFileName(telegramFilePath: string): string {
  return path.basename(telegramFilePath).replace(/[^\w.-]/g, '_').replace(/^\.+/, '').slice(0, 100) || 'telegram-file';
}

// Claims a free slot and saves the download in it. When every slot holds an unexpired download,
// the new download is rejected; files already handed out are never evicted.
export async function saveDownload(telegramFilePath: string, data: Buffer): Promise<{ localPath: string; expiresAt: Date }> {
  if (data.length > MAX_DOWNLOAD_BYTES) {
    throw new Error(`File exceeds the ${MAX_DOWNLOAD_BYTES} byte download limit`);
  }
  const dir = downloadCacheDir();
  await mkdir(dir, { mode: 0o700, recursive: true });
  const { oldestMs } = await pruneDownloadCache();

  const id = randomBytes(8).toString('hex');
  const stageDir = path.join(dir, `stage-${id}`);
  const marker = `reserved-${id}`;
  await mkdir(stageDir, { mode: 0o700 });
  await writeFile(path.join(stageDir, marker), '', { mode: 0o600, flag: 'wx' });

  let slotDir: string | undefined;
  for (const slot of slotNames) {
    try {
      await rename(stageDir, path.join(dir, slot));
      slotDir = path.join(dir, slot);
      break;
    } catch (error) {
      ignoreCodes('ENOTEMPTY', 'EEXIST')(error as NodeJS.ErrnoException);
    }
  }
  if (!slotDir) {
    await unlink(path.join(stageDir, marker));
    await rmdir(stageDir);
    const freesAt = new Date((oldestMs ?? Date.now()) + DOWNLOAD_RETENTION_MS).toISOString();
    throw new Error(
      `Download cache is full (all ${SLOT_COUNT} slots hold unexpired downloads). ` +
      `Existing downloads are kept until they expire; a slot frees up from ${freesAt}.`
    );
  }

  const localPath = path.join(slotDir, `${id}-${localFileName(telegramFilePath)}`);
  try {
    await writeFile(localPath, data, { mode: 0o600, flag: 'wx' });
  } catch (error) {
    // Release our own slot: both names are unique to this save.
    await unlink(localPath).catch(() => {});
    await unlink(path.join(slotDir, marker)).catch(() => {});
    throw error;
  }
  const { mtimeMs } = await lstat(localPath);
  return { localPath, expiresAt: new Date(mtimeMs + DOWNLOAD_RETENTION_MS) };
}

// Startup recovery (files left by previous runs or crashes) plus an idle sweep that never
// keeps the process alive on its own.
export function startDownloadCacheMaintenance(): NodeJS.Timeout {
  const sweep = () => pruneDownloadCache().catch((error) =>
    console.error(`Download cache cleanup failed: ${error instanceof Error ? error.message : String(error)}`)
  );
  void sweep();
  return setInterval(sweep, SWEEP_INTERVAL_MS).unref();
}
