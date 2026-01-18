import TelegramBot from 'node-telegram-bot-api';
import { z } from 'zod';
import { getBotToken } from '../index.js';

const GetUpdatesSchema = z.object({
  token: z.string().optional().describe("Telegram bot token (optional if TELEGRAM_BOT_TOKEN env var is set)"),
  offset: z.number().optional().describe("Identifier of the first update to be returned"),
  limit: z.number().min(1).max(100).optional().describe("Limits the number of updates (1-100, default 100)"),
  timeout: z.number().optional().describe("Timeout in seconds for long polling (0 for short polling)"),
  allowedUpdates: z.array(z.string()).optional().describe("List of update types to receive")
});

export const getUpdates = {
  name: "get_updates",
  description: "Get incoming updates (messages, callbacks, etc.) for the bot using long polling",
  parameters: {
    type: "object",
    properties: {
      token: {
        type: "string",
        description: "Telegram bot token (optional if TELEGRAM_BOT_TOKEN env var is set)"
      },
      offset: {
        type: "number",
        description: "Identifier of the first update to be returned. Use last update_id + 1 to confirm receipt and get new updates only"
      },
      limit: {
        type: "number",
        description: "Limits the number of updates to be retrieved (1-100, default 100)"
      },
      timeout: {
        type: "number",
        description: "Timeout in seconds for long polling (0 = short polling, default 0)"
      },
      allowedUpdates: {
        type: "array",
        items: { type: "string" },
        description: "List of update types to receive (e.g., ['message', 'callback_query'])"
      }
    },
    required: []
  },

  async run(args: z.infer<typeof GetUpdatesSchema>) {
    try {
      // Parameter validation
      const validatedArgs = GetUpdatesSchema.parse(args);

      // Create bot instance (polling disabled - we'll call getUpdates manually)
      const token = getBotToken(validatedArgs.token);
      const bot = new TelegramBot(token, { polling: false });

      // Prepare options
      const options: any = {};
      if (validatedArgs.offset !== undefined) options.offset = validatedArgs.offset;
      if (validatedArgs.limit !== undefined) options.limit = validatedArgs.limit;
      if (validatedArgs.timeout !== undefined) options.timeout = validatedArgs.timeout;
      if (validatedArgs.allowedUpdates) options.allowed_updates = validatedArgs.allowedUpdates;

      // Get updates
      const updates = await bot.getUpdates(options);

      if (updates.length === 0) {
        return {
          content: [{
            type: "text",
            text: "📭 No new updates available."
          }]
        };
      }

      // Format updates for display
      const formattedUpdates = updates.map((update: any) => {
        let summary = `**Update ID:** ${update.update_id}\n`;

        if (update.message) {
          const msg = update.message;
          summary += `**Type:** Message\n`;
          summary += `**From:** ${msg.from?.first_name || 'Unknown'} ${msg.from?.last_name || ''} (@${msg.from?.username || 'no username'})\n`;
          summary += `**Chat ID:** ${msg.chat.id}\n`;
          summary += `**Chat Type:** ${msg.chat.type}\n`;
          if (msg.text) summary += `**Text:** ${msg.text}\n`;
          if (msg.photo) summary += `**Contains:** Photo\n`;
          if (msg.document) summary += `**Contains:** Document\n`;
          if (msg.video) summary += `**Contains:** Video\n`;
          summary += `**Date:** ${new Date(msg.date * 1000).toISOString()}`;
        } else if (update.callback_query) {
          const cb = update.callback_query;
          summary += `**Type:** Callback Query\n`;
          summary += `**From:** ${cb.from?.first_name || 'Unknown'} (@${cb.from?.username || 'no username'})\n`;
          summary += `**Data:** ${cb.data || 'none'}`;
        } else if (update.edited_message) {
          summary += `**Type:** Edited Message\n`;
          summary += `**Chat ID:** ${update.edited_message.chat.id}`;
        } else if (update.channel_post) {
          summary += `**Type:** Channel Post\n`;
          summary += `**Channel:** ${update.channel_post.chat.title || update.channel_post.chat.id}`;
        } else {
          summary += `**Type:** Other update type`;
        }

        return summary;
      });

      const lastUpdateId = updates[updates.length - 1].update_id;

      return {
        content: [{
          type: "text",
          text: `📬 Received ${updates.length} update(s)\n\n**Next offset to use:** ${lastUpdateId + 1}\n\n---\n\n${formattedUpdates.join('\n\n---\n\n')}`
        }]
      };

    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `❌ Failed to get updates: ${error instanceof Error ? error.message : String(error)}`
        }],
        isError: true
      };
    }
  }
};
