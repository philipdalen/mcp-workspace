import TelegramBot from 'node-telegram-bot-api';
import { z } from 'zod';
import { getBotToken } from '../index.js';

const SendDocumentSchema = z.object({
  token: z.string().optional().describe("Telegram bot token (optional if TELEGRAM_BOT_TOKEN env var is set)"),
  chatId: z.union([z.string(), z.number()]).describe("Chat ID or username"),
  document: z.string().describe("Document file path, URL, or file_id"),
  caption: z.string().optional().describe("Document caption"),
  parseMode: z.enum(['HTML', 'Markdown', 'MarkdownV2']).optional().describe("Parse mode for caption"),
  disableNotification: z.boolean().optional().describe("Send document silently"),
  replyToMessageId: z.number().optional().describe("Reply to specific message ID"),
  filename: z.string().optional().describe("Custom filename for the document")
});

export const sendDocument = {
  name: "send_document",
  description: "Send a document to a Telegram chat",
  parameters: {
    type: "object",
    properties: {
      token: {
        type: "string",
        description: "Telegram bot token (optional if TELEGRAM_BOT_TOKEN env var is set)"
      },
      chatId: {
        type: ["string", "number"],
        description: "Chat ID or username (e.g., @username or -1001234567890)"
      },
      document: {
        type: "string",
        description: "Document file path, URL, or Telegram file_id"
      },
      caption: {
        type: "string",
        description: "Document caption (optional)"
      },
      parseMode: {
        type: "string",
        enum: ["HTML", "Markdown", "MarkdownV2"],
        description: "Parse mode for caption formatting"
      },
      disableNotification: {
        type: "boolean",
        description: "Send document silently (no notification)"
      },
      replyToMessageId: {
        type: "number",
        description: "Reply to specific message ID"
      },
      filename: {
        type: "string",
        description: "Custom filename for the document"
      }
    },
    required: ["chatId", "document"]
  },

  async run(args: z.infer<typeof SendDocumentSchema>) {
    try {
      // Parameter validation
      const validatedArgs = SendDocumentSchema.parse(args);

      // Create bot instance
      const token = getBotToken(validatedArgs.token);
      const bot = new TelegramBot(token);

      // Prepare options
      const options: any = {};
      if (validatedArgs.caption) options.caption = validatedArgs.caption;
      if (validatedArgs.parseMode) options.parse_mode = validatedArgs.parseMode;
      if (validatedArgs.disableNotification) options.disable_notification = validatedArgs.disableNotification;
      if (validatedArgs.replyToMessageId) options.reply_to_message_id = validatedArgs.replyToMessageId;

      // Handle custom filename
      let documentInput = validatedArgs.document;
      if (validatedArgs.filename && !validatedArgs.document.startsWith('http') && !validatedArgs.document.includes('/')) {
        // If it's a file_id and we have a custom filename, we need to handle it differently
        documentInput = validatedArgs.document;
        options.filename = validatedArgs.filename;
      }

      // Send document
      const result = await bot.sendDocument(validatedArgs.chatId, documentInput, options);

      return {
        content: [{
          type: "text",
          text: `✅ Document sent successfully!\n\n**Message ID:** ${result.message_id}\n**Chat ID:** ${result.chat.id}\n**Date:** ${new Date(result.date * 1000).toISOString()}\n**Document ID:** ${result.document?.file_id}\n**Filename:** ${result.document?.file_name || 'Unknown'}\n**Size:** ${result.document?.file_size ? `${Math.round(result.document.file_size / 1024)} KB` : 'Unknown'}\n**Caption:** ${result.caption || 'No caption'}`
        }]
      };

    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `❌ Failed to send document: ${error instanceof Error ? error.message : String(error)}`
        }],
        isError: true
      };
    }
  }
};
