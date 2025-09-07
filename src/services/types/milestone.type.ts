import { IItem, IOrder, IPagination, ITask, TaskStatus } from '@/services/types';

export enum MilestoneStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface IMilestone extends IItem {
  orderId: string;

  order: IOrder;
  title: string;
  description: string | null;
  index: number;
  status: MilestoneStatus;
  dueDate: Date;
  tasks: ITask[];
}

export interface IRetiveMilestone {
  orderId: string;
  sort: string;
}

export interface INewMilestone {
  orderId: string;
  title: string;
  description: string;
  index: number;
  status: MilestoneStatus;
  dueDate: Date;
}

export interface INewTask {
  milestoneId: string;
  title: string;
  description: string;
  index: number;
  status: TaskStatus;
  dueDate: Date;
}

export interface ICreateMilestone {
  newMilestone: INewMilestone;
  tasks: INewTask[];
}

export interface IUpdateMilestoneInfo {
  id: string;
  orderId: string;
  title: string;
  description: string;
  index: number;
  status: MilestoneStatus;
  dueDate: Date;
}

export interface IUpdateMilestoneStatus {
  id: string;
  status: MilestoneStatus;
}

export interface IRetriveTasks extends IPagination {
  id: string;
}

export interface ICompleteTask {
  milestoneId: string;
  taskId: string;
}
