import { IItem, IUser } from "@/services/types";

export interface IWallet extends IItem {
  userId: string;

  user: IUser;
  availableBalance: number;
  lockedBalance: number;
  bin: string | null;
  bankNumber: string | null;
  pin: string | null;
}

export interface IDeposit {
  amount: number;
  note: string | null;
}

export interface IWithdraw {
  amount: number;
  note: string | null;
  otp: string;
}

export interface ITransfer {
  transactionId: string;
  orderCode: string;
  checkoutUrl: string;
  qrCode: string;
  expiredAt: Date;
}

export interface IUpdateWalletPIN {
  oldPin: string;
  pin: string;
}