import logger from '../../utils/logger.js';
import { getApiClientForVersion } from '../core/apiClient.js';

/**
 * Marks a task as complete in Teamwork
 * Uses PUT /tasks/{taskId}/complete.json (v1 API)
 * @param taskId The ID of the task to mark as complete
 * @returns The API response
 */
export const completeTask = async (taskId: string) => {
  try {
    logger.info(`Marking task ${taskId} as complete`);
    
    // Use v1 API for complete endpoint
    const api = getApiClientForVersion('v1');
    const response = await api.put(`/tasks/${taskId}/complete.json`);
    
    logger.info(`Task ${taskId} marked as complete successfully`);
    return response.data;
  } catch (error: any) {
    logger.error(`Error completing task ${taskId}: ${error.message}`);
    throw new Error(`Failed to complete task ${taskId}: ${error.message}`);
  }
};

/**
 * Marks a task as incomplete in Teamwork
 * Uses PUT /tasks/{taskId}/uncomplete.json (v1 API)
 * @param taskId The ID of the task to mark as incomplete
 * @returns The API response
 */
export const uncompleteTask = async (taskId: string) => {
  try {
    logger.info(`Marking task ${taskId} as incomplete`);
    
    // Use v1 API for uncomplete endpoint
    const api = getApiClientForVersion('v1');
    const response = await api.put(`/tasks/${taskId}/uncomplete.json`);
    
    logger.info(`Task ${taskId} marked as incomplete successfully`);
    return response.data;
  } catch (error: any) {
    logger.error(`Error uncompleting task ${taskId}: ${error.message}`);
    throw new Error(`Failed to uncomplete task ${taskId}: ${error.message}`);
  }
};

export default { completeTask, uncompleteTask };


