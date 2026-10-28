import TelegramBot from 'node-telegram-bot-api';
import { z } from 'zod';
import { getBotToken } from '../index.js';
import { DOWNLOAD_RETENTION_MS, MAX_DOWNLOAD_BYTES, saveDownload } from '../downloadCache.js';

const DownloadFileSchema = z.object({
  token: z.string().optional().describe("Telegram bot token (optional if TELEGRAM_BOT_TOKEN env var is set)"),
  fileId: z.string().describe("Telegram file_id to download")
});

// Applies to the getFile metadata request and to the whole file download (headers and body).
const REQUEST_TIMEOUT_MS = 60_000;

// Telegram file URLs embed the bot token; never echo it back in errors.
function redactToken(message: string, token: string | undefined): string {
  return token ? message.split(token).join('<redacted>') : message;
}

// Reads the body without ever holding more than MAX_DOWNLOAD_BYTES in memory.
async function readBoundedBody(response: Response): Promise<Buffer> {
  if (!response.body) return Buffer.alloc(0);
  const reader = response.body.getReader();
  const chunks: Buffer[] = [];
  let total = 0;
  for (let next = await reader.read(); !next.done; next = await reader.read()) {
    total += next.value.length;
    if (total > MAX_DOWNLOAD_BYTES) {
      await reader.cancel().catch(() => {});
      throw new Error(`File exceeds the ${MAX_DOWNLOAD_BYTES} byte download limit`);
    }
    chunks.push(Buffer.from(next.value));
  }
  return Buffer.concat(chunks);
}

export const downloadFile = {
  name: "download_file",
  description: `Download a file from Telegram by its file_id. Images are returned as viewable content. Other files (PDFs, documents, voice/audio, etc.) are saved to a private temp file on the host running this MCP server and the absolute local path is returned; open that path with your file-reading tool (e.g. Read for PDFs) when you run on the same host. Saved files are deleted ${DOWNLOAD_RETENTION_MS / 3_600_000} hours after download; files over ${MAX_DOWNLOAD_BYTES / 1024 / 1024} MB are rejected.`,
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
      const bot = new TelegramBot(token, {
        polling: false,
        request: { timeout: REQUEST_TIMEOUT_MS } as TelegramBot.ConstructorOptions['request']
      });

      // Get file info from Telegram
      const file = await bot.getFile(validatedArgs.fileId);

      if (!file.file_path) {
        throw new Error("File path not available - file may be too large or unavailable");
      }

      // Download the file
      const fileUrl = `https://api.telegram.org/file/bot${token}/${file.file_path}`;
      const response = await fetch(fileUrl, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });

      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.status} ${response.statusText}`);
      }

      const buffer = await readBoundedBody(response);

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
      const { localPath, expiresAt } = await saveDownload(file.file_path, buffer);
      return {
        content: [{
          type: "text",
          text: `Downloaded file saved locally:\n**Local path:** ${localPath}\n**Size:** ${buffer.length} bytes\n**MIME:** ${mimeType}\n**Available until:** ${expiresAt.toISOString()} (deleted automatically afterwards; copy it elsewhere if you need it longer)\n\nThis absolute path is on the host running the Telegram MCP server. Read it directly from there (e.g. Read tool for PDFs); it is not accessible from a different machine.`
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
