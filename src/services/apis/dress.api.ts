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
  endpoints: (builders) => ({
    getDresses: builders.query<IListResponse<IDress>, IPagination>({
      query: ({ filter = "", page = 1, size = 10, sort = "" }) => {
        return {
          url: "dresses",
          params: { filter, page, size, sort },
        };
      },
    }),

    getDress: builders.query<IItemResponse<IDress>, string>({
      query: (id) => {
        return {
          url: `dresses/${id}`,
          method: "GET",
        };
      },
    }),

    getMyShopDresses: builders.query<IListResponse<IDress>, IPagination>({
      query: ({ filter = "", page = 1, size = 10, sort = "" }) => {
        return {
          url: "dresses/me",
          params: { filter, page, size, sort },
        };
      },
    }),

    getMyShopDress: builders.query<IItemResponse<IDress>, string>({
      query: (id) => {
        return {
          url: `dresses/${id}/me`,
          method: "GET",
        };
      },
    }),

    createDress: builders.mutation<IItemResponse<IDress>, ICreateDress>({
      query: (body) => ({
        url: "dresses/me",
        method: "POST",
        body,
      }),
    }),

    updateDress: builders.mutation<IItemResponse<null>, IUpdateDress>({
      query: ({ id, ...body }) => ({
        url: `dresses/${id}/me`,
        method: "PUT",
        body,
      }),
    }),

    deleteDress: builders.mutation<IItemResponse<null>, string>({
      query: (id) => ({
        url: `dresses/${id}/me`,
        method: "DELETE",
      }),
    }),

    restoreDress: builders.mutation<IItemResponse<null>, string>({
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
