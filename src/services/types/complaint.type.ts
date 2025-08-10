import { IItem, IOrder, IPagination, IUser } from "@/services/types";

export enum ComplaintStatus {
  DRAFT = "DRAFT",
  IN_PROGRESS = "IN_PROGRESS",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface IComplaint extends IItem {
  sender: IUser;
  order: IOrder;
  title: string;
  description: string;
  status: ComplaintStatus;
}

export interface IUpdateComplaint {
  id: string;
  title: string;
  description: string;
  status: ComplaintStatus;
  images: string;
}

export interface IResponseComplaint {
  id: string;
  status: ComplaintStatus.APPROVED | ComplaintStatus.REJECTED;
}

export interface IGetComplaints extends IPagination {
  id: string;
}

export interface ICreateComplaint {
  id: string;
  title: string;
  description: string;
  images: string;
  status: ComplaintStatus;
}
