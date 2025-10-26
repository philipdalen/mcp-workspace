import { getApiClientForVersion } from '../core/apiClient.js';

interface GetAllocationTimeParams {
  allocationId: number;
  updatedAfter?: string;
  startDate?: string;
  reportFormat?: string;
  projectStatus?: 'active' | 'current' | 'late' | 'upcoming' | 'completed' | 'deleted';
  orderMode?: 'asc' | 'desc';
  orderBy?: 'company' | 'date' | 'dateupdated' | 'project' | 'task' | 'tasklist' | 'user' | 'description' | 'billed' | 'billable' | 'timespent';
  invoicedType?: 'all' | 'invoiced' | 'noninvoiced';
  endDate?: string;
  billableType?: 'all' | 'billable' | 'non-billable';
  page?: number;
  pageSize?: number;
  includeTotals?: boolean;
  includePermissions?: boolean;
}

export async function getAllocationTime(params: GetAllocationTimeParams) {
  const { allocationId, ...queryParams } = params;
  const api = getApiClientForVersion('v3');
  const response = await api.get(`/allocations/${allocationId}/time.json`, { params: queryParams });
  return response.data;
}

export default getAllocationTime; 