import { baseQueryWithRefresh } from "@/services/apis/base.query";
import {
  IAccessory,
  ICreateAccessory,
  IItemResponse,
  IListResponse,
  IPagination,
  IUpdateAccessory,
} from "@/services/types";
import { createApi } from "@reduxjs/toolkit/query/react";

export const accessoryApi = createApi({
  reducerPath: "accessoryApi",
  baseQuery: baseQueryWithRefresh,
  endpoints: (builders) => ({
    getAccessory: builders.query<IItemResponse<IAccessory>, string>({
      query: (id) => ({
        url: `accessories/${id}`,
        method: "GET",
      }),
    }),

    getMyShopAccessory: builders.query<IItemResponse<IAccessory>, string>({
      query: (id) => ({
        url: `accessories/${id}/me`,
        method: "GET",
      }),
    }),

    getMyShopAccessories: builders.query<
      IListResponse<IAccessory>,
      IPagination
    >({
      query: ({ sort = "", filter = "", page = 1, size = 10 }) => {
        const params = new URLSearchParams();
        if (sort) params.append("sort", sort);
        if (filter) params.append("filter", filter);
        if (page) params.append("page", page.toString());
        if (size) params.append("size", size.toString());
        return {
          url: `accessories/me`,
          method: "GET",
          params,
        };
      },
    }),

    updateAccessory: builders.mutation<IItemResponse<null>, IUpdateAccessory>({
      query: (body) => {
        const { id, ...bodyWithoutId } = body;
        return {
          url: `accessories/${id}/me`,
          method: "PUT",
          body: bodyWithoutId,
        };
      },
    }),

    deleteAccessory: builders.mutation<IItemResponse<null>, string>({
      query: (id) => ({
        url: `accessories/${id}/me`,
        method: "DELETE",
      }),
    }),

    restoreAccessory: builders.mutation<IItemResponse<null>, string>({
      query: (id) => ({
        url: `accessories/${id}/me`,
        method: "PATCH",
      }),
    }),

    createAccessory: builders.mutation<IItemResponse<null>, ICreateAccessory>({
      query: (body) => ({
        url: `accessories/me`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useLazyGetAccessoryQuery,
  useLazyGetMyShopAccessoryQuery,
  useLazyGetMyShopAccessoriesQuery,
  useUpdateAccessoryMutation,
  useDeleteAccessoryMutation,
  useRestoreAccessoryMutation,
  useCreateAccessoryMutation,
} = accessoryApi;
