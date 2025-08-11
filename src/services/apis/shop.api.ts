import { baseQueryWithRefresh } from "@/services/apis/base.query";
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
} from "@/services/types";
import { createApi } from "@reduxjs/toolkit/query/react";

export const shopApi = createApi({
  reducerPath: "shopApi",
  baseQuery: baseQueryWithRefresh,
  endpoints: (builder) => ({
    getShops: builder.query<IListResponse<IShop>, IPagination>({
      query: ({ sort = "", filter = "", page = 0, size = 10 }) => ({
        url: "shops",
        method: "GET",
        params: { sort, filter, page, size },
      }),
    }),

    getShop: builder.query<IItemResponse<IShop>, string>({
      query: (id) => ({
        url: `shops/${id}`,
        method: "GET",
      }),
    }),

    getShopAccessories: builder.query<IListResponse<IAccessory>, IGetShopItem>({
      query: ({ id, sort = "", filter = "", page = 0, size = 10 }) => ({
        url: `shops/${id}/accessories`,
        method: "GET",
        params: { page, size, sort, filter },
      }),
    }),

    getShopBlogs: builder.query<IListResponse<IBlog>, IGetShopItem>({
      query: ({ id, sort = "", filter = "", page = 0, size = 10 }) => ({
        url: `shops/${id}/blogs`,
        method: "GET",
        params: { page, size, sort, filter },
      }),
    }),

    getShopDresses: builder.query<IListResponse<IDress>, IGetShopItem>({
      query: ({ id, sort = "", filter = "", page = 0, size = 10 }) => ({
        url: `shops/${id}/dresses`,
        method: "GET",
        params: { page, size, sort, filter },
      }),
    }),

    getShopCategories: builder.query<IListResponse<ICategory>, IGetShopItem>({
      query: ({ id, sort = "", filter = "", page = 0, size = 10 }) => ({
        url: `shops/${id}/categories`,
        method: "GET",
        params: { page, size, sort, filter },
      }),
    }),

    getShopServices: builder.query<IListResponse<IService>, IGetShopItem>({
      query: ({ id, sort = "", filter = "", page = 0, size = 10 }) => ({
        url: `shops/${id}/services`,
        method: "GET",
        params: { page, size, sort, filter },
      }),
    }),

    staffGetShops: builder.query<IListResponse<IShop>, IPagination>({
      query: ({ sort = "", filter = "", page = 0, size = 10 }) => ({
        url: "shops/staff",
        method: "GET",
        params: { sort, filter, page, size },
      }),
    }),

    staffGetShop: builder.query<IItemResponse<IShop>, string>({
      query: (id) => ({
        url: `shops/${id}/staff`,
        method: "GET",
      }),
    }),

    getMyShop: builder.query<IItemResponse<IShop>, void>({
      query: () => ({
        url: "shops/me",
        method: "GET",
      }),
    }),

    staffHandleCreateShop: builder.mutation<
      IItemResponse<IShop>,
      IHandleCreateShop
    >({
      query: ({ id, ...body }) => ({
        url: `shops/${id}staff`,
        method: "PATCH",
        body,
      }),
    }),

    createShop: builder.mutation<IItemResponse<IShop>, ICreateShop>({
      query: (body) => ({
        url: "shops/me",
        method: "POST",
        body,
      }),
    }),

    recreateShop: builder.mutation<IItemResponse<IShop>, ICreateShop>({
      query: (body) => ({
        url: "shops/me",
        method: "PUT",
        body,
      }),
    }),

    updateShopInfo: builder.mutation<IItemResponse<IShop>, IUpdateShopInfo>({
      query: (body) => ({
        url: "shops/me",
        method: "PATCH",
        body,
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
  useLazyStaffGetShopQuery,
  useLazyStaffGetShopsQuery,
  useCreateShopMutation,
  useRecreateShopMutation,
  useUpdateShopInfoMutation,
  useStaffHandleCreateShopMutation,
} = shopApi;
