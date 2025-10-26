/**
 * updateTaskList tool
 * Updates an existing task list in Teamwork
 */

import logger from "../../utils/logger.js";
import teamworkService from "../../services/index.js";

// Tool definition
export const updateTaskListDefinition = {
  name: "updateTaskList",
  description: "Update an existing task list in Teamwork.com. In the context of Teamwork.com, a task list is a way to group related tasks within a project, helping teams organize their work into meaningful sections such as phases, categories, or deliverables. Each task list belongs to a specific project and can include multiple tasks that are typically aligned with a common goal. Task lists can be associated with milestones, and they support privacy settings that control who can view or interact with the tasks they contain. This structure helps teams manage progress, assign responsibilities, and maintain clarity across complex projects.",
  inputSchema: {
    type: "object",
    properties: {
      id: {
        type: "integer",
        description: "The ID of the task list to update"
      },
      name: {
        type: "string",
        description: "The name of the task list"
      },
      description: {
        type: "string",
        description: "The description of the task list"
      },
      milestoneId: {
        type: "integer",
        description: "The ID of the milestone to associate with the task list"
      }
    },
    required: ["id"]
  },
  annotations: {
    title: "Update Task List",
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: false
  }
};

// Tool handler
export async function handleUpdateTaskList(input: any) {
  logger.info('Calling teamworkService.updateTaskList()');
  logger.info(`Task List ID: ${input?.id}`);
  
  try {
    const taskListId = input?.id;
    
    if (!taskListId) {
      throw new Error("Task list ID is required");
    }
    
    const taskListData: any = {};
    
    if (input?.name !== undefined) {
      taskListData.name = input.name;
    }
    
    if (input?.description !== undefined) {
      taskListData.description = input.description;
    }
    
    if (input?.milestoneId !== undefined) {
      taskListData.milestoneId = input.milestoneId;
    }
    
    const result = await teamworkService.updateTaskList(taskListId, taskListData);
    logger.info(`Task list update successful`);
    
    return {
      content: [{
        type: "text",
        text: `Task list updated successfully`
      }]
    };
  } catch (error: any) {
    logger.error(`Error in updateTaskList handler: ${error.message}`);
    return {
      content: [{
        type: "text",
        text: `Error updating task list: ${error.message}`
      }]
    };
  }
}


