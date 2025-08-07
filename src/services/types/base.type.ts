export interface IItemResponse<T> {
  message: string;
  statusCode: number;
  item: T;
}

export interface IListResponse<T> {
  message: string;
  statusCode: number;
  pageIndec: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  items: T[];
}

export interface IErrorResponse {
  message: string;
  statusCode: number;
}

export interface IItem {
  id: string;
  images: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}