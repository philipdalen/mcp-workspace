import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getErrorToolResult, textToolResult } from "./tool-utils.js";
import { GraphService } from "../simply-outlook/graph-service.js";

export const LIST_OUTLOOK_MESSAGE_ATTACHMENTS_TOOL_NAME = "list-outlook-message-attachments";

export const registerListOutlookMessageAttachmentsTool = async (server: McpServer, graphService: GraphService, toolNamePrefix: string) => {
  server.tool(
    `${toolNamePrefix}${LIST_OUTLOOK_MESSAGE_ATTACHMENTS_TOOL_NAME}`,
    "List the attachments on a specific Outlook mail message (name, content type, size, attachment ID). Use this before download-outlook-message-attachment to find the attachment ID to download.",
    {
      messageId: z
        .string()
        .describe(
          "The unique identifier of the mail message to list attachments for. This is a base64-encoded string that uniquely identifies the message in the user's mailbox. Preserve the exact ID format including any trailing '=' padding characters."
        ),
    },
    async ({ messageId }) => {
      try {
        const attachments = await graphService.listMessageAttachments(messageId);
        if (!attachments.length) {
          return textToolResult(["This message has no attachments."]);
        }

        const attachmentList = attachments.map((attachment) => ({
          id: attachment.id,
          name: attachment.name,
          contentType: attachment.contentType,
          size: attachment.size,
          isInline: attachment.isInline,
        }));

        return textToolResult([
          `There are ${attachments.length} attachment(s) on this message:`,
          JSON.stringify(attachmentList, null, 2),
        ]);
      } catch (error) {
        return getErrorToolResult(error, "Failed to list message attachments.");
      }
    }
  );
};
