/**
 * getCalendarEventById tool
 * Gets a specific calendar event by ID from Teamwork
 */

import logger from "../../utils/logger.js";
import teamworkService from "../../services/index.js";

export const getCalendarEventByIdDefinition = {
  name: "getCalendarEventById",
  description: "Get a specific calendar event by ID from Teamwork. Returns an event with fields like 'start', 'end', 'all-day', 'where', 'attending-user-ids', 'notify-user-ids', etc.",
  inputSchema: {
    type: "object",
    properties: {
      eventId: {
        type: "integer",
        description: "The ID of the calendar event to retrieve"
      }
    },
    required: ["eventId"]
  },
  annotations: {
    title: "Get Calendar Event by ID",
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: false
  }
};

// Tool handler
export async function handleGetCalendarEventById(input: any) {
  logger.info("=== getCalendarEventById tool called ===");
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
    
    // Call the service to get the calendar event
    const event = await teamworkService.getCalendarEventById(String(eventId));
    
    logger.info("Calendar event retrieved successfully");
    logger.info(`Retrieved event response: ${JSON.stringify(event).substring(0, 200)}...`);
    
    // Ensure we return a properly formatted response
    const response = {
      content: [{
        type: "text",
        text: JSON.stringify(event, null, 2)
      }]
    };
    
    logger.info("=== getCalendarEventById tool completed successfully ===");
    return response;
  } catch (error: any) {
    logger.error(`Error in getCalendarEventById handler: ${error.message}`);
    if (error.stack) {
      logger.error(`Stack trace: ${error.stack}`);
    }
    
    // Return a properly formatted error response
    return {
      content: [{
        type: "text",
        text: `Error getting calendar event: ${error.message}`
      }]
    };
  }
}


