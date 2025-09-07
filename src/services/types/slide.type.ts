import { IItem } from '@/services/types';

export interface ISlide extends IItem {
  title: string;
  description: string | null;
  images: string | null;
}

export interface ICreateSlide {
  title: string;
  description: string | null;
  images: string;
}

export interface IUpdateSlide extends ICreateSlide {
  id: string;
}
