import logger from '../../utils/logger.js';
import { ensureApiClient } from '../core/apiClient.js';
import { TaskRequest } from '../../models/TaskRequest.js';

/**
 * Creates a new subtask under a specific parent task in Teamwork
 * @param taskId The ID of the parent task
 * @param taskData The subtask data
 * @returns The API response with the created subtask data
 */
export const createSubTask = async (taskId: string, taskData: TaskRequest) => {
  try {
    logger.info(`Creating subtask for parent task ${taskId}`);
    
    // Ensure we have a valid task object
    if (!taskData || !taskData.task) {
      throw new Error('Invalid task data: missing task object');
    }
    
    // Ensure task has name field (Teamwork API requires 'name' for the task title)
    if (!taskData.task.name) {
      throw new Error('Invalid task data: missing task name');
    }
    
    logger.info(`Subtask data: ${JSON.stringify(taskData).substring(0, 200)}...`);
    
    const api = ensureApiClient();
    const response = await api.post(`/tasks/${taskId}/subtasks.json`, taskData);
    
    logger.info(`Subtask creation successful, status: ${response.status}`);
    
    // Validate response data
    if (!response.data) {
      logger.warn('Subtask created but response data is empty');
      return { success: true, message: 'Subtask created successfully, but no details returned' };
    }
    
    // Ensure response data is serializable
    try {
      JSON.stringify(response.data);
      logger.info('Response data is valid JSON');
    } catch (error: any) {
      logger.error(`Response data is not valid JSON: ${error.message}`);
      return { 
        success: true, 
        message: 'Subtask created successfully, but response contains non-serializable data',
        partial: typeof response.data === 'object' ? Object.keys(response.data) : typeof response.data
      };
    }
    
    return response.data;
  } catch (error: any) {
    logger.error(`Error creating subtask for parent task ${taskId}: ${error.message}`);
    
    // Log detailed error information
    if (error.response) {
      logger.error(`API error status: ${error.response.status}`);
      logger.error(`API error data: ${JSON.stringify(error.response.data || {})}`);
    }
    
    if (error.stack) {
      logger.error(`Stack trace: ${error.stack}`);
    }
    
    throw new Error(`Failed to create subtask for parent task ${taskId}: ${error.message}`);
  }
};

export default createSubTask; 