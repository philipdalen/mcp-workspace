/**
 * getNotifications tool
 * Retrieves notifications from Teamwork with optional filtering
 */

import logger from "../../utils/logger.js";
import teamworkService from "../../services/index.js";

// Tool definition
export const getNotificationsDefinition = {
    name: "getNotifications",
    description:
        "Get notifications from Teamwork. Can filter by read/unread status and limit results.",
    inputSchema: {
        type: "object",
        properties: {
            unreadOnly: {
                type: "boolean",
                description: "If true, only return unread notifications",
            },
            readOnly: {
                type: "boolean",
                description: "If true, only return read notifications",
            },
            limit: {
                type: "integer",
                description:
                    "Maximum number of notifications to return (default: 20)",
            },
            pageOffset: {
                type: "integer",
                description: "Number of notifications to skip for pagination",
            },
        },
        required: [],
    },
    annotations: {
        title: "Get Notifications",
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
    },
};

// Tool handler
export async function handleGetNotifications(input: any) {
    logger.info("Calling teamworkService.getNotifications()");
    logger.info(`Parameters: ${JSON.stringify(input || {})}`);

    try {
        const params = {
            unreadOnly: input?.unreadOnly,
            readOnly: input?.readOnly,
            limit: input?.limit,
            pageOffset: input?.pageOffset,
        };

        const result = await teamworkService.getNotifications(params);

        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };
    } catch (error: any) {
        logger.error(`Error in getNotifications handler: ${error.message}`);
        return {
            content: [
                {
                    type: "text",
                    text: `Error retrieving notifications: ${error.message}`,
                },
            ],
        };
    }
}



