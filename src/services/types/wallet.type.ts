import { IItem, IUser } from "@/services/types";

export interface IWallet extends IItem {
  user: IUser;
  availableBalance: number;
  lockedBalance: number;
  bin: string | null;
  bankNumber: string | null;
}

export interface IDeposit {
  amount: number;
  note: string | null;
}

export interface IWithdraw {
  amount: number;
  note: string | null;
}
