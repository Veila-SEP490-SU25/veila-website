import { baseQueryWithRefresh } from "@/services/apis/base.query";
import {
  IDress,
  IItemResponse,
  IListResponse,
  IPagination,
} from "@/services/types";
import { createApi } from "@reduxjs/toolkit/query/react";

export const dressApi = createApi({
  reducerPath: "dressApi",
  baseQuery: baseQueryWithRefresh,
  endpoints: (builders) => ({
    getDresses: builders.query<IListResponse<IDress>, IPagination>({
      query: ({ filter = "", page = 1, size = 10, sort = "" }) => {
        return {
          url: "/dresses",
          params: { filter, page, size, sort },
        };
      },
    }),

    getDress: builders.query<IItemResponse<IDress>, string>({
      query: (id) => {
        return {
          url: `/dresses/${id}`,
          method: "GET",
        };
      },
    }),

    getMyShopDresses: builders.query<IListResponse<IDress>, IPagination>({
      query: ({ filter = "", page = 1, size = 10, sort = "" }) => {
        return {
          url: "/dresses/me",
          params: { filter, page, size, sort },
        };
      },
    }),

    getMyShopDress: builders.query<IItemResponse<IDress>, string>({
      query: (id) => {
        return {
          url: `/dresses/${id}/me`,
          method: "GET",
        };
      },
    }),
  }),
});

export const {
  useLazyGetDressesQuery,
  useLazyGetDressQuery,
  useLazyGetMyShopDressQuery,
  useLazyGetMyShopDressesQuery,
} = dressApi;
