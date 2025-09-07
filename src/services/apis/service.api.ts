import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithRefresh } from './base.query';

export interface IService {
  id: string;
  name: string;
  images: string;
  ratingAverage: string;
  status: 'AVAILABLE' | 'UNAVAILABLE';
  user?: {
    shop: {
      id: string;
      name: string;
      address: string;
      logoUrl: string;
      reputation: number;
    };
  };
  category?: {
    id: string;
    name: string;
    type: string;
  };
}

export interface ICreateService {
  name: string;
  description: string;
  status: 'AVAILABLE' | 'UNAVAILABLE';
}

export interface IUpdateService {
  id: string;
  name?: string;
  description?: string;
  images?: string;
  status?: 'AVAILABLE' | 'UNAVAILABLE';
}

export interface IServiceResponse {
  message: string;
  statusCode: number;
  pageIndex: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  items: IService[]; // Thay đổi từ item thành items array
}

export const serviceApi = createApi({
  reducerPath: 'serviceApi',
  baseQuery: baseQueryWithRefresh,
  tagTypes: ['Service'],
  endpoints: (builder) => ({
    // Lấy dịch vụ của shop
    getShopServices: builder.query<IServiceResponse, string>({
      query: (shopId) => `/shops/${shopId}/services`,
      providesTags: ['Service'],
    }),

    // Tạo dịch vụ mới
    createService: builder.mutation<IServiceResponse, ICreateService>({
      query: (data) => ({
        url: '/services/me',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Service'],
    }),

    // Cập nhật dịch vụ
    updateService: builder.mutation<IServiceResponse, IUpdateService>({
      query: ({ id, ...data }) => ({
        url: `/services/${id}/me`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Service'],
    }),

    // Xóa dịch vụ
    deleteService: builder.mutation<IServiceResponse, string>({
      query: (id) => ({
        url: `/services/${id}/me`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Service'],
    }),
  }),
});

export const {
  useGetShopServicesQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} = serviceApi;
