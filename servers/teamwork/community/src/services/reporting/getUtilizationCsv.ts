import { ensureApiClient } from '../core/apiClient.js';

interface GetUtilizationCsvParams {
  zoom?: string;
  startDate?: string;
  sortOrder?: 'asc' | 'desc';
  sort?: string;
  searchTerm?: string;
  reportFormat?: string;
  orderMode?: 'weekly' | 'monthly';
  orderBy?: string;
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
  fieldsUtilizations?: string[];
  fieldsUsers?: string[];
  companyIds?: number[];
}

async function getUtilizationCsv(params: GetUtilizationCsvParams) {
  const api = ensureApiClient();
  const response = await api.get('/reporting/precanned/utilization.csv', {
    params
  });
  return response.data;
}

export default getUtilizationCsv; 