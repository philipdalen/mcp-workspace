import { TaskCard } from './TaskCard.js';
import { TaskPredecessor } from './TaskPredecessor.js';
import { TagTag } from './TagTag.js';
import { TaskTask } from './TaskTask.js';
import { TaskOptions } from './TaskOptions.js';
import { TaskWorkflows } from './TaskWorkflows.js';

/**
 * Request contains information of a task to be created or updated.
 */
export interface TaskRequest {
  attachmentOptions?: {
    removeOtherFiles?: boolean;
  };
  attachments?: {
    files?: TaskFile[];
    pendingFiles?: TaskPendingFile[];
  };
  card?: TaskCard;
  predecessors?: TaskPredecessor[];
  tags?: TagTag[];
  task?: TaskTask;
  taskOptions?: TaskOptions;
  workflows?: TaskWorkflows;
}

/**
 * File stores information about a uploaded file.
 */
export interface TaskFile {
  categoryId?: number;
  id?: number;
}

/**
 * PendingFile stores information about a file uploaded on-the-fly.
 */
export interface TaskPendingFile {
  categoryId?: number;
  reference?: string;
} 