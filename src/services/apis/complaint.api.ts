import { baseQueryWithRefresh } from "@/services/apis/base.query";
import {
  IComplaint,
  IItemResponse,
  IListResponse,
  IPagination,
  IResponseComplaint,
  IUpdateComplaint,
  IComplaintReason,
  ICreateComplaint,
} from "@/services/types";
import { createApi } from "@reduxjs/toolkit/query/react";

export const complaintApi = createApi({
  reducerPath: "complaintApi",
  baseQuery: baseQueryWithRefresh,
  endpoints: (builder) => ({
    getComplaintsStaff: builder.query<IListResponse<IComplaint>, IPagination>({
      query: ({ sort = "", filter = "", page = 0, size = 10 }) => ({
        url: "complaints",
        method: "GET",
        params: {
          sort,
          filter,
          page,
          size,
        },
      }),
    }),

    getComplaintStaff: builder.query<IItemResponse<IComplaint>, string>({
      query: (id) => ({
        url: `complaints/${id}`,
        method: "GET",
      }),
    }),

    getMyComplaint: builder.query<IItemResponse<IComplaint>, string>({
      query: (id) => ({
        url: `complaints/${id}/me`,
        method: "GET",
      }),
    }),

    updateMyComplaint: builder.mutation<IItemResponse<null>, IUpdateComplaint>({
      query: ({ id, ...body }) => ({
        url: `complaints/${id}`,
        method: "PUT",
        body,
      }),
    }),

    responseComplaint: builder.mutation<
      IItemResponse<null>,
      IResponseComplaint
    >({
      query: ({ id, ...body }) => ({
        url: `complaints/${id}/review`,
        method: "PUT",
        body,
      }),
    }),

    // Lấy danh sách complaint reasons cho SHOP
    getComplaintReasons: builder.query<IListResponse<IComplaintReason>, void>({
      query: () => ({
        url: "complaints/reasons",
        method: "GET",
        params: {
          type: "SHOP",
        },
      }),
    }),

    // Lấy danh sách complaint reasons cho CUSTOMER
    getComplaintReasonsCustomer: builder.query<
      IListResponse<IComplaintReason>,
      void
    >({
      query: () => ({
        url: "complaints/reasons",
        method: "GET",
        params: {
          type: "CUSTOMER",
        },
      }),
    }),

    // Tạo complaint mới cho order
    createComplaint: builder.mutation<IItemResponse<any>, ICreateComplaint>({
      query: ({ orderId, ...body }) => ({
        url: `orders/${orderId}/complaints/me`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useLazyGetComplaintsStaffQuery,
  useLazyGetMyComplaintQuery,
  useLazyGetComplaintStaffQuery,
  useUpdateMyComplaintMutation,
  useResponseComplaintMutation,
  useGetComplaintReasonsQuery,
  useGetComplaintReasonsCustomerQuery,
  useCreateComplaintMutation,
} = complaintApi;
