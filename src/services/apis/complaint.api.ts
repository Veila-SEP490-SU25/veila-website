import { baseQueryWithRefresh } from "@/services/apis/base.query";
import { IComplaint, IItemResponse, IListResponse, IPagination } from "@/services/types";
import { createApi } from "@reduxjs/toolkit/query/react";

export const complaintApi = createApi({
  reducerPath: "complaintApi",
  baseQuery: baseQueryWithRefresh,
  endpoints: (builders) => ({
    getComplaintsStaff: builders.query<IListResponse<IComplaint>, IPagination>({
      query: ({ sort = "", filter = "", page = 1, size = 10 }) => ({
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

    getComplaintStaff: builders.query<IItemResponse<IComplaint>, string>({
      query: (id) => ({
        url: `complaints/${id}/staff`,
        method: "GET",
      }),
    })
  }),
});


export const {
  useLazyGetComplaintsStaffQuery
} = complaintApi;