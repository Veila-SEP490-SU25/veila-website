import { ICategory, IItem, IUser } from "@/services/types";

export enum BlogStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  UNPUBLISHED = "UNPUBLISHED",
}

export interface IBlog extends IItem {
  userId: string;

  user: IUser;
  category: ICategory | null;
  title: string;
  content: string;
  images: string | null;
  isVerified: boolean;
  status: BlogStatus;
}

export interface IUpdateBlog extends ICreateBlog {
  id: string;
}

export interface ICreateBlog {
  categoryId: string;
  title: string;
  content: string;
  images: string;
  status: BlogStatus;
}
