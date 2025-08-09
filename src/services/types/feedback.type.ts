import {
  IAccessory,
  IDress,
  IItem,
  IOrder,
  IService,
  IUser,
} from "@/services/types";

export interface IFeedback extends IItem {
  customer: IUser;
  order: IOrder;
  dress: IDress | null;
  service: IService | null;
  accessory: IAccessory | null;
  content: string;
  rating: number;
}

export interface ICreateFeedback {
  orderId: string;
  productId: string;
  content: string;
  rating: number;
  images: string;
}
