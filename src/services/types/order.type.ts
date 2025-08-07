import {
  IAccessory,
  IDress,
  IItem,
  IMilestone,
  IRequest,
  IService,
  IShop,
  ITransaction,
  IUpdateRequest,
  IUser,
} from "@/services/types";

export enum OrderStatus {
  PENDING = "PENDING",
  IN_PROCESS = "IN_PROCESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum OrderType {
  SELL = "SELL",
  RENT = "RENT",
  CUSTOM = "CUSTOM",
}

export interface IOrder extends IItem {
  customer: IUser;
  shop: IShop;
  phone: string;
  email: string;
  address: string;
  dueDate: Date;
  returnDate: Date | null;
  isBuyBack: boolean;
  amount: number;
  type: OrderType;
  status: OrderStatus;
  milestones: IMilestone[];
  orderAccessoryDetail: IOrderAccessoryDetail[] | null;
  orderDressDetail: IOrderDressDetail | null;
  orderServiceDetail: IOrderServiceDetail | null;
  transaction: ITransaction[];
}

export interface IOrderAccessoryDetail extends IItem {
  order: IOrder;
  accessory: IAccessory;
  quantity: number;
  description: string | null;
  price: number;
  isRated: boolean;
}

export interface IOrderDressDetail extends IItem {
  order: IOrder;
  dress: IDress;
  high: number | null;
  weight: number | null;
  bust: number | null;
  waist: number | null;
  hip: number | null;
  armpit: number | null;
  bicep: number | null;
  neck: number | null;
  shoulderWidth: number | null;
  sleeveLength: number | null;
  backLength: number | null;
  lowerWaist: number | null;
  waistToFloor: number | null;
  description: string | null;
  price: number;
  isRated: boolean;
}

export interface IOrderServiceDetail extends IItem {
  order: IOrder;
  request: IRequest;
  service: IService;
  price: number;
  isRated: boolean;
  updateOrderServiceDetails: IUpdateOrderServiceDetail[] | null;
}

export interface IUpdateOrderServiceDetail extends IItem {
  orderServiceDetail: IOrderServiceDetail;
  updateRequest: IUpdateRequest;
  price: number;
}
