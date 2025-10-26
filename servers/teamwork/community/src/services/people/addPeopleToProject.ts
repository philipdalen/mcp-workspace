import logger from '../../utils/logger.js';
import { ensureApiClient } from '../core/apiClient.js';

/**
 * Interface for the payload to add people to a project
 */
export interface AddPeopleToProjectPayload {
  userIds: number[];
  checkTeamIds?: number[];
}

/**
 * Adds people to a specific project in Teamwork
 * @param projectId The ID of the project
 * @param payload The payload containing user IDs to add to the project
 * @returns The API response
 */
export const addPeopleToProject = async (projectId: number, payload: AddPeopleToProjectPayload) => {
  try {
    logger.info(`Adding people to project ID ${projectId} in Teamwork API`);
    logger.info(`Payload: ${JSON.stringify(payload)}`);
    
    const api = ensureApiClient();
    const response = await api.put(`/projects/${projectId}/people.json`, payload);
    logger.info(`Successfully added people to project ID ${projectId}`);
    return response.data;
  } catch (error: any) {
    logger.error(`Teamwork API error: ${error.message}`);
    throw new Error(`Failed to add people to project ID ${projectId} in Teamwork API`);
  }
};

export default addPeopleToProject; 