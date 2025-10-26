import { PayloadNullableDate } from './PayloadNullableDate.js';

/**
 * RepeatOptions stores recurring information for the task.
 */
export interface TaskRepeatOptions {
  duration?: number;
  editOption?: string;
  endsAt?: PayloadNullableDate;
  frequency?: string;
  monthlyRepeatType?: string;
  /**
   * Adds the RRule definition for repeating tasks. It replaces all other repeating fields.
   */
  rrule?: string;
  selectedDays?: string[];
} 