import { baseQueryWithRefresh } from '@/services/apis/base.query';
import {
  ComplaintStatus,
  IAccessory,
  IComplaint,
  ICreateCustomOrder,
  ICreateOrder,
  IDress,
  IItemResponse,
  IListResponse,
  IMilestone,
  IOrder,
  IOrderAccessoryDetail,
  IOrderDressDetail,
  IOrderServiceDetail,
  IPagination,
  ITransaction,
  IUpdateOrderStatus,
  OrderStatus,
} from '@/services/types';
import { createApi } from '@reduxjs/toolkit/query/react';

export interface IUpdateOrderInformation {
  id: string;
  phone: string;
  email: string;
  address: string;
  dueDate: string;
  returnDate: string | null;
  price: number;
}

export interface IUpdayeOrderStatus {
  id: string;
  status: OrderStatus;
}

export interface IGetOrderDress {
  orderId: string;
  dressId: string;
}

export interface IGetOrderAccessory {
  orderId: string;
  accessoryId: string;
}

export interface IGetOrderComplaints extends IPagination {
  orderId: string;
}

export interface IGetOrderTransactions extends IPagination {
  orderId: string;
}

export interface ICreateComplaint {
  orderId: string;
  title: string;
  description: string;
  images: string;
  status: ComplaintStatus;
}

export interface ICheckoutOrder {
  orderId: string;
  otp: string;
}

export interface IGetOrderMilestone extends IPagination {
  orderId: string;
}

export interface IGetOrdersOfShop extends IPagination {
  shopId: string;
}

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: baseQueryWithRefresh,
  endpoints: (builder) => ({
    getShopIncome: builder.query<IItemResponse<number>, string>({
      query: (shopId) => ({
        url: `orders/shops/${shopId}/income`,
        method: 'GET',
      }),
    }),

    getOrders: builder.query<IListResponse<IOrder>, IPagination>({
      query: ({ filter = '', sort = '', page = 0, size = 10 }) => ({
        url: 'orders',
        method: 'GET',
        params: { filter, sort, page, size },
      }),
    }),

    getOrder: builder.query<IItemResponse<IOrder>, string>({
      query: (id) => ({
        url: `orders/${id}`,
        method: 'GET',
      }),
    }),

    createOrder: builder.mutation<IItemResponse<IOrder>, ICreateOrder>({
      query: (body) => ({
        url: 'orders',
        method: 'POST',
        body,
      }),
    }),

    createCustomOrder: builder.mutation<IItemResponse<IOrder>, ICreateCustomOrder>({
      query: (body) => ({
        url: 'orders/custom',
        method: 'POST',
        body,
      }),
    }),

    updateOrderInformation: builder.mutation<IItemResponse<IOrder>, IUpdateOrderInformation>({
      query: (body) => ({
        url: `orders/${body.id}`,
        method: 'PUT',
        body,
      }),
    }),

    updateOrderStatus: builder.mutation<IItemResponse<IOrder>, IUpdateOrderStatus>({
      query: ({ id, status }) => ({
        url: `orders/${id}/${status}`,
        method: 'PUT',
      }),
    }),

    cancelOrder: builder.mutation<IItemResponse<IOrder>, string>({
      query: (id) => ({
        url: `orders/${id}/cancel`,
        method: 'PUT',
      }),
    }),

    checkoutOrder: builder.mutation<IItemResponse<IOrder>, ICheckoutOrder>({
      query: ({ orderId, otp }) => ({
        url: `orders/${orderId}/check-out`,
        method: 'PUT',
        body: { otp },
      }),
    }),

    getOrderMilestone: builder.query<IListResponse<IMilestone>, IGetOrderMilestone>({
      query: ({ orderId, page = 0, size = 10, sort = '', filter = '' }) => ({
        url: `orders/${orderId}/milestones`,
        method: 'GET',
        params: { page, size, sort, filter },
      }),
    }),

    getOrderAccessories: builder.query<IListResponse<IOrderAccessoryDetail>, string>({
      query: (id) => ({
        url: `orders/${id}/order-accessories-details`,
        method: 'GET',
      }),
    }),

    getOrderAccessory: builder.query<IListResponse<IAccessory>, IGetOrderAccessory>({
      query: ({ orderId, accessoryId }) => ({
        url: `orders/${orderId}/order-accessories-details/${accessoryId}`,
        method: 'GET',
      }),
    }),

    getOrderDresses: builder.query<IListResponse<IOrderDressDetail>, string>({
      query: (id) => ({
        url: `orders/${id}/order-dress-details`,
        method: 'GET',
      }),
    }),

    getOrderDress: builder.query<IListResponse<IDress>, IGetOrderDress>({
      query: ({ orderId, dressId }) => ({
        url: `orders/${orderId}/order-dress-details/${dressId}`,
        method: 'GET',
      }),
    }),

    getOrderService: builder.query<IItemResponse<IOrderServiceDetail>, string>({
      query: (id) => ({
        url: `orders/${id}/order-service-details`,
        method: 'GET',
      }),
    }),

    getOrderTransactions: builder.query<IListResponse<ITransaction>, IGetOrderTransactions>({
      query: ({ orderId, page = 0, size = 10, sort = '', filter = '' }) => ({
        url: `orders/${orderId}/transactions`,
        method: 'GET',
        params: { page, size, sort, filter },
      }),
    }),

    getOrderComplaints: builder.query<IListResponse<IComplaint>, IGetOrderComplaints>({
      query: ({ orderId, page = 0, size = 10, sort = '', filter = '' }) => ({
        url: `orders/${orderId}/complaints/me`,
        method: 'GET',
        params: { page, size, sort, filter },
      }),
    }),

    createOrderComplaint: builder.mutation<IItemResponse<IComplaint>, ICreateComplaint>({
      query: ({ orderId, ...body }) => ({
        url: `orders/${orderId}/complaints/me`,
        method: 'POST',
        body,
      }),
    }),

    confirmNoComplaint: builder.mutation<IItemResponse<null>, string>({
      query: (orderId) => ({
        url: `orders/${orderId}/confirm-no-complaint`,
        method: 'PUT',
      }),
    }),

    getOrderOfShop: builder.query<IListResponse<IOrder>, IGetOrdersOfShop>({
      query: ({ shopId, sort = '', filter = '', page = 0, size = 10 }) => ({
        url: `orders/shops/${shopId}`,
        method: 'GET',
        params: { page, size, sort, filter },
      }),
    }),
  }),
});

export const {
  useLazyGetOrdersQuery,
  useLazyGetOrderQuery,
  useCreateOrderMutation,
  useCreateCustomOrderMutation,
  useUpdateOrderInformationMutation,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
  useCheckoutOrderMutation,
  useLazyGetOrderServiceQuery,
  useLazyGetOrderAccessoriesQuery,
  useLazyGetOrderAccessoryQuery,
  useLazyGetOrderDressQuery,
  useLazyGetOrderDressesQuery,
  useLazyGetOrderMilestoneQuery,
  useLazyGetOrderTransactionsQuery,
  useLazyGetOrderComplaintsQuery,
  useCreateOrderComplaintMutation,
  useConfirmNoComplaintMutation,
  useLazyGetOrderOfShopQuery,
  useLazyGetShopIncomeQuery,
} = orderApi;
