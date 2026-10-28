// Preloaded into the MCP server process (node --import) to replace all Telegram network access.
import TelegramBot from 'node-telegram-bot-api';
import { FAKE_TOKEN, FILES, PDF_BYTES, PNG_BYTES } from './telegram-fixtures.mjs';

TelegramBot.prototype.getFile = async function (fileId) {
  const filePath = FILES[fileId];
  if (!filePath) throw new Error('ETELEGRAM: 400 Bad Request: invalid file_id');
  return { file_id: fileId, file_unique_id: `u-${fileId}`, file_size: 1, file_path: filePath };
};

// Shrink the download timeout so the stall test is fast; production uses the real value.
const realTimeout = AbortSignal.timeout.bind(AbortSignal);
AbortSignal.timeout = (ms) => realTimeout(Math.min(ms, 200));

const prefix = `https://api.telegram.org/file/bot${FAKE_TOKEN}/`;

globalThis.fetch = async (url, init = {}) => {
  url = String(url);
  if (!url.startsWith(prefix)) throw new Error(`Unexpected network call in test: ${url}`);
  const filePath = url.slice(prefix.length);

  if (filePath === FILES.image) return new Response(PNG_BYTES);
  if (filePath === FILES.missing) return new Response('not found', { status: 404, statusText: 'Not Found' });
  if (filePath === FILES.leaky) throw new Error(`connect ECONNRESET while fetching ${url}`);
  if (filePath === FILES.slow) {
    return new Promise((_, reject) => {
      if (!init.signal) return; // no timeout -> hangs forever, test times out
      init.signal.addEventListener('abort', () => reject(init.signal.reason));
    });
  }
  return new Response(PDF_BYTES);
};
