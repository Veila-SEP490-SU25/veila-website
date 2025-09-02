import { IItem } from "@/services/types/base.type";
import { ICategory } from "@/services/types/category.type";
import { IUser } from "@/services/types/user.type";

export enum BlogStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  UNPUBLISHED = "UNPUBLISHED",
}

export interface IBlog extends IItem {
  userId: string;
  categoryId: string | null;

  user: IUser;
  category: ICategory | null;
  title: string;
  content: string;
  images: string | null;
  isVerified: boolean;
  status: BlogStatus;
}

export interface ICreateBlog {
  categoryId?: string;
  title: string;
  content: string;
  images: string;
  status: BlogStatus;
}

export interface IUpdateBlog {
  categoryId?: string;
  title: string;
  content: string;
  images: string;
  status: BlogStatus;
}

export const blogStatusColors = {
  [BlogStatus.DRAFT]: "bg-gray-100 text-gray-800",
  [BlogStatus.PUBLISHED]: "bg-green-100 text-green-800",
  [BlogStatus.UNPUBLISHED]: "bg-red-100 text-red-800",
};

export const blogStatusLabels = {
  [BlogStatus.DRAFT]: "Bản nháp",
  [BlogStatus.PUBLISHED]: "Đã xuất bản",
  [BlogStatus.UNPUBLISHED]: "Chưa xuất bản",
};
