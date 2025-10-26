import { getApiClientForVersion } from '../core/apiClient.js';

interface GetPeopleUtilizationParams {
  zoom?: 'week' | 'month' | 'last3months' | 'quarterbyweek' | 'quarterbymonth';
  startDate?: string;
  sortOrder?: 'asc' | 'desc';
  sort?: 'name' | 'percentutilization' | 'percentestimatedutilization' | 'availableminutes' | 'unavailableminutes' | 'loggedminutes' | 'billableminutes' | 'unbillableminutes' | 'billableutilization' | 'nonbillableutilization';
  searchTerm?: string;
  reportFormat?: 'pdf';
  orderMode?: 'weekly' | 'monthly';
  orderBy?: 'name' | 'percentutilization' | 'percentestimatedutilization' | 'availableminutes' | 'unavailableminutes' | 'loggedminutes' | 'billableminutes' | 'unbillableminutes' | 'companycount' | 'achieved' | 'target' | 'allocatedutilization' | 'totalworkingminutes' | 'availableutilization' | 'unavailableutilization';
  groupBy?: 'day' | 'week' | 'month';
  endDate?: string;
  pageSize?: number;
  page?: number;
  skipCounts?: boolean;
  legacyResponse?: boolean;
  isReportDownload?: boolean;
  isCustomDateRange?: boolean;
  includeUtilizations?: boolean;
  includeTotals?: boolean;
  includeCollaborators?: boolean;
  includeClients?: boolean;
  includeArchivedProjects?: boolean;
  IncludeCompletedTasks?: boolean;
  userIds?: number[];
  teamIds?: number[];
  selectedColumns?: string[];
  projectIds?: number[];
  jobRoleIds?: number[];
  include?: string[];
  'fields[utilizations]'?: string[];
  'fields[users]'?: string[];
  companyIds?: number[];
}

export async function getPeopleUtilization(params: GetPeopleUtilizationParams = {}) {
  const api = getApiClientForVersion('v3');
  const response = await api.get('/people/utilization.json', { params });
  return response.data;
}

export default getPeopleUtilization; 