import { baseQueryWithRefresh } from "@/services/apis/base.query";
import {
  ICreateCustomOrder,
  ICreateOrder,
  IItemResponse,
  IListResponse,
  IOrder,
  IPagination,
} from "@/services/types";
import { createApi } from "@reduxjs/toolkit/query/react";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: baseQueryWithRefresh,
  endpoints: (builder) => ({
    // Get Orders
    getOrders: builder.query<IListResponse<IOrder>, IPagination>({
      query: ({ filter = "", sort = "", page = 0, size = 10 }) => ({
        url: "orders",
        method: "GET",
        params: { filter, sort, page, size },
      }),
    }),

    getOrder: builder.query<IItemResponse<IOrder>, string>({
      query: (id) => ({
        url: `orders/${id}`,
        method: "GET",
      }),
    }),

    //Create Order
    createOrder: builder.mutation<IItemResponse<IOrder>, ICreateOrder>({
      query: (body) => ({
        url: "orders",
        method: "POST",
        body,
      }),
    }),

    createCustomOrder: builder.mutation<IItemResponse<IOrder>, ICreateCustomOrder>({
      query: (body) => ({
        url: "orders/custom",
        method: "POST",
        body,
      }), 
    })
  }),
});

export const {
  useLazyGetOrdersQuery,
  useLazyGetOrderQuery,
  useCreateOrderMutation,
  useCreateCustomOrderMutation,
} = orderApi;
