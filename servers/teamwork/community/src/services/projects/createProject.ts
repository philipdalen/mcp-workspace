import logger from '../../utils/logger.js';
import { getApiClientForVersion } from '../core/apiClient.js';

/**
 * Project creation data interface
 */
export interface CreateProjectData {
  name: string;
  description?: string;
  companyId?: number;
  categoryId?: number;
  startDate?: string; // Format: YYYYMMDD
  endDate?: string;   // Format: YYYYMMDD
  status?: string;
  [key: string]: any; // Allow additional properties
}

/**
 * Creates a new project in Teamwork
 * @param projectData The project data to create
 * @returns The API response with the created project data
 */
export const createProject = async (projectData: CreateProjectData) => {
  try {
    logger.info('Creating new project in Teamwork');
    
    if (!projectData.name) {
      throw new Error('Project name is required');
    }
    
    // The v1 API endpoint for creating projects is /projects.json
    const api = getApiClientForVersion('v1');
    
    // The API expects the project data to be wrapped in a 'project' object
    const requestData = {
      project: projectData
    };
    
    logger.info(`Creating project with name: ${projectData.name}`);
    
    const response = await api.post('/projects.json', requestData);
    
    logger.info(`Successfully created project: ${projectData.name}`);
    logger.info(`Project ID: ${response.data?.id || 'Unknown'}`);
    
    return response.data;
  } catch (error: any) {
    logger.error(`Failed to create project: ${error.message}`);
    throw new Error(`Failed to create project: ${error.message}`);
  }
};

export default createProject; 