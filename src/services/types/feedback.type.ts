import { IAccessory, IDress, IItem, IOrder, IService, IUser } from '@/services/types';

export interface IFeedback extends IItem {
  customerId: string;
  orderId: string;
  dressId: string | null;
  accessoryId: string | null;

  customer: IUser;
  order: IOrder;
  dress: IDress | null;
  service: IService | null;
  accessory: IAccessory | null;
  content: string;
  rating: number | string;
  images: string | null;
}

export interface IDressFeedback {
  id: string;
  customer: {
    id: string;
    username: string;
    avatarUrl: string | null;
  };
  content: string;
  rating: string;
  images: string | null;
}

export interface ICreateFeedback {
  orderId: string;
  productId: string;
  content: string;
  rating: number;
  images: string;
}
