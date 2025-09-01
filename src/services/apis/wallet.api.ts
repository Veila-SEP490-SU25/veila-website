import { baseQueryWithRefresh } from "@/services/apis/base.query";
import { createApi } from "@reduxjs/toolkit/query/react";
import {
  IDeposit,
  IItemResponse,
  IListResponse,
  IPagination,
  ITransfer,
  IUpdateWalletPIN,
  IWallet,
  IWithdraw,
  TransactionStatus,
} from "@/services/types";

export interface IUpdateBankInfo {
  bin: string;
  bankNumber: string;
}

export interface IWebhookPayload {
  transactionId: string;
  status: TransactionStatus;
}

export const walletApi = createApi({
  reducerPath: "walletApi",
  baseQuery: baseQueryWithRefresh,
  endpoints: (builder) => ({
    getWallets: builder.query<IListResponse<IWallet>, IPagination>({
      query: ({ sort = "", filter = "", page = 0, size = 10 }) => ({
        url: "wallets",
        params: { sort, filter, page, size },
      }),
    }),

    getWallet: builder.query<IItemResponse<IWallet>, string>({
      query: (id) => ({
        url: `wallets/${id}`,
        method: "GET",
      }),
    }),

    updateWalletPIN: builder.mutation<IItemResponse<IWallet>, IUpdateWalletPIN>(
      {
        query: (body) => ({
          url: "wallets/my-wallet/update-pin",
          method: "PUT",
          body,
        }),
      }
    ),

    createWalletPIN: builder.mutation<IItemResponse<IWallet>, string>({
      query: (pin) => ({
        url: "wallets/my-wallet/create-pin",
        method: "PUT",
        body: { pin },
      }),
    }),

    updateBankInfo: builder.mutation<IItemResponse<IWallet>, IUpdateBankInfo>({
      query: (body) => ({
        url: "wallets/update-bank-information",
        method: "PUT",
        body,
      }),
    }),

    requestSmartOtp: builder.mutation<IItemResponse<string>, string>({
      query: (pin) => ({
        url: "wallets/request-smart-otp",
        method: "POST",
        body: { pin },
      }),
    }),

    deposit: builder.mutation<IItemResponse<ITransfer>, IDeposit>({
      query: (body) => ({
        url: "wallets/deposit",
        method: "PUT",
        body: body,
      }),
    }),

    requestWithdraw: builder.mutation<IItemResponse<IWallet>, IWithdraw>({
      query: (body) => ({
        url: "wallets/withdraw-request",
        method: "PUT",
        body,
      }),
    }),

    getMyWallet: builder.query<IItemResponse<IWallet>, void>({
      query: () => ({
        url: "wallets/my-wallet",
        method: "GET",
      }),
    }),

    postWebhook: builder.mutation<IItemResponse<null>, IWebhookPayload>({
      query: (body) => ({
        url: "wallets/payment/webhook",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useLazyGetWalletsQuery,
  useDepositMutation,
  useRequestWithdrawMutation,
  useLazyGetMyWalletQuery,
  useRequestSmartOtpMutation,
  useUpdateBankInfoMutation,
  useUpdateWalletPINMutation,
  useCreateWalletPINMutation,
  usePostWebhookMutation,
} = walletApi;
