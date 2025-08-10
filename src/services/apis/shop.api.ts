import { baseQueryWithRefresh } from "@/services/apis/base.query";
import { createApi } from "@reduxjs/toolkit/query/react";

export const shopApi = createApi({
  reducerPath: "shopApi",
  baseQuery: baseQueryWithRefresh,
  endpoints: (builder) => ({

  }),
});

export const {} = shopApi;
