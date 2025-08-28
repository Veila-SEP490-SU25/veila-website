import { baseQueryWithRefresh } from "@/services/apis/base.query";
import { IItemResponse, IMembership } from "@/services/types";
import { createApi } from "@reduxjs/toolkit/query/react";

export interface IRegisterMembership {
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
        url: "/membership/register",
        method: "POST",
        body,
      }),
    }),

    cancelMembership: builder.mutation<IItemResponse<IMembership>, void>({
      query: () => ({
        url: "/membership/cancel",
        method: "PUT",
      }),
    }),
  }),
});

export const { useRegisterMembershipMutation, useCancelMembershipMutation } =
  membershipApi;
