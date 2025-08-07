import { ICategory, IFeedback, IItem, IUser } from "@/services/types";

export enum ServiceStatus {
  AVAILABLE = "AVAILABLE",
  UNAVAILABLE = "UNAVAILABLE",
  DRAFT = "DRAFT",
}

export interface IService extends IItem {
  user: IUser;
  category: ICategory | null;
  name: string;
  description: string | null;
  ratingAverage: number;
  ratingCount: number;
  status: ServiceStatus;
  feedbacks: IFeedback[];
}
