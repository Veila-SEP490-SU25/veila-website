import { baseQueryWithRefresh } from "@/services/apis/base.query";
import {
  ICreateDress,
  IDress,
  IItemResponse,
  IListResponse,
  IPagination,
  IUpdateDress,
} from "@/services/types";
import { createApi } from "@reduxjs/toolkit/query/react";

export const dressApi = createApi({
  reducerPath: "dressApi",
  baseQuery: baseQueryWithRefresh,
  endpoints: (builder) => ({
    getDresses: builder.query<IListResponse<IDress>, IPagination>({
      query: ({ filter = "", page = 1, size = 10, sort = "" }) => {
        return {
          url: "dresses",
          params: { filter, page, size, sort },
        };
      },
    }),

    getDress: builder.query<IItemResponse<IDress>, string>({
      query: (id) => {
        return {
          url: `dresses/${id}`,
          method: "GET",
        };
      },
    }),

    getMyShopDresses: builder.query<IListResponse<IDress>, IPagination>({
      query: ({ filter = "", page = 1, size = 10, sort = "" }) => {
        return {
          url: "dresses/me",
          params: { filter, page, size, sort },
        };
      },
    }),

    getMyShopDress: builder.query<IItemResponse<IDress>, string>({
      query: (id) => {
        return {
          url: `dresses/${id}/me`,
          method: "GET",
        };
      },
    }),

    createDress: builder.mutation<IItemResponse<IDress>, ICreateDress>({
      query: (body) => ({
        url: "dresses/me",
        method: "POST",
        body,
      }),
    }),

    updateDress: builder.mutation<IItemResponse<null>, IUpdateDress>({
      query: ({ id, ...body }) => ({
        url: `dresses/${id}/me`,
        method: "PUT",
        body,
      }),
    }),

    deleteDress: builder.mutation<IItemResponse<null>, string>({
      query: (id) => ({
        url: `dresses/${id}/me`,
        method: "DELETE",
      }),
    }),

    restoreDress: builder.mutation<IItemResponse<null>, string>({
      query: (id) => ({
        url: `dresses/${id}/me`,
        method: "PATCH",
      }),
    }),
  }),
});

export const {
  useLazyGetDressesQuery,
  useLazyGetDressQuery,
  useLazyGetMyShopDressQuery,
  useLazyGetMyShopDressesQuery,
  useCreateDressMutation,
  useUpdateDressMutation,
  useDeleteDressMutation,
} = dressApi;
