import { baseQueryWithRefresh } from "@/services/apis/base.query";
import {
  IBlog,
  ICreateBlog,
  IUpdateBlog,
  IItemResponse,
  IListResponse,
  IPagination,
} from "@/services/types";
import { createApi } from "@reduxjs/toolkit/query/react";

export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: ["Blog"],
  endpoints: (builder) => ({
    // Lấy danh sách blog của shop (cho shop owner)
    getMyShopBlogs: builder.query<IListResponse<IBlog>, IPagination>({
      query: ({ filter = "", page = 0, size = 10, sort = "" }) => ({
        url: "blogs/me",
        method: "GET",
        params: { filter, page, size, sort },
      }),
      providesTags: ["Blog"],
    }),

    // Lấy chi tiết blog của shop (cho shop owner)
    getBlogById: builder.query<IItemResponse<IBlog>, string>({
      query: (id) => ({
        url: `blogs/${id}/me`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Blog", id }],
    }),

    // Tạo blog mới (cho shop owner)
    createBlog: builder.mutation<IItemResponse<IBlog>, ICreateBlog>({
      query: (data) => ({
        url: "blogs/me",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Blog"],
    }),

    // Cập nhật blog (cho shop owner)
    updateBlog: builder.mutation<
      IItemResponse<IBlog>,
      { id: string; data: IUpdateBlog }
    >({
      query: ({ id, data }) => ({
        url: `blogs/${id}/me`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Blog", id },
        "Blog",
      ],
    }),

    // Xóa blog (cho shop owner)
    deleteBlog: builder.mutation<IItemResponse<null>, string>({
      query: (id) => ({
        url: `blogs/${id}/me`,
        method: "DELETE",
      }),
      invalidatesTags: ["Blog"],
    }),

    // Lấy danh sách blog public (cho customer)
    getPublicBlogs: builder.query<IListResponse<IBlog>, IPagination>({
      query: ({ filter = "", page = 0, size = 10, sort = "" }) => ({
        url: "blogs",
        method: "GET",
        params: { filter, page, size, sort },
      }),
      providesTags: ["Blog"],
    }),

    // Lấy chi tiết blog public (cho customer)
    getPublicBlogById: builder.query<IItemResponse<IBlog>, string>({
      query: (id) => ({
        url: `blogs/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Blog", id }],
    }),
  }),
});

export const {
  useLazyGetMyShopBlogsQuery,
  useLazyGetBlogByIdQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useLazyGetPublicBlogsQuery,
  useLazyGetPublicBlogByIdQuery,
} = blogApi;
