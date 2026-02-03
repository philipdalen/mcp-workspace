import TelegramBot from 'node-telegram-bot-api';
import { z } from 'zod';
import { getBotToken } from '../index.js';

const DownloadFileSchema = z.object({
  token: z.string().optional().describe("Telegram bot token (optional if TELEGRAM_BOT_TOKEN env var is set)"),
  fileId: z.string().describe("Telegram file_id to download")
});

export const downloadFile = {
  name: "download_file",
  description: "Download a file from Telegram by its file_id. Returns images as viewable content, other files as base64. Use this to retrieve photos, voice messages, documents, etc. sent to the bot.",
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
    try {
      const validatedArgs = DownloadFileSchema.parse(args);
      const token = getBotToken(validatedArgs.token);
      const bot = new TelegramBot(token, { polling: false });

      // Get file info from Telegram
      const file = await bot.getFile(validatedArgs.fileId);

      if (!file.file_path) {
        throw new Error("File path not available - file may be too large or unavailable");
      }

      // Download the file
      const fileUrl = `https://api.telegram.org/file/bot${token}/${file.file_path}`;
      const response = await fetch(fileUrl);

      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.status} ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Data = buffer.toString('base64');

      // Determine file type from path
      const filePath = file.file_path.toLowerCase();
      const isImage = filePath.endsWith('.jpg') || filePath.endsWith('.jpeg') ||
                      filePath.endsWith('.png') || filePath.endsWith('.gif') ||
                      filePath.endsWith('.webp');
      const isAudio = filePath.endsWith('.ogg') || filePath.endsWith('.oga') ||
                      filePath.endsWith('.mp3') || filePath.endsWith('.m4a');

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
              data: base64Data,
              mimeType: mimeType
            }
          ]
        };
      }

      // For audio/voice, return metadata and base64 (for potential transcription)
      if (isAudio) {
        return {
          content: [{
            type: "text",
            text: `Downloaded audio file:\n**Path:** ${file.file_path}\n**Size:** ${file.file_size} bytes\n**MIME:** ${mimeType}\n**Base64 data:** ${base64Data.substring(0, 100)}...\n\nNote: To transcribe this audio, you would need a speech-to-text tool.`
          }]
        };
      }

      // For other files, return metadata and base64
      return {
        content: [{
          type: "text",
          text: `Downloaded file:\n**Path:** ${file.file_path}\n**Size:** ${file.file_size} bytes\n**MIME:** ${mimeType}\n**Base64 length:** ${base64Data.length} characters\n\nBase64 data (first 200 chars): ${base64Data.substring(0, 200)}...`
        }]
      };

    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Failed to download file: ${error instanceof Error ? error.message : String(error)}`
        }],
        isError: true
      };
    }
  }
};
