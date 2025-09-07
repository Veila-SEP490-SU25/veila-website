import { IItem, IShop } from '@/services/types';

export enum LicenseStatus {
  PENDING = 'PENDING', // Đang chờ duyệt
  APPROVED = 'APPROVED', // Đã duyệt
  REJECTED = 'REJECTED', // Bị từ chối
  RESUBMIT = 'RESUBMIT', // Yêu cầu gửi lại
}

export interface ILicense extends IItem {
  shopId: string;

  shop: IShop;
  status: LicenseStatus;
  images: string | null;
  rejectReason: string | null;
}
