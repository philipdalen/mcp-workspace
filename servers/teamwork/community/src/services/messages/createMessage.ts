import logger from "../../utils/logger.js";
import { getApiClientForVersion } from "../core/apiClient.js";

/**
 * Creates a new message (post) in Teamwork
 * Uses v1 API endpoint: POST /projects/{projectId}/posts.json
 * @param messageData The message data
 * @returns The API response with the created message
 */
export const createMessage = async (messageData: {
    projectId: number;
    title: string;
    body: string;
    categoryId?: number;
    categoryName?: string;
    tagIds?: number[];
    isPrivate?: boolean;
    notify?: string; // 'all' to notify all project users, 'true' to notify followers, or comma-separated user IDs
}) => {
    try {
        logger.info("Creating message");

        // Validate required fields
        if (!messageData.projectId) {
            throw new Error("Invalid message data: missing projectId");
        }

        if (!messageData.title) {
            throw new Error("Invalid message data: missing title");
        }

        if (!messageData.body) {
            throw new Error("Invalid message data: missing body");
        }

        logger.info(
            `Creating message "${messageData.title}" in project ${messageData.projectId}`
        );

        const api = getApiClientForVersion("v1");
        const endpoint = `/projects/${messageData.projectId}/posts.json`;

        // Prepare the payload
        const payload: any = {
            post: {
                title: messageData.title,
                body: messageData.body,
            },
        };

        if (messageData.categoryId !== undefined) {
            payload.post["category-id"] = messageData.categoryId;
        } else if (messageData.categoryName) {
            // Try to create category by name - some APIs support this
            payload.post["category-name"] = messageData.categoryName;
        }

        if (messageData.tagIds && messageData.tagIds.length > 0) {
            payload.post["tagIds"] = messageData.tagIds.join(",");
        }

        if (messageData.isPrivate !== undefined) {
            payload.post.private = messageData.isPrivate ? "1" : "0";
        }

        if (messageData.notify) {
            payload.post.notify = messageData.notify;
        }

        logger.debug(
            `Making POST request to ${endpoint} with payload: ${JSON.stringify(
                payload
            )}`
        );

        const response = await api.post(endpoint, payload);

        logger.info(`Message creation successful, status: ${response.status}`);

        return response.data;
    } catch (error: any) {
        if (error.response) {
            logger.error(
                `Error creating message: Status ${
                    error.response.status
                } - ${JSON.stringify(error.response.data)}`
            );
            logger.error(`Request URL: ${error.config?.url}`);
            logger.error(`Request method: ${error.config?.method}`);
            logger.error(`Request data: ${JSON.stringify(error.config?.data)}`);
        } else if (error.request) {
            logger.error(
                `Error creating message: No response received - ${error.request}`
            );
        } else {
            logger.error(`Error creating message: ${error.message}`);
        }
        throw new Error(`Failed to create message: ${error.message}`);
    }
};

export default createMessage;
