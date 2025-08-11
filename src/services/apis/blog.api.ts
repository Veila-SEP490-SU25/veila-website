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
    getBlogs: builder.query<IListResponse<IBlog>, IPagination>({
      query: ({ sort = "", filter = "", page = 0, size = 10 }) => ({
        url: "blogs",
        method: "GET",
        params: { sort, filter, page, size },
      }),
    }),

    getBlog: builder.query<IItemResponse<IBlog>, string>({
      query: (id) => ({
        url: `blogs/${id}`,
        method: "GET",
      }),
    }),

    getMyShopBlogs: builder.query<IListResponse<IBlog>, IPagination>({
      query: ({ sort = "", filter = "", page = 0, size = 10 }) => ({
        url: "blogs/me",
        method: "GET",
        params: { sort, filter, page, size },
      }),
    }),

    getMyShopBlog: builder.query<IItemResponse<IBlog>, string>({
      query: (id) => ({
        url: `blogs/${id}/me`,
        method: "GET",
      }),
    }),

    updateMyShopBlog: builder.mutation<IItemResponse<null>, IUpdateBlog>({
      query: (body) => {
        const { id, ...bodyNoId } = body;
        return {
          url: `blogs/${id}/me`,
          method: "PUT",
          body: bodyNoId,
        };
      },
    }),

    deleteMyShopBlog: builder.mutation<IItemResponse<null>, string>({
      query: (id) => ({
        url: `blogs/${id}/me`,
        method: "DELETE",
      }),
    }),

    restoreMyShopBlog: builder.mutation<IItemResponse<null>, string>({
      query: (id) => ({
        url: `blogs/${id}/me`,
        method: "PATCH",
      }),
    }),

    createMyShopBlog: builder.mutation<IItemResponse<IBlog>, ICreateBlog>({
      query: (body) => ({
        url: `blogs/me`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useLazyGetBlogsQuery,
  useLazyGetBlogQuery,
  useLazyGetMyShopBlogsQuery,
  useLazyGetMyShopBlogQuery,
  useUpdateMyShopBlogMutation,
  useDeleteMyShopBlogMutation,
  useCreateMyShopBlogMutation,
} = blogApi;
