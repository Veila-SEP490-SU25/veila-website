import { IItem, IMilestone } from "@/services/types";

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface ITask extends IItem {
  milestone: IMilestone;
  title: string;
  description: string | null;
  index: number;
  status: TaskStatus;
  dueDate: Date;
}