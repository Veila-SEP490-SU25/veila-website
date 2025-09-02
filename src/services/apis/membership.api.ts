import { baseQueryWithRefresh } from "@/services/apis/base.query";
import { IItemResponse, IMembership, IListResponse } from "@/services/types";
import { IMembershipResponse } from "@/services/types/membership.type";
import { createApi } from "@reduxjs/toolkit/query/react";

export interface IRegisterMembership {
  subscriptionId: string;
  force: boolean;
  otp: string;
}

export interface ICancelMembership {
  subscriptionId: string;
  force: boolean;
  otp: string;
}

export const membershipApi = createApi({
  reducerPath: "membershipApi",
  baseQuery: baseQueryWithRefresh,
  endpoints: (builder) => ({
    registerMembership: builder.mutation<
      IItemResponse<IMembership>,
      IRegisterMembership
    >({
      query: (body) => ({
        url: "/memberships/register",
        method: "POST",
        body,
      }),
    }),

    cancelMembership: builder.mutation<IItemResponse<IMembership>, void>({
      query: () => ({
        url: "/memberships/cancel",
        method: "PUT",
      }),
    }),

    // Lấy thông tin membership của user
    getMyMemberships: builder.query<IItemResponse<IMembership>, void>({
      query: () => ({
        url: "memberships/me",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useRegisterMembershipMutation,
  useCancelMembershipMutation,
  useGetMyMembershipsQuery,
} = membershipApi;
