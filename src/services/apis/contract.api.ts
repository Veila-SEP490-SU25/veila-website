import { baseQueryWithRefresh } from "@/services/apis/base.query";
import { IContract, IItemResponse } from "@/services/types";
import { createApi } from "@reduxjs/toolkit/query/react";

export const contractApi = createApi({
  reducerPath: "contractApi",
  baseQuery: baseQueryWithRefresh,
  endpoints: (builder) => ({
    getShopContract: builder.query<IItemResponse<IContract>, void>({
      query: () => ({
        url: `contracts/shop`,
        method: "GET",
      }),
    }),

    getCustomerContract: builder.query<IItemResponse<IContract>, void>({
      query: () => ({
        url: `contracts/customer`,
        method: "GET",
      }),
    }),
  }),
});

export const { useLazyGetCustomerContractQuery, useLazyGetShopContractQuery } =
  contractApi;
