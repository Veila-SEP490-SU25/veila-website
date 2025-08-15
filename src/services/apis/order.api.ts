import { baseQueryWithRefresh } from "@/services/apis/base.query";
import {
  IComplaint,
  ICreateComplaint,
  ICreateCustomOrder,
  ICreateOrder,
  IGetComplaints,
  IItemResponse,
  IListResponse,
  IOrder,
  IOrderDressDetail,
  IPagination,
  IUpdateOrderInfo,
  IUpdateOrderStatus,
} from "@/services/types";
import { createApi } from "@reduxjs/toolkit/query/react";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: baseQueryWithRefresh,
  endpoints: (builder) => ({
    getOrders: builder.query<IListResponse<IOrder>, IPagination>({
      query: ({ sort = "", filter = "", page = 0, size = 10 }) => ({
        url: `orders`,
        method: "GET",
        params: {
          sort,
          filter,
          page,
          size,
        },
      }),
    }),

    createOrder: builder.mutation<IItemResponse<IOrder>, ICreateOrder>({
      query: (body) => ({
        url: "orders",
        method: "POST",
        body,
      }),
    }),

    getOrder: builder.query<IItemResponse<IOrder>, string>({
      query: (id) => ({
        url: `orders/${id}`,
        method: "GET",
      }),
    }),

    updateOrderInfo: builder.mutation<IItemResponse<IOrder>, IUpdateOrderInfo>({
      query: ({ id, ...body }) => ({
        url: `orders/${id}`,
        method: "PUT",
        body,
      }),
    }),

    getMyOrderComplaints: builder.query<
      IListResponse<IComplaint>,
      IGetComplaints
    >({
      query: ({ id, filter = "", page = 0, size = 10, sort = "" }) => ({
        url: `orders/${id}/complaints/me`,
        method: "GET",
        params: {
          filter,
          page,
          size,
          sort,
        },
      }),
    }),

    createOrderComplaint: builder.mutation<
      IItemResponse<IComplaint>,
      ICreateComplaint
    >({
      query: ({ id, ...body }) => ({
        url: `orders/${id}/complaints/me`,
        method: "POST",
        body,
      }),
    }),

    updateOrderStatus: builder.mutation<
      IItemResponse<IOrder>,
      IUpdateOrderStatus
    >({
      query: ({ id, status }) => ({
        url: `orders/${id}/${status}`,
        method: "PUT",
      }),
    }),

    getCustomerOrders: builder.query<IListResponse<IOrder>, IPagination>({
      query: ({ sort = "", filter = "", page = 0, size = 10 }) => ({
        url: `orders/customer`,
        method: "GET",
        params: {
          sort,
          filter,
          page,
          size,
        },
      }),
    }),

    getShopOrders: builder.query<IListResponse<IOrder>, IPagination>({
      query: ({ sort = "", filter = "", page = 0, size = 10 }) => ({
        url: `orders/shop`,
        method: "GET",
        params: {
          sort,
          filter,
          page,
          size,
        },
      }),
    }),

    getOrderDressDetail: builder.query<
      IListResponse<IOrderDressDetail>,
      string
    >({
      query: (id) => ({
        url: `orders/${id}/order-dress-details`,
        method: "GET",
      }),
    }),

    checkoutOrder: builder.mutation<IItemResponse<IOrder>, string>({
      query: (id) => ({
        url: `orders/${id}/check-out`,
        method: "PUT",
      }),
    }),

    createCustomOrder: builder.mutation<IItemResponse<IOrder>, ICreateCustomOrder>({
      query: (body) => ({
        url: `orders/custom`,
        method: "POST",
        body,
      }),
    })
  }),
});

export const {
  useLazyGetOrdersQuery,
  useCreateOrderMutation,
  useLazyGetOrderQuery,
  useUpdateOrderStatusMutation,
  useLazyGetCustomerOrdersQuery,
  useLazyGetMyOrderComplaintsQuery,
  useLazyGetShopOrdersQuery,
  useCreateOrderComplaintMutation,
  useLazyGetOrderDressDetailQuery,
  useCheckoutOrderMutation,
  useCreateCustomOrderMutation
} = orderApi;
