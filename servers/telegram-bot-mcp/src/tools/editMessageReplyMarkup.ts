import TelegramBot from 'node-telegram-bot-api';
import { z } from 'zod';
import { getBotToken } from '../index.js';

const EditMessageReplyMarkupSchema = z.object({
  token: z.string().optional().describe("Telegram bot token (optional if TELEGRAM_BOT_TOKEN env var is set)"),
  chatId: z.union([z.string(), z.number()]).describe("Chat ID where the message is"),
  messageId: z.number().describe("ID of the message to edit"),
  replyMarkup: z.any().optional().describe("New inline keyboard markup (InlineKeyboardMarkup). Omit or pass {inline_keyboard: []} to remove buttons.")
});

export const editMessageReplyMarkup = {
  name: "edit_message_reply_markup",
  description: "Edit only the inline keyboard of an existing message without changing the text. Useful for updating button states or removing buttons after a selection.",
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
      replyMarkup: {
        type: "object",
        description: "New inline keyboard markup. Use {inline_keyboard: [[{text, callback_data}]]} to set buttons, or omit / pass {inline_keyboard: []} to remove all buttons."
      }
    },
    required: ["chatId", "messageId"]
  },

  async run(args: z.infer<typeof EditMessageReplyMarkupSchema>) {
    try {
      const validatedArgs = EditMessageReplyMarkupSchema.parse(args);

      const token = getBotToken(validatedArgs.token);
      const bot = new TelegramBot(token, { polling: false });

      const markup = validatedArgs.replyMarkup || { inline_keyboard: [] };

      const options: any = {
        chat_id: validatedArgs.chatId,
        message_id: validatedArgs.messageId
      };

      await bot.editMessageReplyMarkup(markup, options);

      return {
        content: [{
          type: "text",
          text: `✅ Message reply markup edited successfully!\n\n**Chat ID:** ${validatedArgs.chatId}\n**Message ID:** ${validatedArgs.messageId}\n**Markup:** ${JSON.stringify(markup)}`
        }]
      };

    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `❌ Failed to edit message reply markup: ${error instanceof Error ? error.message : String(error)}`
        }],
        isError: true
      };
    }
  }
};
