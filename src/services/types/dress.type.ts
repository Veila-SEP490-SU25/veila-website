import { IUser, IItem, ICategory, IFeedback } from "@/services/types";

export enum DressStatus {
  AVAILABLE = "AVAILABLE",
  UNAVAILABLE = "UNAVAILABLE",
  OUT_OF_STOCK = "OUT_OF_STOCK",
}

export interface IDress extends IItem {
  userId: string;
  categoryId: string | null;

  user: IUser;
  category: ICategory | null;
  name: string;
  description: string | null;
  images: string | null;
  bust: number | null;
  waist: number | null;
  hip: number | null;
  material: string | null;
  color: string | null;
  length: string | null;
  neckline: string | null;
  sleeve: string | null;
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
  categoryId: string | null;
  name: string;
  description: string;
  sellPrice: number;
  rentalPrice: number;
  isSellable: boolean;
  isRentable: boolean;
  status: DressStatus;
  images: string;
  bust?: number;
  waist?: number;
  hip?: number;
  material?: string;
  color?: string;
  length?: string;
  neckline?: string;
  sleeve?: string;
}

export interface IUpdateDress extends ICreateDress {
  id: string;
}

export interface IDressDetails {
  dressId: string;
  height: number;
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
}
