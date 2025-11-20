import logger from "../../utils/logger.js";
import { getApiClientForVersion } from "../core/apiClient.js";

/**
 * Updates an existing message (post) in Teamwork
 * Uses v1 API endpoint: PUT /posts/{id}.json
 * @param messageId The ID of the message to update
 * @param messageData The message data to update
 * @returns The API response with the updated message
 */
export const updateMessage = async (
    messageId: number,
    messageData: {
        title?: string;
        body?: string;
        categoryId?: number;
        tagIds?: number[];
        isPrivate?: boolean;
        notify?: string; // 'all' to notify all project users, 'true' to notify followers, or comma-separated user IDs
    }
) => {
    try {
        logger.info(`Updating message ${messageId}`);

        if (!messageId) {
            throw new Error("Message ID is required");
        }

        const api = getApiClientForVersion("v1");
        const endpoint = `/posts/${messageId}.json`;

        // Prepare the payload
        const payload: any = {
            post: {},
        };

        if (messageData.title !== undefined) {
            payload.post.title = messageData.title;
        }

        if (messageData.body !== undefined) {
            payload.post.body = messageData.body;
        }

        if (messageData.categoryId !== undefined) {
            payload.post["category-id"] = messageData.categoryId;
        }

        if (messageData.tagIds !== undefined) {
            if (messageData.tagIds.length > 0) {
                payload.post["tagIds"] = messageData.tagIds.join(",");
            } else {
                payload.post["tagIds"] = "";
            }
        }

        if (messageData.isPrivate !== undefined) {
            payload.post.private = messageData.isPrivate ? "1" : "0";
        }

        if (messageData.notify !== undefined) {
            payload.post.notify = messageData.notify;
        }

        logger.debug(
            `Making PUT request to ${endpoint} with payload: ${JSON.stringify(
                payload
            )}`
        );

        const response = await api.put(endpoint, payload);

        logger.info(`Message update successful, status: ${response.status}`);

        return response.data;
    } catch (error: any) {
        if (error.response) {
            logger.error(
                `Error updating message: Status ${
                    error.response.status
                } - ${JSON.stringify(error.response.data)}`
            );
            logger.error(`Request URL: ${error.config?.url}`);
            logger.error(`Request method: ${error.config?.method}`);
            logger.error(`Request data: ${JSON.stringify(error.config?.data)}`);
        } else if (error.request) {
            logger.error(
                `Error updating message: No response received - ${error.request}`
            );
        } else {
            logger.error(`Error updating message: ${error.message}`);
        }
        throw new Error(`Failed to update message: ${error.message}`);
    }
};

export default updateMessage;
