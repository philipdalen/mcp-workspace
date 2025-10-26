import logger from '../../utils/logger.js';
import { ensureApiClient } from '../core/apiClient.js';

/**
 * Fetches a specific task by ID from the Teamwork API
 * @param taskId The ID of the task to retrieve
 * @returns The API response with task data
 */
export const getTaskById = async (taskId: string) => {
  try {
    const api = ensureApiClient();
    const response = await api.get(`/tasks/${taskId}.json`);
    return response.data;
  } catch (error: any) {
    logger.error(`Error fetching task ${taskId}: ${error.message}`);
    throw new Error(`Failed to fetch task ${taskId}`);
  }
};

export default getTaskById; 