import { IItem } from "@/services/types";

export interface ISlide extends IItem {
  title: string;
  description: string | null;
}
  