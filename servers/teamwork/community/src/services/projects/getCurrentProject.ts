import logger from '../../utils/logger.js';
import { ensureApiClient } from '../core/apiClient.js';

/**
 * Gets the current Teamwork project
 * @param projectId The Teamwork project ID that you should first find stored in the .teamwork file in the solution root
 * @returns An object with success status and project details or error message
 */
export const getCurrentProject = async (projectId: string) => {
  try {
    if (!projectId) {
      return { 
        success: false, 
        error: `Current Teamwork project ID was not provided` 
      };
    }
    
    const api = ensureApiClient();
    const response = await api.get(`/projects/${projectId}.json`);
    return response.data;
  } catch (error: any) {
    logger.error(`Error getting current project: ${error.message}`);
    throw new Error(`Failed to get current project`);  
  };
};

export default getCurrentProject; 