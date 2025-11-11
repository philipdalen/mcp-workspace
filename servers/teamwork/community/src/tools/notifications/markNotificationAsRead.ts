/**
 * markNotificationAsRead tool
 * Updates the read status of a specific notification in Teamwork
 */

import logger from "../../utils/logger.js";
import teamworkService from "../../services/index.js";

// Tool definition
export const markNotificationAsReadDefinition = {
  name: "markNotificationAsRead",
  description: "Mark a specific notification as read or unread in Teamwork",
  inputSchema: {
    type: "object",
    properties: {
      notificationId: {
        type: "integer",
        description: "The ID of the notification to update"
      },
      read: {
        type: "boolean",
        description: "Whether to mark the notification as read (true) or unread (false). Defaults to true."
      }
    },
    required: ["notificationId"]
  },
  annotations: {
    title: "Mark Notification as Read/Unread",
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: false
  }
};

// Tool handler
export async function handleMarkNotificationAsRead(input: any) {
  logger.info('Calling teamworkService.markNotificationAsRead()');
  logger.info(`Notification ID: ${input?.notificationId}`);
  logger.info(`Read status: ${input?.read !== undefined ? input.read : true}`);
  
  try {
    const notificationId = String(input?.notificationId);
    if (!notificationId) {
      throw new Error("Notification ID is required");
    }
    
    const read = input?.read !== undefined ? Boolean(input.read) : true;
    
    const result = await teamworkService.markNotificationAsRead(notificationId, read);
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify(result, null, 2)
      }]
    };
  } catch (error: any) {
    logger.error(`Error in markNotificationAsRead handler: ${error.message}`);
    return {
      content: [{
        type: "text",
        text: `Error updating notification read status: ${error.message}`
      }]
    };
  }
}


