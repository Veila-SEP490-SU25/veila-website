import { baseQueryWithRefresh } from "@/services/apis/base.query";
import {
  IComplaint,
  IItemResponse,
  IListResponse,
  IPagination,
  IResponseComplaint,
  IUpdateComplaint,
} from "@/services/types";
import { createApi } from "@reduxjs/toolkit/query/react";

export const complaintApi = createApi({
  reducerPath: "complaintApi",
  baseQuery: baseQueryWithRefresh,
  endpoints: (builder) => ({
    getComplaintsStaff: builder.query<IListResponse<IComplaint>, IPagination>({
      query: ({ sort = "", filter = "", page = 0, size = 10 }) => ({
        url: "complaints/staff",
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
        url: `complaints/${id}/staff`,
        method: "GET",
      }),
    }),

    getMyComplaint: builder.query<IItemResponse<IComplaint>, string>({
      query: (id) => ({
        url: `complaints/${id}/me`,
        method: "GET",
      }),
    }),

    updateMyComplaint: builder.mutation<IItemResponse<null>, IUpdateComplaint>(
      {
        query: ({ id, ...body }) => ({
          url: `complaints/${id}`,
          method: "PUT",
          body,
        }),
      }
    ),

    responseComplaint: builder.mutation<
      IItemResponse<null>,
      IResponseComplaint
    >({
      query: ({ id, ...body }) => ({
        url: `complaints/${id}/review`,
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
  useResponseComplaintMutation
} = complaintApi;
