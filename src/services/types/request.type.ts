import { IItem, IPagination, IUser } from "@/services/types";

export enum RequestStatus {
  DRAFT = "DRAFT",
  SUBMIT = "SUBMIT",
  ACCEPTED = "ACCEPTED",
  CANCELLED = "CANCELLED",
}

export enum UpdateRequestStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

export interface IRequest extends IItem {
  user: IUser;
  title: string;
  description: string;
  height: number | null;
  weight: number | null;
  bust: number | null;
  waist: number | null;
  hip: number | null;
  armpit: number | null;
  bicep: number | null;
  neck: number | null;
  shoulderWidth: number | null;
  sleeveLength: number | null;
  backLength: number | null;
  lowerWaist: number | null;
  waistToFloor: number | null;
  material: string | null;
  color: string | null;
  length: string | null;
  neckline: string | null;
  sleeve: string | null;
  images: string | null;
  status: RequestStatus;
  isPrivate: boolean;
  updateRequests: IUpdateRequest[] | null;
}

export interface IUpdateRequest extends IItem {
  request: IRequest;
  title: string;
  description: string;
  height: number | null;
  weight: number | null;
  bust: number | null;
  waist: number | null;
  hip: number | null;
  armpit: number | null;
  bicep: number | null;
  neck: number | null;
  shoulderWidth: number | null;
  sleeveLength: number | null;
  backLength: number | null;
  lowerWaist: number | null;
  waistToFloor: number | null;
  material: string | null;
  color: string | null;
  length: string | null;
  neckline: string | null;
  sleeve: string | null;
  images: string | null;
  status: UpdateRequestStatus;
}

export interface IUpdateRequestInfo extends ICreateRequest {
  id: string;
}

export interface ICreateRequest {
  title: string;
  description: string;
  images: string;
  height: number;
  weight: number;
  bust: number;
  waist: number;
  hip: number;
  armpit: number;
  bicep: number;
  neck: number;
  shoulderWidth: number;
  sleeveLength: number;
  backLength: number;
  lowerWaist: number;
  waistToFloor: number;
  status: RequestStatus;
  isPrivate: boolean;
}

export interface IGetUpdateRequest extends IPagination {
  id: string;
}
