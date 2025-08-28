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
      query: ({ sort = "", filter = "", page = 0, size = 10 }) => ({
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

    createSubscription: builder.mutation<
      IItemResponse<ISubscription>,
      ICreateSubscription
    >({
      query: (body) => ({
        url: "subscriptions",
        method: "POST",
        body,
      }),
    }),

    updateSubscription: builder.mutation<
      IItemResponse<ISubscription>,
      IUpdateSubscription
    >({
      query: ({ id, ...body }) => ({
        url: `subscriptions/${id}`,
        method: "PUT",
        body,
      }),
    }),

    deleteSubscription: builder.mutation<IItemResponse<ISubscription>, string>({
      query: (id) => ({
        url: `subscriptions/${id}`,
        method: "DELETE",
      }),
    }),

    restoreSubscription: builder.mutation<IItemResponse<ISubscription>, string>(
      {
        query: (id) => ({
          url: `subscriptions/${id}`,
          method: "PATCH",
        }),
      }
    ),
  }),
});

export const {
  useLazyGetSubscriptionQuery,
  useLazyGetSubscriptionsQuery,
  useCreateSubscriptionMutation,
  useDeleteSubscriptionMutation,
  useUpdateSubscriptionMutation,
  useRestoreSubscriptionMutation,
} = subscriptionApi;
