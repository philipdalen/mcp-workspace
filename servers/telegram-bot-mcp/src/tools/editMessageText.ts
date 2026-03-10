import TelegramBot from 'node-telegram-bot-api';
import { z } from 'zod';
import { getBotToken } from '../index.js';

const EditMessageTextSchema = z.object({
  token: z.string().optional().describe("Telegram bot token (optional if TELEGRAM_BOT_TOKEN env var is set)"),
  chatId: z.union([z.string(), z.number()]).describe("Chat ID where the message is"),
  messageId: z.number().describe("ID of the message to edit"),
  text: z.string().describe("New text for the message"),
  parseMode: z.enum(['HTML', 'Markdown', 'MarkdownV2']).optional().describe("Parse mode for text formatting"),
  disableWebPagePreview: z.boolean().optional().describe("Disable web page preview for links"),
  replyMarkup: z.any().optional().describe("New inline keyboard markup (InlineKeyboardMarkup only)")
});

export const editMessageText = {
  name: "edit_message_text",
  description: "Edit the text (and optionally the inline keyboard) of an existing message. Use this to update messages in-place after inline button presses.",
  parameters: {
    type: "object",
    properties: {
      token: {
        type: "string",
        description: "Telegram bot token (optional if TELEGRAM_BOT_TOKEN env var is set)"
      },
      chatId: {
        type: ["string", "number"],
        description: "Chat ID where the message is"
      },
      messageId: {
        type: "number",
        description: "ID of the message to edit"
      },
      text: {
        type: "string",
        description: "New text for the message"
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
      replyMarkup: {
        type: "object",
        description: "New inline keyboard markup. Use {inline_keyboard: [[{text, callback_data}]]} to set buttons, or {inline_keyboard: []} to remove them."
      }
    },
    required: ["chatId", "messageId", "text"]
  },

  async run(args: z.infer<typeof EditMessageTextSchema>) {
    try {
      const validatedArgs = EditMessageTextSchema.parse(args);

      const token = getBotToken(validatedArgs.token);
      const bot = new TelegramBot(token, { polling: false });

      const options: any = {
        chat_id: validatedArgs.chatId,
        message_id: validatedArgs.messageId
      };
      if (validatedArgs.parseMode) options.parse_mode = validatedArgs.parseMode;
      if (validatedArgs.disableWebPagePreview) options.disable_web_page_preview = validatedArgs.disableWebPagePreview;
      if (validatedArgs.replyMarkup) options.reply_markup = validatedArgs.replyMarkup;

      const result = await bot.editMessageText(validatedArgs.text, options);

      const msg = typeof result === 'object' ? result : null;
      return {
        content: [{
          type: "text",
          text: `✅ Message text edited successfully!\n\n**Chat ID:** ${validatedArgs.chatId}\n**Message ID:** ${validatedArgs.messageId}\n**New Text:** ${validatedArgs.text}`
        }]
      };

    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `❌ Failed to edit message text: ${error instanceof Error ? error.message : String(error)}`
        }],
        isError: true
      };
    }
  }
};
