import { baseQueryWithRefresh } from "@/services/apis/base.query";
import { IIdentifyUser, IItemResponse } from "@/services/types";
import { createApi } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithRefresh,
  endpoints: (builder) => ({
    identify: builder.mutation<IItemResponse<null>, IIdentifyUser>({
      query: (body) => ({
        url: "users/identify",
        method: "PUT",
        body,
      }),
    }),
  }),
});

export const { useIdentifyMutation } = userApi;
