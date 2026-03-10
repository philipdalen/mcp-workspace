import TelegramBot from 'node-telegram-bot-api';
import { z } from 'zod';
import { getBotToken } from '../index.js';

const AnswerCallbackQuerySchema = z.object({
  token: z.string().optional().describe("Telegram bot token (optional if TELEGRAM_BOT_TOKEN env var is set)"),
  callbackQueryId: z.string().describe("Unique identifier for the callback query to answer (from callback_query.id in updates)"),
  text: z.string().optional().describe("Text of the notification (shown as a toast or alert)"),
  showAlert: z.boolean().optional().describe("If true, show an alert instead of a toast notification"),
  url: z.string().optional().describe("URL to open (e.g., a Game URL)"),
  cacheTime: z.number().optional().describe("Max time in seconds the result can be cached client-side (default 0)")
});

export const answerCallbackQuery = {
  name: "answer_callback_query",
  description: "Answer a callback query from an inline keyboard button press. Must be called after receiving a callback_query update, otherwise Telegram shows a loading spinner. Use allowedUpdates: ['callback_query'] in get_updates to receive button presses.",
  parameters: {
    type: "object",
    properties: {
      token: {
        type: "string",
        description: "Telegram bot token (optional if TELEGRAM_BOT_TOKEN env var is set)"
      },
      callbackQueryId: {
        type: "string",
        description: "Unique identifier for the callback query to answer (from callback_query.id in get_updates)"
      },
      text: {
        type: "string",
        description: "Text of the notification (shown as a toast or alert to the user)"
      },
      showAlert: {
        type: "boolean",
        description: "If true, show an alert dialog instead of a toast notification"
      },
      url: {
        type: "string",
        description: "URL to open (e.g., a Game URL)"
      },
      cacheTime: {
        type: "number",
        description: "Max time in seconds the result can be cached client-side (default 0)"
      }
    },
    required: ["callbackQueryId"]
  },

  async run(args: z.infer<typeof AnswerCallbackQuerySchema>) {
    try {
      const validatedArgs = AnswerCallbackQuerySchema.parse(args);

      const token = getBotToken(validatedArgs.token);
      const bot = new TelegramBot(token, { polling: false });

      const options: any = {};
      if (validatedArgs.text) options.text = validatedArgs.text;
      if (validatedArgs.showAlert) options.show_alert = validatedArgs.showAlert;
      if (validatedArgs.url) options.url = validatedArgs.url;
      if (validatedArgs.cacheTime !== undefined) options.cache_time = validatedArgs.cacheTime;

      await bot.answerCallbackQuery(validatedArgs.callbackQueryId, options);

      return {
        content: [{
          type: "text",
          text: `✅ Callback query answered successfully.${validatedArgs.text ? `\n**Text:** ${validatedArgs.text}` : ''}${validatedArgs.showAlert ? '\n**Mode:** Alert' : ''}`
        }]
      };

    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `❌ Failed to answer callback query: ${error instanceof Error ? error.message : String(error)}`
        }],
        isError: true
      };
    }
  }
};
