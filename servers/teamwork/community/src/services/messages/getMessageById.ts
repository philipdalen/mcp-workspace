import logger from "../../utils/logger.js";
import { getApiClientForVersion } from "../core/apiClient.js";

/**
 * Gets a specific message (post) by ID from Teamwork
 * Uses v1 API endpoint: GET /posts/{id}.json
 * @param messageId The ID of the message to retrieve
 * @returns The API response with the message data
 */
export const getMessageById = async (messageId: number) => {
    try {
        logger.info(`Getting message ${messageId}`);

        if (!messageId) {
            throw new Error("Message ID is required");
        }

        const api = getApiClientForVersion("v1");
        const endpoint = `/posts/${messageId}.json`;

        logger.debug(`Making GET request to ${endpoint}`);

        const response = await api.get(endpoint);

        logger.info(`Message ${messageId} retrieved successfully`);

        return response.data;
    } catch (error: any) {
        if (error.response) {
            logger.error(
                `Error getting message: Status ${
                    error.response.status
                } - ${JSON.stringify(error.response.data)}`
            );
        } else if (error.request) {
            logger.error(
                `Error getting message: No response received - ${error.request}`
            );
        } else {
            logger.error(`Error getting message: ${error.message}`);
        }
        throw new Error(`Failed to get message: ${error.message}`);
    }
};

export default getMessageById;
