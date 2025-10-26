/**
 * Workflows stores information about where the task lives in the workflow
 */
export interface TaskWorkflows {
  positionAfterTask?: number;
  stageId?: number;
  workflowId?: number;
} 