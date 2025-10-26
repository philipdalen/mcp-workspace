import logger from '../../utils/logger.js';
import { ensureApiClient } from '../core/apiClient.js';

/**
 * Deletes a task from Teamwork
 * @param taskId The ID of the task to delete
 * @returns True if the task was successfully deleted
 */
export const deleteTask = async (taskId: string) => {
  try {
    const api = ensureApiClient();
    await api.delete(`/tasks/${taskId}.json`);
    return true;
  } catch (error: any) {
    logger.error(`Error deleting task ${taskId}: ${error.message}`);
    throw new Error(`Failed to delete task ${taskId}`);
  }
};

export default deleteTask; 