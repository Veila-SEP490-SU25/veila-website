import { IItem, IUser } from "@/services/types";

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