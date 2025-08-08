import { IUser, IItem, ICategory, IFeedback } from "@/services/types";

export enum DressStatus {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
}

export interface IDress extends IItem {
  user: IUser;
  category: ICategory | null;
  name: string;
  description: string | null;
  sellPrice: number;
  rentalPrice: number;
  isSellable: boolean;
  isRentable: boolean;
  ratingAverage: number;
  ratingCount: number;
  status: DressStatus;
  feedbacks: IFeedback[];
}

export interface ICreateDress {
  
}