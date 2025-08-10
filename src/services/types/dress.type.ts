import { IUser, IItem, ICategory, IFeedback } from "@/services/types";

export enum DressStatus {
  AVAILABLE = "AVAILABLE",
  UNAVAILABLE = "UNAVAILABLE",
  OUT_OF_STOCK = "OUT_OF_STOCK",
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
  categoryId: string;
  name: string;
  description: string;
  sellPrice: number;
  rentalPrice: number;
  isSellable: boolean;
  isRentable: boolean;
  status: DressStatus;
  images: string;
}

export interface IUpdateDress extends ICreateDress {
  id: string;
}

export interface IDressDetails {
  dressId: string;
  high: number;
  weight: number;
  bust: number;
  waist: number;
  hip: number;
  armpit: number;
  bicep: number;
  neck: number;
  shoulderWidth: number;
  sleeveLength: number;
  backLength: number;
  lowerWaist: number;
  waistToFloor: number;
  description: string;
  price: number;
  is_rated: boolean;
}
