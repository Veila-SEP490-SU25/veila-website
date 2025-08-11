import { baseQueryWithRefresh } from "@/services/apis/base.query";
import {
  ICreateSubscription,
  IItemResponse,
  IListResponse,
  IPagination,
  ISubscription,
  IUpdateSubscription,
} from "@/services/types";
import { createApi } from "@reduxjs/toolkit/query/react";

export const subscriptionApi = createApi({
  reducerPath: "subscriptionApi",
  baseQuery: baseQueryWithRefresh,
  endpoints: (builder) => ({
    getSubscriptions: builder.query<IListResponse<ISubscription>, IPagination>({
      query: ({ sort = "", filter = "", page = 1, size = 10 }) => ({
        url: "subscriptions",
        method: "GET",
        params: { sort, filter, page, size },
      }),
    }),

    getSubscription: builder.query<IItemResponse<ISubscription>, string>({
      query: (id) => ({
        url: `subscriptions/${id}`,
        method: "GET",
      }),
    }),

    staffGetSubscription: builder.query<IItemResponse<ISubscription>, string>({
      query: (id) => ({
        url: `subscriptions/${id}/staff`,
        method: "GET",
      }),
    }),

    staffGetSubscriptions: builder.query<
      IListResponse<ISubscription>,
      IPagination
    >({
      query: ({ sort = "", filter = "", page = 1, size = 10 }) => ({
        url: "subscriptions/staff",
        method: "GET",
        params: { sort, filter, page, size },
      }),
    }),

    staffCreateSubscription: builder.mutation<
      IItemResponse<ISubscription>,
      ICreateSubscription
    >({
      query: (body) => ({
        url: "subscriptions/staff",
        method: "POST",
        body,
      }),
    }),

    staffUpdateSubscription: builder.mutation<
      IItemResponse<ISubscription>,
      IUpdateSubscription
    >({
      query: ({ id, ...body }) => ({
        url: `subscriptions/${id}/staff`,
        method: "PUT",
        body,
      }),
    }),

    staffDeleteSubscription: builder.mutation<
      IItemResponse<ISubscription>,
      string
    >({
      query: (id) => ({
        url: `subscriptions/${id}/staff`,
        method: "DELETE",
      }),
    }),

    staffRestoreSubscription: builder.mutation<
      IItemResponse<ISubscription>,
      string
    >({
      query: (id) => ({
        url: `subscriptions/${id}/staff`,
        method: "PATCH",
      }),
    }),
  }),
});

export const {
  useLazyGetSubscriptionQuery,
  useLazyGetSubscriptionsQuery,
  useStaffCreateSubscriptionMutation,
  useStaffDeleteSubscriptionMutation,
  useStaffUpdateSubscriptionMutation,
  useStaffRestoreSubscriptionMutation,
} = subscriptionApi;
