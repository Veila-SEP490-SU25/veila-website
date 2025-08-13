import { IItem, IUser } from "@/services/types";

export interface IWallet extends IItem {
  user: IUser;
  availableBalance: number;
  lockedBalance: number;
}

export interface IDeposit {
  amount: number;
  note: string;
}

export interface IWithdraw {
  amount: number;
  note: string;
}
