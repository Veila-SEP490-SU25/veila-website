import { IItem, IShop, IWallet } from "@/services/types";
import { IContract } from "@/services/types/contract.type";

export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  STAFF = "STAFF",
  SHOP = "SHOP",
  CUSTOMER = "CUSTOMER",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
  BANNED = "BANNED",
}

export interface IUser extends IItem {
  username: string;
  email: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  phone: string | null;
  address: string | null;
  birthDate: Date | null;
  avatarUrl: string | null;
  coverUrl: string | null;
  favDresses: string[] | null;
  favShops: string[] | null;
  role: UserRole;
  status: UserStatus;
  reputation: number;
  isVerified: boolean;
  isIdentified?: boolean;
  shop: IShop | null;
  contract: IContract;
  wallet: IWallet | null;
}

export interface IIdentifyUser {
  phone: string;
}

export interface IUpdateProfile {
  firstName?: string;
  middleName?: string | null;
  lastName?: string;
  address?: string | null;
  birthDate?: string | null;
  avatarUrl?: string | null;
  coverUrl?: string | null;
}
