import logger from '../../utils/logger.js';
import { ensureApiClient } from '../core/apiClient.js';

/**
 * Interface for task list creation parameters
 */
export interface CreateTaskListData {
  name: string;
  description?: string;
  milestoneId?: number;
}

/**
 * Creates a new task list in a specific project in Teamwork
 * @param projectId The ID of the project to create the task list in
 * @param taskListData The task list data
 * @returns The API response with the created task list data
 */
export const createTaskList = async (projectId: number, taskListData: CreateTaskListData) => {
  try {
    logger.info(`Creating task list in project ${projectId}`);
    
    // Ensure we have a valid task list name
    if (!taskListData || !taskListData.name) {
      throw new Error('Invalid task list data: missing name');
    }
    
    // Prepare the payload according to Teamwork API format
    const payload = {
      'todo-list': {
        name: taskListData.name,
        description: taskListData.description || '',
        ...(taskListData.milestoneId && { 'milestone-id': taskListData.milestoneId })
      }
    };
    
    logger.info(`Task list data: ${JSON.stringify(payload)}`);
    
    const api = ensureApiClient();
    const response = await api.post(`/projects/${projectId}/tasklists.json`, payload);
    
    logger.info(`Task list creation successful, status: ${response.status}`);
    
    // Validate response data
    if (!response.data) {
      logger.warn('Task list created but response data is empty');
      return { success: true, message: 'Task list created successfully, but no details returned' };
    }
    
    return response.data;
  } catch (error: any) {
    logger.error(`Error creating task list in project ${projectId}: ${error.message}`);
    
    // Log detailed error information
    if (error.response) {
      logger.error(`API error status: ${error.response.status}`);
      logger.error(`API error data: ${JSON.stringify(error.response.data || {})}`);
    }
    
    if (error.stack) {
      logger.error(`Stack trace: ${error.stack}`);
    }
    
    throw new Error(`Failed to create task list in project ${projectId}: ${error.message}`);
  }
};

export default createTaskList;


