import {
  IAccessoriesDetail,
  IAccessory,
  IDress,
  IDressDetails,
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
  height: number | null;
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

export interface INewOrder {
  phone: string;
  email: string;
  address: string;
  dueDate: Date;
  returnDate: Date;
  type: OrderType;
}

export interface ICreateOrder {
  newOrder: INewOrder;
  dressDetails: IDressDetails;
  accessoriesDetails: IAccessoriesDetail[];
}

export interface IUpdateOrderInfo {
  id: string;
  phone: string;
  email: string;
  address: string;
  dueDate: Date;
  returnDate: Date;
}

export interface IUpdateOrderStatus {
  id: string;
  status: OrderStatus;
}

export interface ICreateCustomOrder {
  phone: string;
  email: string;
  address: string;
  requestId: string;
  shopId: string;
}
