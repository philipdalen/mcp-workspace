import { ensureApiClient } from '../core/apiClient.js';

interface GetUtilizationParams {
  format: 'csv' | 'html' | 'pdf' | 'xlsx';
  zoom?: string;
  startDate?: string;
  sortOrder?: string;
  sort?: string;
  searchTerm?: string;
  reportFormat?: string;
  orderMode?: string;
  orderBy?: string;
  groupBy?: string;
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
  fieldsUtilizations?: string[];
  fieldsUsers?: string[];
  companyIds?: number[];
}

async function getUtilization(params: GetUtilizationParams) {
  const api = ensureApiClient();
  const endpoint = `/reporting/precanned/utilization.${params.format}`;
  const response = await api.get(endpoint, { params });
  return response.data;
}

export default getUtilization; 