/**
 * getUnreadCount tool
 * Retrieves the count of unread notifications from Teamwork
 */

import logger from "../../utils/logger.js";
import teamworkService from "../../services/index.js";

// Tool definition
export const getUnreadCountDefinition = {
  name: "getUnreadCount",
  description: "Get the count of unread notifications from Teamwork",
  inputSchema: {
    type: "object",
    properties: {},
    required: []
  },
  annotations: {
    title: "Get Unread Notification Count",
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: false
  }
};

// Tool handler
export async function handleGetUnreadCount(input: any) {
  logger.info('Calling teamworkService.getUnreadCount()');
  
  try {
    const result = await teamworkService.getUnreadCount();
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify(result, null, 2)
      }]
    };
  } catch (error: any) {
    logger.error(`Error in getUnreadCount handler: ${error.message}`);
    return {
      content: [{
        type: "text",
        text: `Error retrieving unread notification count: ${error.message}`
      }]
    };
  }
}
















