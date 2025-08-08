import { IItem, IPagination, IUser } from "@/services/types";

export enum CategoryType {
  BLOG = 'BLOG',
  DRESS = 'DRESS',
  ACCESSORY = 'ACCESSORY',
  SERVICE = 'SERVICE',
}

export interface ICategory extends IItem {
  user: IUser;
  name: string;
  description: string | null;
  type: CategoryType;
}

export interface ICategoryGetRequest extends IPagination {
  id: string;
}

export interface ICreateCategory{
  name: string;
  description: string;
  images: string;
  type: CategoryType;
}

export interface IUpdateCategory extends ICreateCategory {
  id: string;
}