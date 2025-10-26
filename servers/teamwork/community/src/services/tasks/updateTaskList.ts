import logger from '../../utils/logger.js';
import { ensureApiClient } from '../core/apiClient.js';

/**
 * Interface for task list update parameters
 */
export interface UpdateTaskListData {
  name?: string;
  description?: string;
  milestoneId?: number;
}

/**
 * Updates an existing task list in Teamwork
 * @param taskListId The ID of the task list to update
 * @param taskListData The task list data to update
 * @returns The API response
 */
export const updateTaskList = async (taskListId: number, taskListData: UpdateTaskListData) => {
  try {
    logger.info(`Updating task list ${taskListId}`);
    
    // Ensure we have at least one field to update
    if (!taskListData || (!taskListData.name && !taskListData.description && !taskListData.milestoneId)) {
      throw new Error('Invalid task list data: at least one field (name, description, or milestoneId) must be provided');
    }
    
    // Prepare the payload according to Teamwork API format
    const payload: any = {
      'todo-list': {}
    };
    
    if (taskListData.name !== undefined) {
      payload['todo-list'].name = taskListData.name;
    }
    
    if (taskListData.description !== undefined) {
      payload['todo-list'].description = taskListData.description;
    }
    
    if (taskListData.milestoneId !== undefined) {
      payload['todo-list']['milestone-id'] = taskListData.milestoneId;
    }
    
    logger.info(`Task list update data: ${JSON.stringify(payload)}`);
    
    const api = ensureApiClient();
    const response = await api.put(`/tasklists/${taskListId}.json`, payload);
    
    logger.info(`Task list update successful, status: ${response.status}`);
    
    return response.data;
  } catch (error: any) {
    logger.error(`Error updating task list ${taskListId}: ${error.message}`);
    
    // Log detailed error information
    if (error.response) {
      logger.error(`API error status: ${error.response.status}`);
      logger.error(`API error data: ${JSON.stringify(error.response.data || {})}`);
    }
    
    if (error.stack) {
      logger.error(`Stack trace: ${error.stack}`);
    }
    
    throw new Error(`Failed to update task list ${taskListId}: ${error.message}`);
  }
};

export default updateTaskList;


