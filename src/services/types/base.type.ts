export interface IItemResponse<T> extends IResponse {
  item: T;
}

export interface IListResponse<T> extends IPaginationResponse, IResponse {
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

export interface IResponse {
  message: string;
  statusCode: number;
}

export interface IItem {
  id: string;
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
