import logger from '../../utils/logger.js';
import { getApiClientForVersion } from '../core/apiClient.js';

/**
 * Deletes a calendar event from Teamwork
 * @param eventId The ID of the calendar event to delete
 * @returns The API response
 */
export const deleteCalendarEvent = async (eventId: string | number) => {
  try {
    logger.info(`Deleting calendar event ${eventId}`);
    
    // Calendar events use the v1 API
    const api = getApiClientForVersion('v1');
    const response = await api.delete(`calendarevents/${eventId}.json`);
    
    logger.info(`Calendar event deletion successful, status: ${response.status}`);
    
    return response.data || { success: true, message: 'Calendar event deleted successfully' };
  } catch (error: any) {
    logger.error(`Error deleting calendar event ${eventId}: ${error.message}`);
    
    // Log detailed error information
    if (error.response) {
      logger.error(`API error status: ${error.response.status}`);
      logger.error(`API error data: ${JSON.stringify(error.response.data || {})}`);
    }
    
    if (error.stack) {
      logger.error(`Stack trace: ${error.stack}`);
    }
    
    throw new Error(`Failed to delete calendar event ${eventId}: ${error.message}`);
  }
};

export default deleteCalendarEvent;


