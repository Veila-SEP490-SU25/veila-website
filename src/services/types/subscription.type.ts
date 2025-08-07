import { IItem } from "@/services/types";

export interface ISubscription extends IItem {
  name: string;
  description: string;
  duration: number;
  amount: number;
}