import { IItem, IUser } from "@/services/types";

export interface IWallet extends IItem {
  user: IUser;
  availableBalance: number;
  lockedBalance: number;
}
