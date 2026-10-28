import TelegramBot from 'node-telegram-bot-api';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { z } from 'zod';
import { getBotToken } from '../index.js';

const DownloadFileSchema = z.object({
  token: z.string().optional().describe("Telegram bot token (optional if TELEGRAM_BOT_TOKEN env var is set)"),
  fileId: z.string().describe("Telegram file_id to download")
});

const DOWNLOAD_TIMEOUT_MS = 60_000;

// Telegram file URLs embed the bot token; never echo it back in errors.
function redactToken(message: string, token: string | undefined): string {
  return token ? message.split(token).join('<redacted>') : message;
}

// Telegram's file_path is a remote path (e.g. "documents/file_398.pdf"), never a local one.
// Keep only a sanitized basename so it cannot escape the private download directory.
function localFileName(telegramFilePath: string): string {
  const name = path.basename(telegramFilePath).replace(/[^\w.-]/g, '_').replace(/^\.+/, '').slice(0, 100);
  return name || 'telegram-file';
}

// Writes into a fresh 0700 directory under the OS temp dir of the host running this server.
async function saveToPrivateTempFile(telegramFilePath: string, data: Buffer): Promise<string> {
  const dir = await mkdtemp(path.join(tmpdir(), 'telegram-mcp-'));
  const localPath = path.join(dir, localFileName(telegramFilePath));
  await writeFile(localPath, data, { mode: 0o600, flag: 'wx' });
  return localPath;
}

export const downloadFile = {
  name: "download_file",
  description: "Download a file from Telegram by its file_id. Images are returned as viewable content. Other files (PDFs, documents, voice/audio, etc.) are saved to a private temp file on the host running this MCP server and the absolute local path is returned; open that path with your file-reading tool (e.g. Read for PDFs) when you run on the same host.",
  parameters: {
    type: "object",
    properties: {
      token: {
        type: "string",
        description: "Telegram bot token (optional if TELEGRAM_BOT_TOKEN env var is set)"
      },
      fileId: {
        type: "string",
        description: "The file_id from a Telegram message (obtained from get_updates)"
      }
    },
    required: ["fileId"]
  },

  async run(args: z.infer<typeof DownloadFileSchema>) {
    let token: string | undefined;
    try {
      const validatedArgs = DownloadFileSchema.parse(args);
      token = getBotToken(validatedArgs.token);
      const bot = new TelegramBot(token, { polling: false });

      // Get file info from Telegram
      const file = await bot.getFile(validatedArgs.fileId);

      if (!file.file_path) {
        throw new Error("File path not available - file may be too large or unavailable");
      }

      // Download the file
      const fileUrl = `https://api.telegram.org/file/bot${token}/${file.file_path}`;
      const response = await fetch(fileUrl, { signal: AbortSignal.timeout(DOWNLOAD_TIMEOUT_MS) });

      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.status} ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Determine file type from path
      const filePath = file.file_path.toLowerCase();
      const isImage = filePath.endsWith('.jpg') || filePath.endsWith('.jpeg') ||
                      filePath.endsWith('.png') || filePath.endsWith('.gif') ||
                      filePath.endsWith('.webp');

      // Determine MIME type
      let mimeType = 'application/octet-stream';
      if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) mimeType = 'image/jpeg';
      else if (filePath.endsWith('.png')) mimeType = 'image/png';
      else if (filePath.endsWith('.gif')) mimeType = 'image/gif';
      else if (filePath.endsWith('.webp')) mimeType = 'image/webp';
      else if (filePath.endsWith('.ogg') || filePath.endsWith('.oga')) mimeType = 'audio/ogg';
      else if (filePath.endsWith('.mp3')) mimeType = 'audio/mpeg';
      else if (filePath.endsWith('.m4a')) mimeType = 'audio/mp4';
      else if (filePath.endsWith('.pdf')) mimeType = 'application/pdf';

      // For images, return as image content so Claude can see them
      if (isImage) {
        return {
          content: [
            {
              type: "text",
              text: `Downloaded image (${file.file_size} bytes, ${file.file_path})`
            },
            {
              type: "image",
              data: buffer.toString('base64'),
              mimeType: mimeType
            }
          ]
        };
      }

      // For everything else (documents, audio, ...), write the bytes to a real local file.
      // Telegram's file_path is deliberately not returned: it is not readable locally.
      const localPath = await saveToPrivateTempFile(file.file_path, buffer);
      return {
        content: [{
          type: "text",
          text: `Downloaded file saved locally:\n**Local path:** ${localPath}\n**Size:** ${buffer.length} bytes\n**MIME:** ${mimeType}\n\nThis absolute path is on the host running the Telegram MCP server. Read it directly from there (e.g. Read tool for PDFs); it is not accessible from a different machine.`
        }]
      };

    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Failed to download file: ${redactToken(error instanceof Error ? error.message : String(error), token)}`
        }],
        isError: true
      };
    }
  }
};
