/**
 * deleteTaskList tool
 * Deletes a task list from Teamwork
 */

import logger from "../../utils/logger.js";
import teamworkService from "../../services/index.js";

// Tool definition
export const deleteTaskListDefinition = {
  name: "deleteTaskList",
  description: "Delete an existing task list in Teamwork.com. In the context of Teamwork.com, a task list is a way to group related tasks within a project, helping teams organize their work into meaningful sections such as phases, categories, or deliverables. Each task list belongs to a specific project and can include multiple tasks that are typically aligned with a common goal. Task lists can be associated with milestones, and they support privacy settings that control who can view or interact with the tasks they contain. This structure helps teams manage progress, assign responsibilities, and maintain clarity across complex projects.",
  inputSchema: {
    type: "object",
    properties: {
      id: {
        type: "integer",
        description: "The ID of the task list to delete"
      }
    },
    required: ["id"]
  },
  annotations: {
    title: "Delete Task List",
    readOnlyHint: false,
    destructiveHint: true,
    openWorldHint: false
  }
};

// Tool handler
export async function handleDeleteTaskList(input: any) {
  logger.info('Calling teamworkService.deleteTaskList()');
  logger.info(`Task List ID: ${input?.id}`);
  
  try {
    const taskListId = input?.id;
    
    if (!taskListId) {
      throw new Error("Task list ID is required");
    }
    
    await teamworkService.deleteTaskList(taskListId);
    logger.info(`Task list deletion successful`);
    
    return {
      content: [{
        type: "text",
        text: `Task list deleted successfully`
      }]
    };
  } catch (error: any) {
    logger.error(`Error in deleteTaskList handler: ${error.message}`);
    return {
      content: [{
        type: "text",
        text: `Error deleting task list: ${error.message}`
      }]
    };
  }
}


