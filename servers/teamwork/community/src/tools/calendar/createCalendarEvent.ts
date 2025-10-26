/**
 * createCalendarEvent tool
 * Creates a new calendar event in Teamwork
 */

import logger from "../../utils/logger.js";
import teamworkService from "../../services/index.js";

export const createCalendarEventDefinition = {
  name: "createCalendarEvent",
  description: "Create a new calendar event in Teamwork. Calendar events can be meetings, appointments, or any time-based activities. Use ISO 8601 datetime format (YYYY-MM-DDTHH:MM) for start and end times.",
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
          start: {
            type: "string",
            description: "Start datetime in ISO 8601 format (e.g., 2026-01-15T09:00)"
          },
          end: {
            type: "string",
            description: "End datetime in ISO 8601 format (e.g., 2026-01-15T10:00)"
          },
          "all-day": {
            type: "boolean",
            description: "Whether this is an all-day event"
          },
          description: {
            type: "string",
            description: "Description of the calendar event"
          },
          where: {
            type: "string",
            description: "Location of the calendar event"
          },
          repeat: {
            type: "object",
            properties: {
              frequency: {
                type: "string",
                enum: ["none", "daily", "weekly", "monthly", "yearly"],
                description: "Repeat frequency for recurring events"
              }
            },
            description: "Repeat settings for recurring events"
          },
          privacy: {
            type: "object",
            properties: {
              type: {
                type: "string",
                description: "Privacy type (e.g., 'company')"
              }
            },
            description: "Privacy settings for the event"
          },
          "show-as-busy": {
            type: "boolean",
            description: "Whether to show as busy during this event"
          },
          type: {
            type: "object",
            properties: {
              id: {
                type: "integer",
                description: "Event type ID"
              },
              color: {
                type: "string",
                description: "Event type color (hex format without #, e.g., 'FF7641')"
              },
              name: {
                type: "string",
                description: "Event type name"
              }
            },
            description: "Event type information"
          },
          notify: {
            type: "boolean",
            description: "Whether to send notifications"
          },
          "attendees-can-edit": {
            type: "boolean",
            description: "Whether attendees can edit the event"
          },
          "project-users-can-edit": {
            type: "boolean",
            description: "Whether project users can edit the event"
          },
          "notify-current-user": {
            type: "boolean",
            description: "Whether to notify the current user"
          },
          reminders: {
            type: "array",
            description: "Array of reminder settings",
            items: {
              type: "object"
            }
          },
          "attending-user-ids": {
            type: "string",
            description: "Comma-separated list of user IDs attending the event (e.g., '85696,407292')"
          },
          "notify-user-ids": {
            type: "string",
            description: "Comma-separated list of user IDs to notify (e.g., '85696')"
          },
          "email-user-ids": {
            type: "string",
            description: "Comma-separated list of user IDs to email"
          },
          projectId: {
            type: "integer",
            description: "Associate the event with a specific project"
          }
        },
        required: ["title", "start", "end"]
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
    
    if (!input.event.start) {
      logger.error("Missing event start datetime");
      return {
        content: [{
          type: "text",
          text: "Error: event.start is required (format: YYYY-MM-DDTHH:MM)"
        }]
      };
    }
    
    if (!input.event.end) {
      logger.error("Missing event end datetime");
      return {
        content: [{
          type: "text",
          text: "Error: event.end is required (format: YYYY-MM-DDTHH:MM)"
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


