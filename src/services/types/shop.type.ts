import { IItem } from "@/services/types";

export enum ShopStatus {
  PENDING = 'PENDING', // Đang chờ duyệt
  ACTIVE = 'ACTIVE', // Đang hoạt động
  INACTIVE = 'INACTIVE', // Tạm ngưng hoạt động (do chủ shop)
  SUSPENDED = 'SUSPENDED', // Tạm ngưng (do admin)
  BANNED = 'BANNED', // Bị cấm hoạt động
}

export interface IShop extends IItem
{
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
}