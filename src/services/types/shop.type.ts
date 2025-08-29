import { IContract, IItem, ILicense, IMembership, IPagination, IUser } from "@/services/types";

export enum ShopStatus {
  PENDING = "PENDING", // Đang chờ duyệt
  ACTIVE = "ACTIVE", // Đang hoạt động
  INACTIVE = "INACTIVE", // Tạm ngưng hoạt động (do chủ shop)
  SUSPENDED = "SUSPENDED", // Tạm ngưng (do admin)
  BANNED = "BANNED", // Bị cấm hoạt động
}

export interface IShop extends IItem {
  userId: string;
  
  user: IUser;
  name: string;
  phone: string;
  email: string;
  address: string;
  description: string | null;
  logoUrl: string | null;
  coverUrl: string | null;
  status: ShopStatus;
  reputation: number;
  isVerified: boolean;
  memberships: IMembership[];
  license: ILicense | null;
  contract: IContract;
}

export interface IGetShopItem extends IPagination {
  id: string;
}

export interface IHandleCreateShop {
  id: string;
  isApproved: boolean;
  rejectReason: string | null;
}

export interface ICreateShop {
  name: string;
  phone: string;
  email: string;
  address: string;
  licenseImages: string;
}

export interface IUpdateShopInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  description: string;
  logoUrl: string;
  coverUrl: string;
}
