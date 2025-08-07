import { ICategory, IItem, IUser } from "@/services/types";

export enum BlogStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  UNPUBLISHED = 'UNPUBLISHED',
}

export interface IBlog extends IItem {
  user: IUser;
  category: ICategory | null;
  title: string;
  content: string;
  isVerified: boolean;
  status: BlogStatus;
}