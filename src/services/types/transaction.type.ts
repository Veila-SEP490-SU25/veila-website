import { IItem, IMembership, IOrder, IPagination, IWallet } from "@/services/types";

export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer',
  PAYMENT = 'payment',
  REFUND = 'refund',
  OTHER = 'other',
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  DISPUTED = 'disputed',
}

export enum TypeBalance {
  AVAILABLE = 'available',
  LOCKED = 'locked',
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
}

export interface IUpdateTransactionStatus {
  id: string;
  status: TransactionStatus;
}

export interface IGetMyTransaction extends IPagination{
  walletId: string;
}