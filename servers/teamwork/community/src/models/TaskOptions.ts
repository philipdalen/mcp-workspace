/**
 * Options contains any options which can be set for the task request
 */
export interface TaskOptions {
  appendAssignees?: boolean;
  checkInvalidusers?: boolean;
  everyoneMustDo?: boolean;
  fireWebhook?: boolean;
  isTemplate?: boolean;
  logActivity?: boolean;
  notify?: boolean;
  parseInlineTags?: boolean;
  positionAfterTaskId?: number;
  pushDependents?: boolean;
  pushSubtasks?: boolean;
  shiftProjectDates?: boolean;
  useDefaults?: boolean;
  useNotifyViaTWIM?: boolean;
} 