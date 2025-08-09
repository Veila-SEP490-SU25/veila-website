import { IItem, IShop } from "@/services/types";

export enum LicenseStatus {
  PENDING = "PENDING", // Đang chờ duyệt
  APPROVED = "APPROVED", // Đã duyệt
  REJECTED = "REJECTED", // Bị từ chối
  RESUBMIT = "RESUBMIT", // Yêu cầu gửi lại
}

export interface ILicense extends IItem {
  shop: IShop;
  status: LicenseStatus;
  rejectReason: string | null;
}
