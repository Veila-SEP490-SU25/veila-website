import { IItem } from "@/services/types/base.type";

export enum ContractType {
  SHOP = "SHOP",
  CUSTOMER = "CUSTOMER",
}

export enum ContractStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DRAFT = "DRAFT",
}

export interface IContract extends IItem {
  title: string;
  content: string;
  contractType: ContractType;
  effectiveFrom: Date;
  status: ContractStatus;
}
