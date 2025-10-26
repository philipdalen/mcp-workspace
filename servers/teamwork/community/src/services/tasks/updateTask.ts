/**
 * updateTask service
 * Updates an existing task in Teamwork
 * 
 * PATCH /tasks/{taskId}.json
 * The request body should be a TaskRequest object with a task property
 */

import logger from '../../utils/logger.js';
import { ensureApiClient } from '../core/apiClient.js';
import { TaskRequest } from '../../models/TaskRequest.js';

/**
 * Updates an existing task in Teamwork
 * @param taskId The ID of the task to update
 * @param taskData The updated task data
 * @returns The updated task
 */
export async function updateTask(taskId: string, taskData: TaskRequest) {
  try {
    const apiClient = await ensureApiClient();
    const url = `/tasks/${taskId}.json`;
    
    // Make the PATCH request to update the task
    const response = await apiClient.patch(url, taskData);
    if (response.status === 200) {
      if (response.data.task.name) {
        return `Task '${response.data.task.name}' updated successfully`;
      } else {
        return `Task updated successfully`;        
      }
    } else {
      throw new Error(response.data.message.status);
    }
  } catch (error: any) {
    logger.error(`Error updating task ${taskId}: ${error.message}`);
        
    throw new Error(error.message);
  }
}

export default updateTask; 