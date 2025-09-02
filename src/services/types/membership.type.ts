import { IItem, IShop, ISubscription, ITransaction } from "@/services/types";

export enum MembershipStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IMembership extends IItem {
  shopId?: string;

  shop?: IShop;
  subscription?: ISubscription;
  transaction?: ITransaction;
  startDate: string; // Changed from Date to string based on API response
  endDate: string; // Changed from Date to string based on API response
  status: MembershipStatus;
}
