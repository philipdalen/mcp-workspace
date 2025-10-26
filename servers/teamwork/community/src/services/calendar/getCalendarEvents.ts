import logger from '../../utils/logger.js';
import { getApiClientForVersion } from '../core/apiClient.js';

/**
 * Gets calendar events from Teamwork
 * @param params Query parameters for filtering calendar events
 * @returns The API response with calendar events
 */
export const getCalendarEvents = async (params?: {
  startDate?: string;
  endDate?: string;
  showDeleted?: boolean;
  updatedAfterDate?: string;
  eventTypeId?: number;
  page?: number;
  userId?: number;
  attendingOnly?: boolean;
}) => {
  try {
    logger.info('Getting calendar events');
    
    // Calendar events use the v1 API
    const api = getApiClientForVersion('v1');
    
    // Build query parameters
    const queryParams: any = {};
    if (params?.startDate) queryParams.startdate = params.startDate;
    if (params?.endDate) queryParams.endDate = params.endDate;
    if (params?.showDeleted !== undefined) queryParams.showDeleted = params.showDeleted;
    if (params?.updatedAfterDate) queryParams.updatedAfterDate = params.updatedAfterDate;
    if (params?.eventTypeId) queryParams.eventTypeId = params.eventTypeId;
    if (params?.page) queryParams.page = params.page;
    if (params?.userId) queryParams.userId = params.userId;
    if (params?.attendingOnly !== undefined) queryParams.attendingOnly = params.attendingOnly;
    
    logger.info(`Query params: ${JSON.stringify(queryParams)}`);
    
    const response = await api.get('calendarevents.json', { params: queryParams });
    
    logger.info(`Calendar events retrieved successfully, status: ${response.status}`);
    
    // Validate response data
    if (!response.data) {
      logger.warn('Calendar events retrieved but response data is empty');
      return { success: true, message: 'No calendar events found', events: [] };
    }
    
    return response.data;
  } catch (error: any) {
    logger.error(`Error getting calendar events: ${error.message}`);
    
    // Log detailed error information
    if (error.response) {
      logger.error(`API error status: ${error.response.status}`);
      logger.error(`API error data: ${JSON.stringify(error.response.data || {})}`);
    }
    
    if (error.stack) {
      logger.error(`Stack trace: ${error.stack}`);
    }
    
    throw new Error(`Failed to get calendar events: ${error.message}`);
  }
};

export default getCalendarEvents;


