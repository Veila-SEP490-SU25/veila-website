import { baseQueryWithRefresh } from "@/services/apis/base.query";
import {
  IGetMyTransaction,
  IItemResponse,
  IListResponse,
  IPagination,
  ITransaction,
  IUpdateTransactionStatus,
} from "@/services/types";
import { createApi } from "@reduxjs/toolkit/query/react";

export const transactionApi = createApi({
  reducerPath: "transactionApi",
  baseQuery: baseQueryWithRefresh,
  endpoints: (builder) => ({
    getTransactions: builder.query<IListResponse<ITransaction>, IPagination>({
      query: ({ sort = "", filter = "", page = 0, size = 10 }) => ({
        url: "transactions",
        method: "GET",
        params: { sort, filter, page, size },
      }),
    }),

    getTransaction: builder.query<IItemResponse<ITransaction>, string>({
      query: (id) => ({
        url: `transactions/${id}`,
        method: "GET",
      }),
    }),

    updateTransactionStatus: builder.mutation<
      IItemResponse<ITransaction>,
      IUpdateTransactionStatus
    >({
      query: ({ id, status }) => ({
        url: `transactions/${id}/${status}`,
        method: "PUT",
      }),
    }),

    approveWithdraw: builder.mutation<IItemResponse<ITransaction>, string>({
      query: (id) => ({
        url: `transactions/${id}/approve-withdraw`,
        method: "PUT",
      }),
    }),

    cancelWithdraw: builder.mutation<IItemResponse<ITransaction>, string>({
      query: (id) => ({
        url: `transactions/${id}/cancel-withdraw`,
        method: "PUT",
      }),
    }),

    getMyTransactions: builder.query<
      IListResponse<ITransaction>,
      IGetMyTransaction
    >({
      query: ({ walletId, sort = "", filter = "", page = 0, size = 10 }) => ({
        url: `transactions/${walletId}/my-transaction`,
        method: "GET",
        params: { sort, filter, page, size },
      }),
    }),
  }),
});

export const {
  useLazyGetTransactionsQuery,
  useLazyGetTransactionQuery,
  useUpdateTransactionStatusMutation,
  useCancelWithdrawMutation,
  useApproveWithdrawMutation,
  useLazyGetMyTransactionsQuery,
} = transactionApi;
