import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "./base.query";
import type { IListResponse } from "../types/base.type";
import type {
  ICustomOrderRequest,
  ICustomOrderRequestResponse,
} from "../types/custom-order.type";

export const customOrderApi = createApi({
  reducerPath: "customOrderApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: ["CustomOrder"],
  endpoints: (builder) => ({
    getCustomOrderRequests: builder.query<
      IListResponse<ICustomOrderRequest>,
      { pageIndex: number; pageSize: number; filter?: string; sort?: string }
    >({
      query: (params) => ({
        url: "/requests",
        method: "GET",
        params: {
          pageIndex: params.pageIndex,
          pageSize: params.pageSize,
          filter: params.filter || "",
          sort: params.sort || "",
        },
      }),
      providesTags: ["CustomOrder"],
    }),

    getCustomOrderRequestById: builder.query<
      ICustomOrderRequestResponse,
      string
    >({
      query: (id) => ({
        url: `/requests/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "CustomOrder", id }],
    }),
  }),
});

export const {
  useGetCustomOrderRequestsQuery,
  useLazyGetCustomOrderRequestsQuery,
  useGetCustomOrderRequestByIdQuery,
  useLazyGetCustomOrderRequestByIdQuery,
} = customOrderApi;
