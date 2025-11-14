import logger from '../../utils/logger.js';
import { getApiClientForVersion } from '../core/apiClient.js';

/**
 * Deletes a task list from Teamwork
 * @param taskListId The ID of the task list to delete
 * @returns The API response
 */
export const deleteTaskList = async (taskListId: number) => {
  try {
    logger.info(`Deleting task list ${taskListId}`);
    
    // Use v1 API for deleting task lists (v3 doesn't support DELETE for task lists)
    const api = getApiClientForVersion('v1');
    const response = await api.delete(`tasklists/${taskListId}.json`);
    
    logger.info(`Task list deletion successful, status: ${response.status}`);
    
    return response.data;
  } catch (error: any) {
    logger.error(`Error deleting task list ${taskListId}: ${error.message}`);
    
    // Log detailed error information
    if (error.response) {
      logger.error(`API error status: ${error.response.status}`);
      logger.error(`API error data: ${JSON.stringify(error.response.data || {})}`);
    }
    
    if (error.stack) {
      logger.error(`Stack trace: ${error.stack}`);
    }
    
    throw new Error(`Failed to delete task list ${taskListId}: ${error.message}`);
  }
};

export default deleteTaskList;


