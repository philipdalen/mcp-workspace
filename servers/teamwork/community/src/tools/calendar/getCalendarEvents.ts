/**
 * getCalendarEvents tool
 * Gets calendar events from Teamwork
 */

import logger from "../../utils/logger.js";
import teamworkService from "../../services/index.js";

export const getCalendarEventsDefinition = {
  name: "getCalendarEvents",
  description: "Get calendar events from Teamwork. Retrieve calendar events within a specified date range. Returns events with fields like 'start', 'end', 'all-day', 'where', 'attending-user-ids', 'notify-user-ids', etc.",
  inputSchema: {
    type: "object",
    properties: {
      startDate: {
        type: "string",
        description: "Start date for calendar events in YYYYMMDD format (e.g., 20250101)"
      },
      endDate: {
        type: "string",
        description: "End date for calendar events in YYYYMMDD format (e.g., 20251231)"
      },
      showDeleted: {
        type: "boolean",
        description: "Include deleted calendar events in the results"
      },
      updatedAfterDate: {
        type: "string",
        description: "Filter events updated after this date (YYYYMMDD format)"
      },
      eventTypeId: {
        type: "integer",
        description: "Filter by event type ID"
      },
      page: {
        type: "integer",
        description: "Page number for pagination"
      },
      userId: {
        type: "integer",
        description: "Filter by user ID - only show events for this user"
      },
      attendingOnly: {
        type: "boolean",
        description: "Only show events where the user is attending"
      }
    },
    required: []
  },
  annotations: {
    title: "Get Calendar Events",
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: false
  }
};

// Tool handler
export async function handleGetCalendarEvents(input: any) {
  logger.info("=== getCalendarEvents tool called ===");
  logger.info(`Input: ${JSON.stringify(input || {})}`);
  
  try {
    // Call the service to get calendar events
    const events = await teamworkService.getCalendarEvents(input);
    
    logger.info("Calendar events retrieved successfully");
    logger.info(`Retrieved events response: ${JSON.stringify(events).substring(0, 200)}...`);
    
    // Ensure we return a properly formatted response
    const response = {
      content: [{
        type: "text",
        text: JSON.stringify(events, null, 2)
      }]
    };
    
    logger.info("=== getCalendarEvents tool completed successfully ===");
    return response;
  } catch (error: any) {
    logger.error(`Error in getCalendarEvents handler: ${error.message}`);
    if (error.stack) {
      logger.error(`Stack trace: ${error.stack}`);
    }
    
    // Return a properly formatted error response
    return {
      content: [{
        type: "text",
        text: `Error getting calendar events: ${error.message}`
      }]
    };
  }
}


