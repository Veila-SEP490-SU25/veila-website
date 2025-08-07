import { IItem, IUser } from "@/services/types";

export enum RequestStatus {
  DRAFT = 'DRAFT',
  SUBMIT = 'SUBMIT',
  ACCEPTED = 'ACCEPTED',
  CANCELLED = 'CANCELLED',
}

export enum UpdateRequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export interface IRequest extends IItem {
  user: IUser;
  title: string;
  description: string;
  high: number | null;
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
  dressStyle: string | null;
  curtainNeckline: string | null;
  sleeveStyle: string | null;
  material: string | null;
  color: string | null;
  specialElement: string | null;
  coverage: string | null;
  status: RequestStatus;
  isPrivate: boolean;
  updateRequests: IUpdateRequest[] | null;
}

export interface IUpdateRequest extends IItem {
  request: IRequest;
  title: string;
  description: string;
  high: number | null;
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
  dressStyle: string | null;
  curtainNeckline: string | null;
  sleeveStyle: string | null;
  material: string | null;
  color: string | null;
  specialElement: string | null;
  coverage: string | null;
  status: UpdateRequestStatus;
}