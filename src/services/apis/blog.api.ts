import { baseQueryWithRefresh } from "@/services/apis/base.query";
import {
  IBlog,
  ICreateBlog,
  IItemResponse,
  IListResponse,
  IPagination,
  IUpdateBlog,
} from "@/services/types";
import { createApi } from "@reduxjs/toolkit/query/react";

export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: baseQueryWithRefresh,
  endpoints: (builder) => ({
    /** GET /api/blogs (customer list) */
    getBlogs: builder.query<IListResponse<IBlog>, IPagination>({
      query: ({ sort = "", filter = "", page = 0, size = 10 }) => ({
        url: "blogs",
        method: "GET",
        params: { sort, filter, page, size },
      }),
    }),

    /** GET /api/blogs/{id} (customer view; only PUBLISHED) */
    getBlog: builder.query<IItemResponse<IBlog>, string>({
      query: (id) => ({
        url: `blogs/${id}`,
        method: "GET",
      }),
    }),

    /** GET /api/blogs/me (shop owner list) */
    getMyShopBlogs: builder.query<IListResponse<IBlog>, IPagination>({
      query: ({ sort = "", filter = "", page = 0, size = 10 }) => ({
        url: "blogs/me",
        method: "GET",
        params: { sort, filter, page, size },
      }),
    }),

    /** GET /api/blogs/{id}/me (shop owner view) */
    getMyShopBlog: builder.query<IItemResponse<IBlog>, string>({
      query: (id) => ({
        url: `blogs/${id}/me`,
        method: "GET",
      }),
    }),

    /** POST /api/blogs/me (shop owner create) */
    createMyShopBlog: builder.mutation<IItemResponse<IBlog>, ICreateBlog>({
      query: (body) => ({
        url: "blogs/me",
        method: "POST",
        body,
      }),
    }),

    /** PUT /api/blogs/{id}/me (shop owner update) – body must be CUBlogDto */
    updateMyShopBlog: builder.mutation<IItemResponse<IBlog>, IUpdateBlog>({
      query: ({ id, ...body }) => ({
        url: `blogs/${id}/me`,
        method: "PUT",
        body,
      }),
    }),

    /** DELETE /api/blogs/{id}/me (soft delete) */
    deleteMyShopBlog: builder.mutation<IItemResponse<null>, string>({
      query: (id) => ({
        url: `blogs/${id}/me`,
        method: "DELETE",
      }),
    }),

    /** PATCH /api/blogs/{id}/me (restore) */
    restoreMyShopBlog: builder.mutation<IItemResponse<null>, string>({
      query: (id) => ({
        url: `blogs/${id}/me`,
        method: "PATCH",
      }),
    }),

    /** PUT /api/blogs/{id}/verify (verify) – NO request body */
    verifyMyShopBlog: builder.mutation<IItemResponse<IBlog>, string>({
      query: (id) => ({
        url: `blogs/${id}/verify`,
        method: "PUT",
      }),
    }),
  }),
});

export const {
  useLazyGetBlogsQuery,
  useLazyGetBlogQuery,
  useLazyGetMyShopBlogsQuery,
  useLazyGetMyShopBlogQuery,
  useCreateMyShopBlogMutation,
  useUpdateMyShopBlogMutation,
  useDeleteMyShopBlogMutation,
  useRestoreMyShopBlogMutation,
  useVerifyMyShopBlogMutation,
} = blogApi;
