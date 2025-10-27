/**
 * getPeople tool
 * Retrieves people from Teamwork
 */

import logger from "../../utils/logger.js";
import teamworkService from "../../services/index.js";

// Tool definition
export const getPeopleDefinition = {
  name: "getPeople",
  description: "Get all people from Teamwork",
  inputSchema: {
    type: "object",
    properties: {
      userType: {
        type: "string",
        enum: ["account", "collaborator", "contact"],
        description: "Filter by user type"
      },
      updatedAfter: {
        type: "string",
        description: "Filter by users updated after this date-time (format: ISO 8601)"
      },
      searchTerm: {
        type: "string",
        description: "Filter by name or email"
      },
      orderMode: {
        type: "string",
        enum: ["asc", "desc"],
        description: "Order mode"
      },
      orderBy: {
        type: "string",
        enum: ["name", "namecaseinsensitive", "company"],
        description: "Order by field"
      },
      lastLoginAfter: {
        type: "string",
        description: "Filter by users who logged in after this date-time"
      },
      pageSize: {
        type: "integer",
        description: "Number of items per page"
      },
      page: {
        type: "integer",
        description: "Page number"
      },
      includeCollaborators: {
        type: "boolean",
        description: "Include collaborator users"
      },
      includeClients: {
        type: "boolean",
        description: "Include client users"
      },
      teamIds: {
        type: "array",
        items: {
          type: "integer"
        },
        description: "Filter by team IDs"
      },
      projectIds: {
        type: "array",
        items: {
          type: "integer"
        },
        description: "Filter by project IDs"
      },
      companyIds: {
        type: "array",
        items: {
          type: "integer"
        },
        description: "Filter by company IDs"
      }
    }
  },
  annotations: {
    title: "Get People",
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: false
  }
};

// Tool handler
export async function handleGetPeople(input: any) {
  logger.info('=== getPeople tool called ===');
  logger.info(`Query parameters: ${JSON.stringify(input || {})}`);
  
  try {
    // Convert array parameters to comma-separated strings as required by Teamwork API
    const apiInput = { ...input };
    const arrayParameters = ['teamIds', 'projectIds', 'companyIds'];
    
    for (const param of arrayParameters) {
      if (Array.isArray(apiInput[param])) {
        apiInput[param] = apiInput[param].join(',');
      }
    }
    
    logger.info('Calling teamworkService.getPeople()');
    const people = await teamworkService.getPeople(apiInput);
    
    // Debug the response
    logger.info(`People response type: ${typeof people}`);
    
    if (people === null || people === undefined) {
      logger.warn('People response is null or undefined');
      return {
        content: [{
          type: "text",
          text: "No people found or API returned empty response."
        }]
      };
    }
    
    try {
      const jsonString = JSON.stringify(people, null, 2);
      logger.info(`Successfully stringified people response`);
      logger.info('=== getPeople tool completed successfully ===');
      return {
        content: [{
          type: "text",
          text: jsonString
        }]
      };
    } catch (jsonError: any) {
      logger.error(`JSON stringify error: ${jsonError.message}`);
      return {
        content: [{
          type: "text",
          text: `Error formatting response: ${jsonError.message}`
        }]
      };
    }
  } catch (error: any) {
    logger.error(`Error in getPeople tool: ${error.message}`);
    return {
      content: [{
        type: "text",
        text: `Error: ${error.message}`
      }]
    };
  }
} 