import logger from '../../utils/logger.js';
import { ensureApiClient } from '../core/apiClient.js';

/**
 * Deletes a tag from Teamwork
 * @param tagId The ID of the tag to delete
 * @returns The API response
 */
export const deleteTag = async (tagId: number) => {
    try {
        logger.info(`Deleting tag with ID: ${tagId}`);

        const api = ensureApiClient();
        const endpoint = `tags/${tagId}.json`;
        const response = await api.delete(endpoint);

        logger.info(`Successfully deleted tag ${tagId}. Response status: ${response.status}`);
        return response.data;
    } catch (error: any) {
        logger.error(`Error deleting tag: ${error.message}`);
        if (error.response) {
            logger.error(
                `Error deleting tag: Status ${
                    error.response.status
                } - ${JSON.stringify(error.response.data)}`
            );
        }
        throw new Error(`Failed to delete tag: ${error.message}`);
    }
};

export default deleteTag;

