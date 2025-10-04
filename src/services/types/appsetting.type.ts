import { IItem } from '@/services/types';

export enum MilestoneTemplateType {
  SELL = 'SELL',
  RENT = 'RENT',
  CUSTOM = 'CUSTOM',
}

export enum ComplaintReasonType {
  SHOP = 'SHOP',
  CUSTOMER = 'CUSTOMER',
}

export interface IMilestoneTemplate extends IItem {
  title: string;
  description: string;
  index: number;
  timeGap: number;
  type: MilestoneTemplateType;
}

export interface IConfirmNoComplaint extends IItem {
  orderId: string;
  isCusConfirm: boolean;
  isShopConfirm: boolean;
}

export interface IComplaintReason extends IItem {
  code: string;
  reason: string;
  reputationPenalty: number;
  type: ComplaintReasonType;
}

export interface IAppSetting extends IItem {
  cancelPenalty: number;
  delayPenalty: number;
  daysToComplaint: number;
  daysToReviewUpdateRequest: number;
}

export interface ISetCancelPenalty {
  penalty: number;
}

export interface ICreateComplaintReason {
  code: string;
  reason: string;
  complaintReputationPenalty: number;
}

export interface IUpdateComplaintReason extends ICreateComplaintReason {
  id: string;
}

export interface ISetDaysToComplaint {
  days: number;
}

export interface ISetDaysToReviewUpdateRequest {
  days: number;
}

export interface ISetDelayPenalty {
  penalty: number;
}

export interface IGetMilestoneTemplate {
  type: MilestoneTemplateType;
}

export interface IAddNewMilestoneTemplate {
  title: string;
  description: string;
  timeGap: number;
  type: MilestoneTemplateType;
}

export interface IUpdateMilestoneTemplate extends IAddNewMilestoneTemplate {
  id: string;
}

export interface IRemoveMilestoneTemplate {
  type: MilestoneTemplateType;
}
