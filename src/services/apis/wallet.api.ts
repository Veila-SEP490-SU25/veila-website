import { baseQueryWithRefresh } from "@/services/apis/base.query";
import { createApi } from "@reduxjs/toolkit/query/react";
import {
  IDeposit,
  IItemResponse,
  IListResponse,
  IPagination,
  IWallet,
  IWithdraw,
} from "@/services/types";

export const walletApi = createApi({
  reducerPath: "walletApi",
  baseQuery: baseQueryWithRefresh,
  endpoints: (builder) => ({
    getWallets: builder.query<IListResponse<IWallet>, IPagination>({
      query: ({ sort = "", filter = "", page = 0, size = 10 }) => ({
        url: "wallet",
        params: { sort, filter, page, size },
      }),
    }),

    deposit: builder.mutation<IItemResponse<IWallet>, IDeposit>({
      query: (body) => ({
        url: "wallets/deposit",
        method: "PUT",
        data: body,
      }),
    }),

    requestWithdraw: builder.mutation<IItemResponse<IWallet>, IWithdraw>({
      query: (body) => ({
        url: "wallets/withdraw-request",
        method: "PUT",
        data: body,
      }),
    }),

    getMyWallet: builder.query<IItemResponse<IWallet>, void>({
      query: () => ({
        url: "wallets/my-wallet",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useLazyGetWalletsQuery,
  useDepositMutation,
  useRequestWithdrawMutation,
  useLazyGetMyWalletQuery,
} = walletApi;
