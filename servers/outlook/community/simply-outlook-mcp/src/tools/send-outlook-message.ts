import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getErrorToolResult, textToolResult } from "./tool-utils.js";
import { GraphService } from "../simply-outlook/graph-service.js";

export const SEND_OUTLOOK_MESSAGE_TOOL_NAME = "send-outlook-message";

export const registerSendOutlookMessageTool = async (server: McpServer, graphService: GraphService, toolNamePrefix: string) => {
  server.tool(
    `${toolNamePrefix}${SEND_OUTLOOK_MESSAGE_TOOL_NAME}`,
    "Send a new mail message through Outlook to specified recipients.",
    {
      subject: z.string().describe("The subject line of the email message."),
      content: z.string().describe("The content/body of the email message. Must be in markdown or plain text format."),
      recipientEmails: z.string().array().describe("Array of email addresses to send the message to."),
      attachments: z
        .string()
        .array()
        .optional()
        .describe(
          "Optional array of absolute local file paths to attach to the message. '~' is expanded to the user's home directory. Files up to 150MB each are supported (files larger than 3MB are uploaded via a Graph upload session)."
        ),
    },
    async ({ subject, content, recipientEmails, attachments: attachmentPaths }) => {
      try {
        if (!recipientEmails || recipientEmails.length === 0) {
          throw new Error("At least one recipient email address is required.");
        }

        await graphService.sendOutlookMessage(subject, content, recipientEmails, attachmentPaths);

        const attachmentNote = attachmentPaths?.length ? ` with ${attachmentPaths.length} attachment(s)` : "";
        return textToolResult([`Successfully sent Outlook message${attachmentNote}.`]);
      } catch (error) {
        return getErrorToolResult(error, "Failed to send Outlook message.");
      }
    }
  );
};
