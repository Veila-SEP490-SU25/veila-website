import { IItem } from "@/services/types";

export interface ISubscription extends IItem {
  name: string;
  description: string;
  images: string | null;
  duration: number; // Changed from number to string based on API response
  amount: number;
}

export interface ICreateSubscription {
  name: string;
  description: string;
  duration: number;
  amount: number;
  images: string;
}

export interface IUpdateSubscription extends ICreateSubscription{
  id: string;
}