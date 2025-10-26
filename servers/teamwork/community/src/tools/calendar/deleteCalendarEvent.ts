/**
 * deleteCalendarEvent tool
 * Deletes a calendar event from Teamwork
 */

import logger from "../../utils/logger.js";
import teamworkService from "../../services/index.js";

export const deleteCalendarEventDefinition = {
  name: "deleteCalendarEvent",
  description: "Delete a calendar event from Teamwork. This action cannot be undone.",
  inputSchema: {
    type: "object",
    properties: {
      eventId: {
        type: "integer",
        description: "The ID of the calendar event to delete"
      }
    },
    required: ["eventId"]
  },
  annotations: {
    title: "Delete Calendar Event",
    readOnlyHint: false,
    destructiveHint: true,
    openWorldHint: false
  }
};

// Tool handler
export async function handleDeleteCalendarEvent(input: any) {
  logger.info("=== deleteCalendarEvent tool called ===");
  logger.info(`Input: ${JSON.stringify(input || {})}`);
  
  try {
    const eventId = input.eventId;
    
    if (!eventId) {
      logger.error("Missing eventId");
      return {
        content: [{
          type: "text",
          text: "Error: eventId is required"
        }]
      };
    }
    
    logger.info(`Deleting calendar event ${eventId}`);
    
    // Call the service to delete the calendar event
    const result = await teamworkService.deleteCalendarEvent(String(eventId));
    
    logger.info("Calendar event deleted successfully");
    logger.info(`Delete result: ${JSON.stringify(result).substring(0, 200)}...`);
    
    // Ensure we return a properly formatted response
    const response = {
      content: [{
        type: "text",
        text: JSON.stringify(result, null, 2)
      }]
    };
    
    logger.info("=== deleteCalendarEvent tool completed successfully ===");
    return response;
  } catch (error: any) {
    logger.error(`Error in deleteCalendarEvent handler: ${error.message}`);
    if (error.stack) {
      logger.error(`Stack trace: ${error.stack}`);
    }
    
    // Return a properly formatted error response
    return {
      content: [{
        type: "text",
        text: `Error deleting calendar event: ${error.message}`
      }]
    };
  }
}


