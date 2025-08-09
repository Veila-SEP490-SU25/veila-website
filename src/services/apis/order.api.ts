import { baseQueryWithRefresh } from "@/services/apis/base.query";
import { createApi } from "@reduxjs/toolkit/query/react";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: baseQueryWithRefresh,
  endpoints: (builders) => ({
    
  }),
});

export const {} = orderApi;
