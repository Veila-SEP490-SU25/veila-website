import { baseQueryWithRefresh } from "@/services/apis/base.query";
import { createApi } from "@reduxjs/toolkit/query/react";

export const membershipApi = createApi({
  reducerPath: "membershipApi",
  baseQuery: baseQueryWithRefresh,
  endpoints: (builder) => ({

  })
})

export const {} = membershipApi;