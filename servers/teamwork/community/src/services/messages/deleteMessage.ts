import logger from "../../utils/logger.js";
import { getApiClientForVersion } from "../core/apiClient.js";

/**
 * Deletes an existing message (post) in Teamwork
 * Uses v1 API endpoint: DELETE /posts/{id}.json
 * @param messageId The ID of the message to delete
 * @returns The API response
 */
export const deleteMessage = async (messageId: number) => {
    try {
        logger.info(`Deleting message ${messageId}`);

        if (!messageId) {
            throw new Error("Message ID is required");
        }

        const api = getApiClientForVersion("v1");
        const endpoint = `/posts/${messageId}.json`;

        logger.debug(`Making DELETE request to ${endpoint}`);

        const response = await api.delete(endpoint);

        logger.info(`Message deletion successful, status: ${response.status}`);

        return response.data || { success: true, message: "Message deleted successfully" };
    } catch (error: any) {
        if (error.response) {
            logger.error(
                `Error deleting message: Status ${
                    error.response.status
                } - ${JSON.stringify(error.response.data)}`
            );
            logger.error(`Request URL: ${error.config?.url}`);
            logger.error(`Request method: ${error.config?.method}`);
        } else if (error.request) {
            logger.error(
                `Error deleting message: No response received - ${error.request}`
            );
        } else {
            logger.error(`Error deleting message: ${error.message}`);
        }
        throw new Error(`Failed to delete message: ${error.message}`);
    }
};

export default deleteMessage;


