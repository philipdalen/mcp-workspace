import TelegramBot from 'node-telegram-bot-api';
import { z } from 'zod';
import { getBotToken } from '../index.js';

const SendMessageSchema = z.object({
  token: z.string().optional().describe("Telegram bot token (optional if TELEGRAM_BOT_TOKEN env var is set)"),
  chatId: z.union([z.string(), z.number()]).describe("Chat ID or username"),
  text: z.string().describe("Message text to send"),
  parseMode: z.enum(['HTML', 'Markdown', 'MarkdownV2']).optional().describe("Parse mode for formatting"),
  disableWebPagePreview: z.boolean().optional().describe("Disable web page preview"),
  disableNotification: z.boolean().optional().describe("Send message silently"),
  replyToMessageId: z.number().optional().describe("Reply to specific message ID")
});

export const sendMessage = {
  name: "send_message",
  description: "Send a text message to a Telegram chat",
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
      text: {
        type: "string",
        description: "Message text to send"
      },
      parseMode: {
        type: "string",
        enum: ["HTML", "Markdown", "MarkdownV2"],
        description: "Parse mode for text formatting"
      },
      disableWebPagePreview: {
        type: "boolean",
        description: "Disable web page preview for links"
      },
      disableNotification: {
        type: "boolean",
        description: "Send message silently (no notification)"
      },
      replyToMessageId: {
        type: "number",
        description: "Reply to specific message ID"
      }
    },
    required: ["chatId", "text"]
  },
  
  async run(args: z.infer<typeof SendMessageSchema>) {
    try {
      // Parameter validation
      const validatedArgs = SendMessageSchema.parse(args);

      // Create bot instance
      const token = getBotToken(validatedArgs.token);
      const bot = new TelegramBot(token);
      
      // Prepare options
      const options: any = {};
      if (validatedArgs.parseMode) options.parse_mode = validatedArgs.parseMode;
      if (validatedArgs.disableWebPagePreview) options.disable_web_page_preview = validatedArgs.disableWebPagePreview;
      if (validatedArgs.disableNotification) options.disable_notification = validatedArgs.disableNotification;
      if (validatedArgs.replyToMessageId) options.reply_to_message_id = validatedArgs.replyToMessageId;
      
      // Send message
      const result = await bot.sendMessage(validatedArgs.chatId, validatedArgs.text, options);
      
      return {
        content: [{
          type: "text",
          text: `✅ Message sent successfully!\n\n**Message ID:** ${result.message_id}\n**Chat ID:** ${result.chat.id}\n**Date:** ${new Date(result.date * 1000).toISOString()}\n**Text:** ${result.text}`
        }]
      };
      
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `❌ Failed to send message: ${error instanceof Error ? error.message : String(error)}`
        }],
        isError: true
      };
    }
  }
};