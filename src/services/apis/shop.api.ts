import { baseQueryWithRefresh } from '@/services/apis/base.query';
import {
  IAccessory,
  IBlog,
  ICategory,
  ICreateShop,
  IDress,
  IGetShopItem,
  IHandleCreateShop,
  IItemResponse,
  IListResponse,
  IPagination,
  IService,
  IShop,
  IUpdateShopInfo,
  ShopStatus,
} from '@/services/types';
import { createApi } from '@reduxjs/toolkit/query/react';

export interface IUpdateShopStatus {
  shopId: string;
  status: ShopStatus;
}

export const shopApi = createApi({
  reducerPath: 'shopApi',
  baseQuery: baseQueryWithRefresh,
  endpoints: (builder) => ({
    getShops: builder.query<IListResponse<IShop>, IPagination>({
      query: ({ sort = '', filter = '', page = 0, size = 10 }) => ({
        url: 'shops',
        method: 'GET',
        params: { sort, filter, page, size },
      }),
    }),

    getShop: builder.query<IItemResponse<IShop>, string>({
      query: (id) => ({
        url: `shops/${id}`,
        method: 'GET',
      }),
    }),

    getShopAccessories: builder.query<IListResponse<IAccessory>, IGetShopItem>({
      query: ({ id, sort = '', filter = '', page = 0, size = 10 }) => ({
        url: `shops/${id}/accessories`,
        method: 'GET',
        params: { page, size, sort, filter },
      }),
    }),

    getShopBlogs: builder.query<IListResponse<IBlog>, IGetShopItem>({
      query: ({ id, sort = '', filter = '', page = 0, size = 10 }) => ({
        url: `shops/${id}/blogs`,
        method: 'GET',
        params: { page, size, sort, filter },
      }),
    }),

    getShopDresses: builder.query<IListResponse<IDress>, IGetShopItem>({
      query: ({ id, sort = '', filter = '', page = 0, size = 10 }) => ({
        url: `shops/${id}/dresses`,
        method: 'GET',
        params: { page, size, sort, filter },
      }),
    }),

    getShopCategories: builder.query<IListResponse<ICategory>, IGetShopItem>({
      query: ({ id, sort = '', filter = '', page = 0, size = 10 }) => ({
        url: `shops/${id}/categories`,
        method: 'GET',
        params: { page, size, sort, filter },
      }),
    }),

    getShopServices: builder.query<IListResponse<IService>, IGetShopItem>({
      query: ({ id, sort = '', filter = '', page = 0, size = 10 }) => ({
        url: `shops/${id}/services`,
        method: 'GET',
        params: { page, size, sort, filter },
      }),
    }),

    addFavoriteShop: builder.mutation<IItemResponse<IShop>, string>({
      query: (id) => ({
        url: `shops/${id}/favorites`,
        method: 'POST',
      }),
    }),

    removeFavoriteShop: builder.mutation<IItemResponse<IShop>, string>({
      query: (id) => ({
        url: `shops/${id}/favorites`,
        method: 'DELETE',
      }),
    }),

    getFavoriteShops: builder.query<IListResponse<IShop>, IPagination>({
      query: ({ sort = '', filter = '', page = 0, size = 10 }) => ({
        url: 'shops/favorites',
        method: 'GET',
        params: { sort, filter, page, size },
      }),
    }),

    getMyShop: builder.query<IItemResponse<IShop>, void>({
      query: () => ({
        url: 'shops/me',
        method: 'GET',
      }),
    }),

    staffHandleCreateShop: builder.mutation<IItemResponse<IShop>, IHandleCreateShop>({
      query: ({ id, ...body }) => ({
        url: `shops/${id}/review`,
        method: 'PATCH',
        body,
      }),
    }),

    createShop: builder.mutation<IItemResponse<IShop>, ICreateShop>({
      query: (body) => ({
        url: 'shops/me',
        method: 'POST',
        body,
      }),
    }),

    recreateShop: builder.mutation<IItemResponse<IShop>, ICreateShop>({
      query: (body) => ({
        url: 'shops/me',
        method: 'PUT',
        body,
      }),
    }),

    updateShopInfo: builder.mutation<IItemResponse<IShop>, IUpdateShopInfo>({
      query: (body) => ({
        url: 'shops/me',
        method: 'PATCH',
        body,
      }),
    }),

    updateShopStatus: builder.mutation<IItemResponse<null>, IUpdateShopStatus>({
      query: ({ shopId, status }) => ({
        url: `shops/${shopId}/${status}`,
        method: 'PUT',
      }),
    }),
  }),
});

export const {
  useLazyGetMyShopQuery,
  useLazyGetShopAccessoriesQuery,
  useLazyGetShopCategoriesQuery,
  useLazyGetShopBlogsQuery,
  useLazyGetShopDressesQuery,
  useLazyGetShopServicesQuery,
  useLazyGetShopQuery,
  useLazyGetShopsQuery,

  useLazyGetFavoriteShopsQuery,
  useAddFavoriteShopMutation,
  useRemoveFavoriteShopMutation,

  useCreateShopMutation,
  useRecreateShopMutation,
  useUpdateShopInfoMutation,
  useStaffHandleCreateShopMutation,
  useUpdateShopStatusMutation,
} = shopApi;
