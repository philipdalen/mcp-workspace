import { randomBytes } from 'node:crypto';
import { lstat, mkdir, readdir, unlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

// Lifecycle of downloaded non-image files. Files live in one private per-user directory,
// are kept for DOWNLOAD_RETENTION_MS from when they were written, and are deleted by
// the first prune after that: at server startup, before every save, and on an hourly timer.
export const DOWNLOAD_RETENTION_MS = 24 * 60 * 60 * 1000;
export const SWEEP_INTERVAL_MS = 60 * 60 * 1000;
export const MAX_DOWNLOAD_BYTES = 20 * 1024 * 1024; // Telegram Bot API getFile limit
export const MAX_CACHE_BYTES = 200 * 1024 * 1024;
export const MAX_CACHE_FILES = 100;

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

// Deletes expired regular files (including leftovers from crashed writes) and reports what remains.
// Subdirectories and symlinks are never touched.
export async function pruneDownloadCache(): Promise<{ bytes: number; files: number; oldestMs?: number }> {
  const dir = downloadCacheDir();
  try {
    await assertPrivateDir(dir);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return { bytes: 0, files: 0 };
    throw error;
  }

  const usage: { bytes: number; files: number; oldestMs?: number } = { bytes: 0, files: 0 };
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (!entry.isFile()) continue;
    const filePath = path.join(dir, entry.name);
    try {
      const stats = await lstat(filePath);
      if (Date.now() - stats.mtimeMs >= DOWNLOAD_RETENTION_MS) {
        await unlink(filePath);
        continue;
      }
      usage.bytes += stats.size;
      usage.files += 1;
      usage.oldestMs = Math.min(usage.oldestMs ?? stats.mtimeMs, stats.mtimeMs);
    } catch (error) {
      // Another server process sharing the cache may have removed it first.
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    }
  }
  return usage;
}

// Telegram's file_path is a remote path (e.g. "documents/file_398.pdf"), never a local one.
// Keep only a sanitized basename so it cannot escape the cache directory.
function localFileName(telegramFilePath: string): string {
  const name = path.basename(telegramFilePath).replace(/[^\w.-]/g, '_').replace(/^\.+/, '').slice(0, 100);
  return `${randomBytes(4).toString('hex')}-${name || 'telegram-file'}`;
}

// Saves a download for the consumer to read. When the cache is full, the new download is
// rejected rather than deleting files that were already handed out and are still unexpired.
export async function saveDownload(telegramFilePath: string, data: Buffer): Promise<{ localPath: string; expiresAt: Date }> {
  const dir = downloadCacheDir();
  await mkdir(dir, { mode: 0o700, recursive: true });
  const usage = await pruneDownloadCache();

  if (usage.files + 1 > MAX_CACHE_FILES || usage.bytes + data.length > MAX_CACHE_BYTES) {
    const freesAt = new Date((usage.oldestMs ?? Date.now()) + DOWNLOAD_RETENTION_MS).toISOString();
    throw new Error(
      `Download cache is full (${usage.files} files, ${usage.bytes} of ${MAX_CACHE_BYTES} bytes; limit ${MAX_CACHE_FILES} files). ` +
      `Existing downloads are kept until they expire; space frees up from ${freesAt}.`
    );
  }

  const localPath = path.join(dir, localFileName(telegramFilePath));
  try {
    await writeFile(localPath, data, { mode: 0o600, flag: 'wx' });
  } catch (error) {
    // EEXIST means the name belongs to an earlier download that must not be touched.
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') await unlink(localPath).catch(() => {});
    throw error;
  }
  return { localPath, expiresAt: new Date(Date.now() + DOWNLOAD_RETENTION_MS) };
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
