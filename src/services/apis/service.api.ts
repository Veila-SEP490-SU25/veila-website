import { baseQueryWithRefresh } from "@/services/apis/base.query";
import {
  ICreateService,
  IItemResponse,
  IListResponse,
  IPagination,
  IService,
  IUpdateService,
} from "@/services/types";
import { createApi } from "@reduxjs/toolkit/query/react";

export const serviceApi = createApi({
  reducerPath: "serviceApi",
  baseQuery: baseQueryWithRefresh,
  endpoints: (builder) => ({
    getServices: builder.query<IListResponse<IService>, IPagination>({
      query: ({ sort = "", filter = "", page = 0, size = 10 }) => ({
        url: "services",
        method: "GET",
        params: { sort, filter, page, size },
      }),
    }),

    getService: builder.query<IItemResponse<IService>, string>({
      query: (id) => ({
        url: `services/${id}`,
        method: "GET",
      }),
    }),

    getMyShopService: builder.query<IListResponse<IService>, string>({
      query: (id) => ({
        url: `services/${id}/me`,
        method: "GET",
      }),
    }),

    getMyShopServices: builder.query<IListResponse<IService>, IPagination>({
      query: ({ sort = "", filter = "", page = 0, size = 10 }) => ({
        url: "services/my-shop",
        method: "GET",
        params: { sort, filter, page, size },
      }),
    }),

    createService: builder.mutation<IItemResponse<IService>, ICreateService>({
      query: (body) => ({
        url: "services/me",
        method: "POST",
        body,
      }),
    }),

    updateService: builder.mutation<IItemResponse<null>, IUpdateService>({
      query: ({ id, ...body }) => ({
        url: `services/${id}/me`,
        method: "PUT",
        body,
      }),
    }),

    deleteService: builder.mutation<IItemResponse<null>, string>({
      query: (id) => ({
        url: `services/${id}/me`,
        method: "DELETE",
      }),
    }),

    restoreService: builder.mutation<IItemResponse<null>, string>({
      query: (id) => ({
        url: `services/${id}/me`,
        method: "PATCH",
      }),
    }),
  }),
});

export const {
  useLazyGetServiceQuery,
  useLazyGetServicesQuery,
  useLazyGetMyShopServiceQuery,
  useLazyGetMyShopServicesQuery,
  useCreateServiceMutation,
  useDeleteServiceMutation,
  useUpdateServiceMutation,
  useRestoreServiceMutation,
} = serviceApi;
