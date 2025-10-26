import { getApiClientForVersion } from '../core/apiClient.js';
import logger from '../../utils/logger.js';

interface GetProjectPersonParams {
  projectId: number;
  personId: number;
  userType?: 'account' | 'collaborator' | 'contact';
  updatedAfter?: string;
  searchTerm?: string;
  orderMode?: 'asc' | 'desc';
  orderBy?: 'name' | 'namecaseinsensitive' | 'company';
  lastLoginAfter?: string;
  pageSize?: number;
  page?: number;
  skipCounts?: boolean;
  showDeleted?: boolean;
  searchUserJobRole?: boolean;
  orderPrioritiseCurrentUser?: boolean;
  onlySiteOwner?: boolean;
  onlyOwnerCompany?: boolean;
  inclusiveFilter?: boolean;
  includeServiceAccounts?: boolean;
  includePlaceholders?: boolean;
  includeCollaborators?: boolean;
  includeClients?: boolean;
  filterByNoCostRate?: boolean;
  excludeContacts?: boolean;
  teamIds?: number[];
  projectIds?: number[];
  include?: string[];
  ids?: number[];
  'fields[teams]'?: string[];
  'fields[person]'?: string[];
  'fields[people]'?: string[];
  'fields[companies]'?: string[];
  'fields[ProjectPermissions]'?: string[];
  excludeProjectIds?: number[];
  excludeIds?: number[];
  companyIds?: number[];
}

interface GetProjectPersonPathParams {
  projectId: number;
  personId: number;
}

type QueryParams = Record<string, any>;

export async function getProjectPerson(params: GetProjectPersonPathParams & QueryParams) {
  const api = getApiClientForVersion('v3');
  
  const { projectId, personId, ...queryParams } = params;

  logger.debug(`Making GET request to /projects/${projectId}/people/${personId}.json with params: ${JSON.stringify(queryParams)}`);

  try {
    const response = await api.get(`/projects/${projectId}/people/${personId}.json`, { params: queryParams });
    return response.data;
  } catch (error: any) {
    if (error.response) {
        logger.error(`Error fetching project person: Status ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
        logger.error(`Error fetching project person: No response received - ${error.request}`);
    } else {
        logger.error(`Error fetching project person: ${error.message}`);
    }
    throw new Error(`Failed to fetch project person from Teamwork API: ${error.message}`);
  }
}

export default getProjectPerson; 