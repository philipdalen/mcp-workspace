/**
 * getTaskList tool
 * Retrieves a specific task list by ID from Teamwork
 */

import logger from "../../utils/logger.js";
import teamworkService from "../../services/index.js";

// Tool definition
export const getTaskListDefinition = {
  name: "getTaskList",
  description: "Get an existing task list in Teamwork.com by ID. In the context of Teamwork.com, a task list is a way to group related tasks within a project, helping teams organize their work into meaningful sections such as phases, categories, or deliverables. Each task list belongs to a specific project and can include multiple tasks that are typically aligned with a common goal. Task lists can be associated with milestones, and they support privacy settings that control who can view or interact with the tasks they contain. This structure helps teams manage progress, assign responsibilities, and maintain clarity across complex projects.",
  inputSchema: {
    type: "object",
    properties: {
      id: {
        type: "integer",
        description: "The ID of the task list to retrieve"
      }
    },
    required: ["id"]
  },
  annotations: {
    title: "Get Task List",
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: false
  }
};

// Tool handler
export async function handleGetTaskList(input: any) {
  logger.info('Calling teamworkService.getTaskList()');
  logger.info(`Task List ID: ${input?.id}`);
  
  try {
    const taskListId = input?.id;
    
    if (!taskListId) {
      throw new Error("Task list ID is required");
    }
    
    const taskList = await teamworkService.getTaskList(taskListId);
    logger.info(`Task list retrieval successful`);
    
    if (taskList) {
      return {
        content: [{
          type: "text",
          text: JSON.stringify(taskList, null, 2)
        }]
      };
    } else {
      return {
        content: [{
          type: "text",
          text: `Error getting task list with ID: ${taskListId}`
        }]
      };
    }
  } catch (error: any) {
    logger.error(`Error in getTaskList handler: ${error.message}`);
    return {
      content: [{
        type: "text",
        text: `Error retrieving task list: ${error.message}`
      }]
    };
  }
}


