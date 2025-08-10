import { baseQueryWithRefresh } from "@/services/apis/base.query";
import { createApi } from "@reduxjs/toolkit/query/react";

export const requestApi = createApi({
  reducerPath: "requestApi",
  baseQuery: baseQueryWithRefresh,
  endpoints: (builder) => ({
    
  })
})

export const {} = requestApi;