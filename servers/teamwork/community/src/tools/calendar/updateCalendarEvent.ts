/**
 * updateCalendarEvent tool
 * Updates an existing calendar event in Teamwork
 */

import logger from "../../utils/logger.js";
import teamworkService from "../../services/index.js";

export const updateCalendarEventDefinition = {
  name: "updateCalendarEvent",
  description: "Update an existing calendar event in Teamwork.",
  inputSchema: {
    type: "object",
    properties: {
      eventId: {
        type: "integer",
        description: "The ID of the calendar event to update"
      },
      event: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "Title of the calendar event"
          },
          description: {
            type: "string",
            description: "Description of the calendar event"
          },
          startDate: {
            type: "string",
            description: "Start date in YYYYMMDD format (e.g., 20250122)"
          },
          startTime: {
            type: "string",
            description: "Start time in HH:MM format (e.g., 09:00)"
          },
          endDate: {
            type: "string",
            description: "End date in YYYYMMDD format (e.g., 20250122)"
          },
          endTime: {
            type: "string",
            description: "End time in HH:MM format (e.g., 10:00)"
          },
          isAllDay: {
            type: "boolean",
            description: "Whether this is an all-day event"
          },
          location: {
            type: "string",
            description: "Location of the calendar event"
          },
          remindBefore: {
            type: "integer",
            description: "Number of minutes before the event to send a reminder"
          },
          repeatType: {
            type: "string",
            enum: ["none", "daily", "weekly", "monthly", "yearly"],
            description: "Repeat type for recurring events"
          },
          repeatEndDate: {
            type: "string",
            description: "End date for recurring events in YYYYMMDD format"
          },
          attendees: {
            type: "object",
            properties: {
              userIds: {
                type: "array",
                items: {
                  type: "integer"
                },
                description: "List of user IDs attending this event"
              },
              companyIds: {
                type: "array",
                items: {
                  type: "integer"
                },
                description: "List of company IDs attending this event"
              }
            },
            description: "Attendees for the calendar event"
          },
          projectId: {
            type: "integer",
            description: "Associate the event with a specific project"
          }
        },
        required: []
      }
    },
    required: ["eventId", "event"]
  },
  annotations: {
    title: "Update Calendar Event",
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: false
  }
};

// Tool handler
export async function handleUpdateCalendarEvent(input: any) {
  logger.info("=== updateCalendarEvent tool called ===");
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
    
    if (!input.event) {
      logger.error("Missing event object");
      return {
        content: [{
          type: "text",
          text: "Error: event object is required"
        }]
      };
    }
    
    logger.info(`Updating calendar event ${eventId}`);
    
    // Call the service to update the calendar event
    const updatedEvent = await teamworkService.updateCalendarEvent(String(eventId), input);
    
    logger.info("Calendar event updated successfully");
    logger.info(`Updated event response: ${JSON.stringify(updatedEvent).substring(0, 200)}...`);
    
    // Ensure we return a properly formatted response
    const response = {
      content: [{
        type: "text",
        text: JSON.stringify(updatedEvent, null, 2)
      }]
    };
    
    logger.info("=== updateCalendarEvent tool completed successfully ===");
    return response;
  } catch (error: any) {
    logger.error(`Error in updateCalendarEvent handler: ${error.message}`);
    if (error.stack) {
      logger.error(`Stack trace: ${error.stack}`);
    }
    
    // Return a properly formatted error response
    return {
      content: [{
        type: "text",
        text: `Error updating calendar event: ${error.message}`
      }]
    };
  }
}


