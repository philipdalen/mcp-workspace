import logger from '../../utils/logger.js';
import { ensureApiClient } from '../core/apiClient.js';

/**
 * Fetches a specific task list by ID from the Teamwork API
 * @param taskListId The ID of the task list to retrieve
 * @returns The API response with task list data
 */
export const getTaskList = async (taskListId: number) => {
  try {
    const api = ensureApiClient();
    const response = await api.get(`/tasklists/${taskListId}.json`);
    return response.data;
  } catch (error: any) {
    logger.error(`Error fetching task list ${taskListId}: ${error.message}`);
    throw new Error(`Failed to fetch task list ${taskListId}`);
  }
};

export default getTaskList;


