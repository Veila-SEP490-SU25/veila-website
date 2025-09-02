import { baseQueryWithRefresh } from "@/services/apis/base.query";
import {
  ICreateRequest,
  ICreateUpdateRequest,
  IItemResponse,
  IListResponse,
  IPagination,
  IRequest,
  IUpdateRequest,
  IUpdateRequestInfo,
  UpdateRequestStatus,
} from "@/services/types";
import { createApi } from "@reduxjs/toolkit/query/react";

export interface IGetUpdateRequests extends IPagination {
  requestId: string;
}

export interface IGetUpdateRequest {
  requestId: string;
  updateRequestId: string;
}

export interface IApproveUpdateRequest extends IGetUpdateRequest {
  status: UpdateRequestStatus.ACCEPTED | UpdateRequestStatus.REJECTED;
  price: number;
}

export const requestApi = createApi({
  reducerPath: "requestApi",
  baseQuery: baseQueryWithRefresh,
  endpoints: (builder) => ({
    //Request
    shopGetRequests: builder.query<IListResponse<IRequest>, IPagination>({
      query: ({ sort = "", filter = "", page = 0, size = 10 }) => ({
        url: `requests`,
        method: "GET",
        params: { sort, filter, page, size },
      }),
    }),

    shopGetRequest: builder.query<IItemResponse<IRequest>, string>({
      query: (id) => ({
        url: `requests/${id}`,
        method: "GET",
      }),
    }),

    getMyRequest: builder.query<IItemResponse<IRequest>, string>({
      query: (id) => ({
        url: `requests/${id}/me`,
        method: "GET",
      }),
    }),

    getMyRequests: builder.query<IListResponse<IRequest>, IPagination>({
      query: ({ sort = "", filter = "", page = 0, size = 10 }) => ({
        url: `requests/me`,
        method: "GET",
        params: { sort, filter, page, size },
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

    createRequest: builder.mutation<IItemResponse<IRequest>, ICreateRequest>({
      query: (body) => ({
        url: `requests/me`,
        method: "POST",
        body,
      }),
    }),

    //Update Request
    getUpdateRequests: builder.query<
      IListResponse<IUpdateRequest>,
      IGetUpdateRequests
    >({
      query: ({ requestId, sort = "", filter = "", page = 0, size = 10 }) => ({
        url: `requests/${requestId}/updates`,
        method: "GET",
        params: { sort, filter, page, size },
      }),
    }),

    getUpdateRequest: builder.query<
      IItemResponse<IUpdateRequest>,
      IGetUpdateRequest
    >({
      query: ({ requestId, updateRequestId }) => ({
        url: `requests/${requestId}/updates/${updateRequestId}`,
        method: "GET",
      }),
    }),

    createUpdateRequest: builder.mutation<
      IItemResponse<IUpdateRequest>,
      ICreateUpdateRequest
    >({
      query: ({ id, ...body }) => ({
        url: `requests/${id}/updates`,
        method: "POST",
        body,
      }),
    }),

    deleteUpdateRequest: builder.mutation<
      IItemResponse<null>,
      IGetUpdateRequest
    >({
      query: ({ requestId, updateRequestId }) => ({
        url: `requests/${requestId}/updates/${updateRequestId}`,
        method: "DELETE",
      }),
    }),

    approveUpdateRequest: builder.mutation<
      IItemResponse<null>,
      IApproveUpdateRequest
    >({
      query: ({ requestId, updateRequestId, status, price }) => ({
        url: `requests/${requestId}/updates/${updateRequestId}`,
        method: "PUT",
        body: { status, price },
      }),
    }),
  }),
});

export const {
  useLazyShopGetRequestsQuery,
  useLazyShopGetRequestQuery,
  useLazyGetMyRequestQuery,
  useLazyGetMyRequestsQuery,
  useUpdateMyRequestMutation,
  useDeleteMyRequestMutation,
  useCreateRequestMutation,

  useDeleteUpdateRequestMutation,
  useApproveUpdateRequestMutation,
  useLazyGetUpdateRequestQuery,
  useLazyGetUpdateRequestsQuery,
  useCreateUpdateRequestMutation,
} = requestApi;
