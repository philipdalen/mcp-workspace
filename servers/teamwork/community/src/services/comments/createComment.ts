import logger from '../../utils/logger.js';
import { getApiClientForVersion } from '../core/apiClient.js';

/**
 * Creates a new comment for a specific resource in Teamwork
 * @param resource The resource type (tasks, milestones, notebooks, links, fileversions)
 * @param resourceId The ID of the resource to create a comment for
 * @param commentData The comment data to submit
 * @returns The API response with the created comment data
 */
export const createComment = async (resource: string, resourceId: string, commentData: any) => {
  try {
    // Validate resource type
    const validResources = ['tasks', 'milestones', 'notebooks', 'links', 'fileversions'];
    if (!validResources.includes(resource)) {
      throw new Error(`Invalid resource type. Must be one of: ${validResources.join(', ')}`);
    }
    
    // For API v1, we need the proper client
    const api = getApiClientForVersion('v1');
    
    // We're using the v1 API which has a different format for the request
    const payload = {
      comment: commentData
    };
    
    // The API v1 endpoint doesn't include the base path
    const response = await api.post(`/${resource}/${resourceId}/comments.json`, payload);
    
    return response.data;
  } catch (error: any) {
    logger.error(`Error creating comment for ${resource}/${resourceId}: ${error.message}`);
    throw new Error(`Failed to create comment for ${resource}/${resourceId}: ${error.message}`);
  }
};

export default createComment; 