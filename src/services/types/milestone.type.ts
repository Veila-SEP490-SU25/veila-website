import { IItem, IOrder, ITask } from "@/services/types";

export enum MilestoneStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface IMilestone extends IItem {
  order: IOrder;
  title: string;
  description: string | null;
  index: number;
  status: MilestoneStatus;
  dueDate: Date;
  tasks: ITask[];
}