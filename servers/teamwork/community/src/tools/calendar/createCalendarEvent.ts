/**
 * createCalendarEvent tool
 * Creates a new calendar event in Teamwork
 */

import logger from "../../utils/logger.js";
import teamworkService from "../../services/index.js";

export const createCalendarEventDefinition = {
  name: "createCalendarEvent",
  description: "Create a new calendar event in Teamwork. Calendar events can be meetings, appointments, or any time-based activities.",
  inputSchema: {
    type: "object",
    properties: {
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
        required: ["title", "startDate", "endDate"]
      }
    },
    required: ["event"]
  },
  annotations: {
    title: "Create Calendar Event",
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: false
  }
};

// Tool handler
export async function handleCreateCalendarEvent(input: any) {
  logger.info("=== createCalendarEvent tool called ===");
  logger.info(`Input: ${JSON.stringify(input || {})}`);
  
  try {
    // Validate event data
    if (!input.event) {
      logger.error("Missing event object");
      return {
        content: [{
          type: "text",
          text: "Error: event object is required"
        }]
      };
    }
    
    if (!input.event.title) {
      logger.error("Missing event title");
      return {
        content: [{
          type: "text",
          text: "Error: event.title is required"
        }]
      };
    }
    
    if (!input.event.startDate) {
      logger.error("Missing event startDate");
      return {
        content: [{
          type: "text",
          text: "Error: event.startDate is required"
        }]
      };
    }
    
    if (!input.event.endDate) {
      logger.error("Missing event endDate");
      return {
        content: [{
          type: "text",
          text: "Error: event.endDate is required"
        }]
      };
    }
    
    logger.info(`Creating calendar event "${input.event.title}"`);
    
    // Call the service to create the calendar event
    const createdEvent = await teamworkService.createCalendarEvent(input);
    
    logger.info("Calendar event created successfully");
    logger.info(`Created event response: ${JSON.stringify(createdEvent).substring(0, 200)}...`);
    
    // Ensure we return a properly formatted response
    const response = {
      content: [{
        type: "text",
        text: JSON.stringify(createdEvent, null, 2)
      }]
    };
    
    logger.info("=== createCalendarEvent tool completed successfully ===");
    return response;
  } catch (error: any) {
    logger.error(`Error in createCalendarEvent handler: ${error.message}`);
    if (error.stack) {
      logger.error(`Stack trace: ${error.stack}`);
    }
    
    // Return a properly formatted error response
    return {
      content: [{
        type: "text",
        text: `Error creating calendar event: ${error.message}`
      }]
    };
  }
}


