import { baseQueryWithRefresh } from "@/services/apis/base.query";
import {
  IAccessory,
  IBlog,
  ICategory,
  ICategoryGetRequest,
  ICreateCategory,
  IDress,
  IItemResponse,
  IListResponse,
  IPagination,
  IService,
  IUpdateCategory,
} from "@/services/types";
import { createApi } from "@reduxjs/toolkit/query/react";

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: baseQueryWithRefresh,
  endpoints: (builder) => ({
    getCategory: builder.query<IItemResponse<ICategory>, string>({
      query: (id) => ({
        url: `categories/${id}`,
        method: "GET",
      }),
    }),

    getAccessoriesByCategory: builder.query<
      IListResponse<IAccessory>,
      ICategoryGetRequest
    >({
      query: ({ id, filter = "", page = 0, size = 10, sort = "" }) => ({
        url: `categories/${id}/accessories`,
        method: "GET",
        params: {
          filter,
          page,
          size,
          sort,
        },
      }),
    }),

    getBlogsByCategory: builder.query<
      IListResponse<IBlog>,
      ICategoryGetRequest
    >({
      query: ({ id, filter = "", page = 0, size = 10, sort = "" }) => ({
        url: `categories/${id}/blogs`,
        method: "GET",
        params: {
          filter,
          page,
          size,
          sort,
        },
      }),
    }),

    getDressesByCategory: builder.query<
      IListResponse<IDress>,
      ICategoryGetRequest
    >({
      query: ({ id, sort = "", filter = "", page = 0, size = 10 }) => ({
        url: `categories/${id}/dresses`,
        method: "GET",
        params: {
          filter,
          page,
          size,
          sort,
        },
      }),
    }),

    getServicesByCategory: builder.query<
      IListResponse<IService>,
      ICategoryGetRequest
    >({
      query: ({ id, sort = "", filter = "", page = 0, size = 10 }) => ({
        url: `categories/${id}/services`,
        method: "GET",
        params: {
          filter,
          page,
          size,
          sort,
        },
      }),
    }),

    getMyShopCategories: builder.query<IListResponse<ICategory>, IPagination>({
      query: ({ sort = "", filter = "", page = 0, size = 10 }) => ({
        url: `categories/me`,
        method: "GET",
        params: {
          filter,
          page,
          size,
          sort,
        },
      }),
    }),

    getMyShopCategory: builder.query<IItemResponse<ICategory>, string>({
      query: (id) => ({
        url: `categories/${id}/me`,
        method: "GET",
      }),
    }),

    createMyShopCategory: builder.mutation<
      IItemResponse<ICategory>,
      ICreateCategory
    >({
      query: (body) => ({
        url: `categories/me`,
        method: "POST",
        body,
      }),
    }),

    updateMyShopCategory: builder.mutation<
      IItemResponse<null>,
      IUpdateCategory
    >({
      query: (body) => ({
        url: `categories/me`,
        method: "PUT",
        body,
      }),
    }),

    deleteMyShopCategory: builder.mutation<IItemResponse<null>, string>({
      query: (id) => ({
        url: `categories/${id}/me`,
        method: "DELETE",
      }),
    }),

    restoreMyShopCategory: builder.mutation<IItemResponse<null>, string>({
      query: (id) => ({
        url: `categories/${id}/me`,
        method: "PATCH",
      }),
    }),
  }),
});

export const {
  useLazyGetCategoryQuery,
  useLazyGetAccessoriesByCategoryQuery,
  useLazyGetBlogsByCategoryQuery,
  useLazyGetDressesByCategoryQuery,
  useLazyGetServicesByCategoryQuery,
  useLazyGetMyShopCategoriesQuery,
  useLazyGetMyShopCategoryQuery,
  useCreateMyShopCategoryMutation,
  useUpdateMyShopCategoryMutation,
  useDeleteMyShopCategoryMutation,
  useRestoreMyShopCategoryMutation,
} = categoryApi;
