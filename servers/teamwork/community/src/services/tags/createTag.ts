import logger from '../../utils/logger.js';
import { ensureApiClient } from '../core/apiClient.js';

/**
 * Creates a new tag in Teamwork
 * @param tagData The tag data to create
 * @returns The API response containing the created tag
 */
export const createTag = async (tagData: any) => {
    try {
        // Format the payload correctly for Teamwork API
        // API expects: { tag: { name: "...", project_id?: number } }
        const payload: any = {};
        
        if (tagData.tag) {
            payload.tag = {
                name: tagData.tag.name
            };
            if (tagData.tag.color) {
                payload.tag.color = tagData.tag.color;
            }
            if (tagData.tag.projectId !== undefined) {
                payload.tag.project_id = tagData.tag.projectId;
            }
        } else if (tagData.name) {
            // Support direct name format too
            payload.tag = {
                name: tagData.name
            };
            if (tagData.color) {
                payload.tag.color = tagData.color;
            }
            if (tagData.projectId !== undefined) {
                payload.tag.project_id = tagData.projectId;
            }
        } else {
            throw new Error('Tag name is required');
        }

        logger.info(`Creating new tag with name: ${payload.tag.name}`);

        const api = ensureApiClient();
        const response = await api.post('tags.json', payload);

        logger.info(`Successfully created tag. Response status: ${response.status}`);
        return response.data;
    } catch (error: any) {
        logger.error(`Error creating tag: ${error.message}`);
        if (error.response) {
            logger.error(
                `Error creating tag: Status ${
                    error.response.status
                } - ${JSON.stringify(error.response.data)}`
            );
        }
        throw new Error(`Failed to create tag: ${error.message}`);
    }
};

export default createTag;

