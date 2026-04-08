import TelegramBot from 'node-telegram-bot-api';
import { z } from 'zod';
import { getBotToken } from '../index.js';

const SendPhotoSchema = z.object({
  token: z.string().optional().describe("Telegram bot token (optional if TELEGRAM_BOT_TOKEN env var is set)"),
  chatId: z.union([z.string(), z.number()]).describe("Chat ID or username"),
  photo: z.string().describe("Photo file path, URL, or file_id"),
  caption: z.string().optional().describe("Photo caption"),
  parseMode: z.enum(['HTML', 'Markdown', 'MarkdownV2']).optional().describe("Parse mode for caption"),
  disableNotification: z.boolean().optional().describe("Send photo silently"),
  replyToMessageId: z.number().optional().describe("Reply to specific message ID"),
  messageThreadId: z.number().optional().describe("Topic id for private chats with topics enabled"),
  replyMarkup: z.any().optional().describe("Reply markup: InlineKeyboardMarkup, ReplyKeyboardMarkup, ReplyKeyboardRemove, or ForceReply")
});

export const sendPhoto = {
  name: "send_photo",
  description: "Send a photo to a Telegram chat",
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
      photo: {
        type: "string",
        description: "Photo file path, URL, or Telegram file_id"
      },
      caption: {
        type: "string",
        description: "Photo caption (optional)"
      },
      parseMode: {
        type: "string",
        enum: ["HTML", "Markdown", "MarkdownV2"],
        description: "Parse mode for caption formatting"
      },
      disableNotification: {
        type: "boolean",
        description: "Send photo silently (no notification)"
      },
      replyToMessageId: {
        type: "number",
        description: "Reply to specific message ID"
      },
      messageThreadId: {
        type: "number",
        description: "Topic id for private chats with topics enabled"
      },
      replyMarkup: {
        type: "object",
        description: "Reply markup. Supports: InlineKeyboardMarkup ({inline_keyboard: [[{text, callback_data?, url?, style?, icon_custom_emoji_id?}]]}), ReplyKeyboardMarkup ({keyboard: [[{text, style?, icon_custom_emoji_id?}]], resize_keyboard?, one_time_keyboard?, is_persistent?}), ReplyKeyboardRemove ({remove_keyboard: true}), ForceReply ({force_reply: true}). Button style can be \"danger\" (red), \"primary\" (blue), or \"success\" (green)."
      }
    },
    required: ["chatId", "photo"]
  },

  async run(args: z.infer<typeof SendPhotoSchema>) {
    try {
      // Parameter validation
      const validatedArgs = SendPhotoSchema.parse(args);

      // Create bot instance
      const token = getBotToken(validatedArgs.token);
      const bot = new TelegramBot(token);

      // Prepare options
      const options: any = {};
      if (validatedArgs.caption) options.caption = validatedArgs.caption;
      if (validatedArgs.parseMode) options.parse_mode = validatedArgs.parseMode;
      if (validatedArgs.disableNotification) options.disable_notification = validatedArgs.disableNotification;
      if (validatedArgs.replyToMessageId) options.reply_to_message_id = validatedArgs.replyToMessageId;
      if (validatedArgs.messageThreadId) options.message_thread_id = validatedArgs.messageThreadId;
      if (validatedArgs.replyMarkup) options.reply_markup = validatedArgs.replyMarkup;

      // Send photo
      const result = await bot.sendPhoto(validatedArgs.chatId, validatedArgs.photo, options);

      return {
        content: [{
          type: "text",
          text: `✅ Photo sent successfully!\n\n**Message ID:** ${result.message_id}\n**Chat ID:** ${result.chat.id}\n**Date:** ${new Date(result.date * 1000).toISOString()}\n**Photo ID:** ${result.photo?.[0]?.file_id}\n**Caption:** ${result.caption || 'No caption'}`
        }]
      };

    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `❌ Failed to send photo: ${error instanceof Error ? error.message : String(error)}`
        }],
        isError: true
      };
    }
  }
};
