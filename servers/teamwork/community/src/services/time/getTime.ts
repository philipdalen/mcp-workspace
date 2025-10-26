import logger from '../../utils/logger.js';
import { getApiClientForVersion } from '../core/apiClient.js';

export interface GetTimeParams {
  updatedAfter?: string;
  startDate?: string;
  reportFormat?: string;
  projectStatus?: 'active' | 'current' | 'late' | 'upcoming' | 'completed' | 'deleted';
  orderMode?: 'asc' | 'desc';
  orderBy?: 'company' | 'date' | 'dateupdated' | 'project' | 'task' | 'tasklist' | 'user' | 'description' | 'billed' | 'billable' | 'timespent';
  invoicedType?: 'all' | 'invoiced' | 'noninvoiced';
  endDate?: string;
  billableType?: 'all' | 'billable' | 'non-billable';
  updatedBy?: number;
  ticketId?: number;
  tasklistId?: number;
  taskId?: number;
  projectId?: number;
  pageSize?: number;
  page?: number;
  invoiceId?: number;
  budgetId?: number;
  allocationId?: number;
  useFallbackMethod?: boolean;
  unattachedTimelogs?: boolean;
  skipCounts?: boolean;
  showDeleted?: boolean;
  returnCostInfo?: boolean;
  returnBillableInfo?: boolean;
  onlyStarredProjects?: boolean;
  matchAllTaskTags?: boolean;
  matchAllTags?: boolean;
  matchAllProjectTags?: boolean;
  isReportDownload?: boolean;
  includeTotals?: boolean;
  includePermissions?: boolean;
  includeDescendants?: boolean;
  includeArchivedProjects?: boolean;
  taskTagIds?: number[];
  taskStatuses?: string[];
  taskIds?: number[];
  tagIds?: number[];
  selectedColumns?: string[];
  projectsFromCompanyId?: number[];
  projectTagIds?: number[];
  projectStatuses?: string[];
  projectOwnerIds?: number[];
  projectIds?: number[];
  projectHealths?: number[];
  projectCompanyIds?: number[];
  projectCategoryIds?: number[];
  include?: string[];
  ids?: number[];
  'fields[users]'?: string[];
  'fields[timelogs]'?: string[];
  'fields[tasks]'?: string[];
  'fields[tasklists]'?: string[];
  'fields[tags]'?: string[];
  'fields[projects]'?: string[];
  'fields[projectcategories]'?: string[];
  'fields[companies]'?: string[];
  assignedToUserIds?: number[];
  assignedToTeamIds?: number[];
  assignedToCompanyIds?: number[];
  assignedTeamIds?: number[];
}

/**
 * Get all time entries
 * Return all logged time entries for all projects. Only the time entries that
 * the logged-in user can access will be returned.
 */
export const getTime = async (params: GetTimeParams = {}) => {
  try {
    logger.info('Fetching time entries from Teamwork');
    
    const api = getApiClientForVersion('v3');
    
    logger.info('Making API request to get time entries');
    const response = await api.get('/time.json', { params });
    
    logger.info('Successfully retrieved time entries');
    return response.data;
  } catch (error: any) {
    logger.error(`Failed to get time entries: ${error.message}`);
    throw new Error(`Failed to get time entries: ${error.message}`);
  }
};

export default getTime; 