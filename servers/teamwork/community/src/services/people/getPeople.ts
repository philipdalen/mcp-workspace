import logger from '../../utils/logger.js';
import { ensureApiClient } from '../core/apiClient.js';

/**
 * Interface for people query parameters
 */
export interface PeopleQueryParams {
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

/**
 * Fetches people from the Teamwork API
 * @param params Optional query parameters for filtering people
 * @returns The API response with people data
 */
export const getPeople = async (params?: PeopleQueryParams) => {
  try {
    logger.info('Fetching people from Teamwork API');
    
    const api = ensureApiClient();
    const response = await api.get('/people.json', { params });
    logger.info('Successfully fetched people');
    return response.data;
  } catch (error: any) {
    logger.error(`Teamwork API error: ${error.message}`);
    throw new Error('Failed to fetch people from Teamwork API');
  }
};

export default getPeople; 