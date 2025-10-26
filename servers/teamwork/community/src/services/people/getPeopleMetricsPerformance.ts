import { getApiClientForVersion } from '../core/apiClient.js';

interface GetPeopleMetricsPerformanceParams {
  startDate?: string;
  endDate?: string;
  orderMode?: 'asc' | 'desc';
}

export async function getPeopleMetricsPerformance(params: GetPeopleMetricsPerformanceParams = {}) {
  const api = getApiClientForVersion('v3');
  const response = await api.get('/people/metrics/performance.json', { params });
  return response.data;
}

export default getPeopleMetricsPerformance; 