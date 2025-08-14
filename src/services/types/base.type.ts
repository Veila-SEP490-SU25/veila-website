export interface IItemResponse<T> {
  message: string;
  statusCode: number;
  item: T;
}

export interface IListResponse<T> {
  message: string;
  statusCode: number;
  pageIndex: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  items: T[];
}

export interface IPaginationResponse {
  pageIndex: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface IErrorResponse {
  message: string;
  statusCode: number;
}

export interface IItem {
  id: string;
  images: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface IPagination {
  page: number | null;
  size: number | null;
  filter: string | null;
  sort: string | null;
}