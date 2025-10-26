import logger from '../../utils/logger.js';
import { ensureApiClient } from '../core/apiClient.js';

/**
 * Fetches comments for a specific task from the Teamwork API
 * @param taskId The ID of the task to retrieve comments for
 * @param options Optional query parameters for filtering and pagination
 * @returns The API response with task comments data
 */
export const getTaskComments = async (taskId: string, options: any = {}) => {
  try {
    const api = ensureApiClient();
    const response = await api.get(`/tasks/${taskId}/comments.json`, { params: options });
    return response.data;
  } catch (error: any) {
    logger.error(`Error fetching comments for task ${taskId}: ${error.message}`);
    throw new Error(`Failed to fetch comments for task ${taskId}`);
  }
};

export default getTaskComments; 