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
  endpoints: (builders) => ({
    getCategory: builders.query<IItemResponse<ICategory>, string>({
      query: (id) => ({
        url: `categories/${id}`,
        method: "GET",
      }),
    }),

    getAccessoriesByCategory: builders.query<
      IListResponse<IAccessory>,
      ICategoryGetRequest
    >({
      query: ({ id, filter, page, size, sort }) => ({
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

    getBlogsByCategory: builders.query<
      IListResponse<IBlog>,
      ICategoryGetRequest
    >({
      query: ({ id, filter, page, size, sort }) => ({
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

    getDressesByCategory: builders.query<
      IListResponse<IDress>,
      ICategoryGetRequest
    >({
      query: ({ id, filter, page, size, sort }) => ({
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

    getServicesByCategory: builders.query<
      IListResponse<IService>,
      ICategoryGetRequest
    >({
      query: ({ id, filter, page, size, sort }) => ({
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

    getMyShopCategories: builders.query<IListResponse<ICategory>, IPagination>({
      query: ({ filter, page, size, sort }) => ({
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

    getMyShopCategory: builders.query<IItemResponse<ICategory>, string>({
      query: (id) => ({
        url: `categories/${id}/me`,
        method: "GET",
      }),
    }),

    createMyShopCategory: builders.mutation<
      IItemResponse<ICategory>,
      ICreateCategory
    >({
      query: (body) => ({
        url: `categories/me`,
        method: "POST",
        body,
      }),
    }),

    updateMyShopCategory: builders.mutation<
      IItemResponse<null>,
      IUpdateCategory
    >({
      query: (body) => ({
        url: `categories/me`,
        method: "PUT",
        body,
      }),
    }),

    deleteMyShopCategory: builders.mutation<IItemResponse<null>, string>({
      query: (id) => ({
        url: `categories/${id}/me`,
        method: "DELETE",
      }),
    }),

    restoreMyShopCategory: builders.mutation<IItemResponse<null>, string>({
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
