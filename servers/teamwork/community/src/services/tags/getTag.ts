import logger from '../../utils/logger.js';
import { ensureApiClient } from '../core/apiClient.js';

/**
 * Gets a specific tag by ID from Teamwork
 * @param tagId The ID of the tag to retrieve
 * @returns The API response containing the tag
 */
export const getTag = async (tagId: number) => {
    try {
        logger.info(`Getting tag with ID: ${tagId}`);

        const api = ensureApiClient();
        const endpoint = `tags/${tagId}.json`;

        const response = await api.get(endpoint);

        logger.info(`Successfully retrieved tag ${tagId}`);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            logger.error(
                `Error getting tag: Status ${
                    error.response.status
                } - ${JSON.stringify(error.response.data)}`
            );
        } else if (error.request) {
            logger.error(
                `Error getting tag: No response received - ${error.request}`
            );
        } else {
            logger.error(`Error getting tag: ${error.message}`);
        }
        throw new Error(`Failed to get tag: ${error.message}`);
    }
};

export default getTag;

