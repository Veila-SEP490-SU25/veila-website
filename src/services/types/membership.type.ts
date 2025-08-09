import { IItem, IShop, ISubscription, ITransaction } from "@/services/types";

export enum MembershipStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface IMembership extends IItem {
  shop: IShop;
  subscription: ISubscription;
  transaction: ITransaction;
  startDate: Date;
  endDate: Date;
  status: MembershipStatus;
}