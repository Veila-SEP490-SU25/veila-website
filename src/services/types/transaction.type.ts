import { IItem, IMembership, IOrder, IWallet } from "@/services/types";

export enum TransactionType {
  DEPOSIT = "DEPOSIT",
  WITHDRAW = "WITHDRAW",
  TRANSFER = "TRANSFER",
  RECEIVE = "RECEIVE",
  REFUND = "REFUND",
}

export enum TransactionStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
  DISPUTED = "DISPUTED",
}

export enum TypeBalance {
  AVAILABLE = "AVAILABLE",
  LOCKED = "LOCKED",
}

export interface ITransaction extends IItem {
  walletId: string;
  orderId: string | null;

  wallet: IWallet;
  order: IOrder | null;
  membership: IMembership | null;
  from: string;
  to: string;
  fromTypeBalance: TypeBalance;
  toTypeBalance: TypeBalance;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  note: string | null;
  availableBalanceSnapshot: number;
  lockedBalanceSnapshot: number;
}

export interface IUpdateTransactionStatus {
  id: string;
  status: TransactionStatus;
}
