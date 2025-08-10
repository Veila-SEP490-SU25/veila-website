import { baseQueryWithRefresh } from "@/services/apis/base.query";
import {
  ICreateRequest,
  IItemResponse,
  IListResponse,
  IPagination,
  IRequest,
  IUpdateRequestInfo,
} from "@/services/types";
import { createApi } from "@reduxjs/toolkit/query/react";

export const requestApi = createApi({
  reducerPath: "requestApi",
  baseQuery: baseQueryWithRefresh,
  endpoints: (builder) => ({
    getMyRequest: builder.query<IItemResponse<IRequest>, string>({
      query: (id) => ({
        url: `requests/${id}/me`,
        method: "GET",
      }),
    }),

    updateMyRequest: builder.mutation<IItemResponse<null>, IUpdateRequestInfo>({
      query: ({ id, ...body }) => ({
        url: `requests/${id}/me`,
        method: "PUT",
        body,
      }),
    }),

    deleteMyRequest: builder.mutation<IItemResponse<null>, string>({
      query: (id) => ({
        url: `requests/${id}/me`,
        method: "DELETE",
      }),
    }),

    shopGetRequest: builder.query<IItemResponse<IRequest>, string>({
      query: (id) => ({
        url: `requests/${id}/shop`,
        method: "GET",
      }),
    }),

    createRequest: builder.mutation<IItemResponse<IRequest>, ICreateRequest>({
      query: (body) => ({
        url: `requests/me`,
        method: "POST",
        body,
      }),
    }),

    getMyRequests: builder.query<IListResponse<IRequest>, IPagination>({
      query: ({ sort = "", filter = "", page = 1, size = 10 }) => ({
        url: `requests/me`,
        method: "GET",
        params: { sort, filter, page, size },
      }),
    }),

    shopGetRequests: builder.query<IListResponse<IRequest>, IPagination>({
      query: ({ sort = "", filter = "", page = 1, size = 10 }) => ({
        url: `requests/shop`,
        method: "GET",
        params: { sort, filter, page, size },
      }),
    }),
  }),
});

export const {
  useLazyGetMyRequestQuery,
  useUpdateMyRequestMutation,
  useDeleteMyRequestMutation,
  useLazyShopGetRequestQuery,
  useLazyGetMyRequestsQuery,
  useLazyShopGetRequestsQuery,
  useCreateRequestMutation,
} = requestApi;
