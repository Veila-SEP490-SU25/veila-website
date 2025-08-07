import { ICategory, IFeedback, IItem, IUser } from "@/services/types";

export enum AccessoryStatus {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
}

export interface IAccessory extends IItem {
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
  status: AccessoryStatus;
  feedbacks: IFeedback[];
}