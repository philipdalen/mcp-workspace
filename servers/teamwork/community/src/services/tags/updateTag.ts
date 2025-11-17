import logger from '../../utils/logger.js';
import { ensureApiClient } from '../core/apiClient.js';

/**
 * Updates an existing tag in Teamwork
 * @param tagId The ID of the tag to update
 * @param tagData The tag data to update
 * @returns The API response containing the updated tag
 */
export const updateTag = async (tagId: number, tagData: any) => {
    try {
        logger.info(`Updating tag with ID: ${tagId}`);

        const api = ensureApiClient();
        const endpoint = `tags/${tagId}.json`;
        const response = await api.patch(endpoint, tagData);

        logger.info(`Successfully updated tag ${tagId}. Response status: ${response.status}`);
        return response.data;
    } catch (error: any) {
        logger.error(`Error updating tag: ${error.message}`);
        if (error.response) {
            logger.error(
                `Error updating tag: Status ${
                    error.response.status
                } - ${JSON.stringify(error.response.data)}`
            );
        }
        throw new Error(`Failed to update tag: ${error.message}`);
    }
};

export default updateTag;

