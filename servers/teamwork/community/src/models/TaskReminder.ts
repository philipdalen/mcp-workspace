/**
 * Reminder stores all necessary information to create a task reminder.
 */
export interface TaskReminder {
  isRelative?: boolean;
  note?: string;
  relativeNumberDays?: number;
  remindAt?: string;
  type?: string;
  userId?: number;
} 