import logger from '../../utils/logger.js';
import { ensureApiClient } from '../core/apiClient.js';
import { TaskRequest } from '../../models/TaskRequest.js';

/**
 * Creates a new task in a specific tasklist in Teamwork
 * @param tasklistId The ID of the tasklist to add the task to
 * @param taskData The task data
 * @returns The API response with the created task data
 */
export const createTask = async (tasklistId: string, taskData: TaskRequest) => {
  try {
    logger.info(`Creating task in tasklist ${tasklistId}`);
    
    // Ensure we have a valid task object
    if (!taskData || !taskData.task) {
      throw new Error('Invalid task data: missing task object');
    }
    
    // Ensure task has name field (Teamwork API requires 'name' for the task title)
    // Note: In the API docs it might be called 'content', but in our model it's 'name'
    if (!taskData.task.name) {
      throw new Error('Invalid task data: missing task name');
    }
    
    logger.info(`Task data: ${JSON.stringify(taskData).substring(0, 200)}...`);
    
    const api = ensureApiClient();
    const response = await api.post(`/tasklists/${tasklistId}/tasks.json`, taskData);
    
    logger.info(`Task creation successful, status: ${response.status}`);
    
    // Validate response data
    if (!response.data) {
      logger.warn('Task created but response data is empty');
      return { success: true, message: 'Task created successfully, but no details returned' };
    }
    
    // Ensure response data is serializable
    try {
      JSON.stringify(response.data);
      logger.info('Response data is valid JSON');
    } catch (error: any) {
      logger.error(`Response data is not valid JSON: ${error.message}`);
      return { 
        success: true, 
        message: 'Task created successfully, but response contains non-serializable data',
        partial: typeof response.data === 'object' ? Object.keys(response.data) : typeof response.data
      };
    }
    
    return response.data;
  } catch (error: any) {
    logger.error(`Error creating task in tasklist ${tasklistId}: ${error.message}`);
    
    // Log detailed error information
    if (error.response) {
      logger.error(`API error status: ${error.response.status}`);
      logger.error(`API error data: ${JSON.stringify(error.response.data || {})}`);
    }
    
    if (error.stack) {
      logger.error(`Stack trace: ${error.stack}`);
    }
    
    throw new Error(`Failed to create task in tasklist ${tasklistId}: ${error.message}`);
  }
};

export default createTask; 