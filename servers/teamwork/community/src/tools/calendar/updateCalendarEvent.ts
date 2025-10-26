/**
 * updateCalendarEvent tool
 * Updates an existing calendar event in Teamwork
 */

import logger from "../../utils/logger.js";
import teamworkService from "../../services/index.js";

export const updateCalendarEventDefinition = {
  name: "updateCalendarEvent",
  description: "Update an existing calendar event in Teamwork. Use ISO 8601 datetime format (YYYY-MM-DDTHH:MM) for start and end times. All fields are optional except eventId.",
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


