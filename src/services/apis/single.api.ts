import { baseQueryWithRefresh } from "@/services/apis/base.query";
import {
  ICreateSlide,
  IItemResponse,
  IListResponse,
  ISlide,
  IUpdateSlide,
} from "@/services/types";
import { createApi } from "@reduxjs/toolkit/query/react";

export const singleApi = createApi({
  reducerPath: "singleApi",
  baseQuery: baseQueryWithRefresh,
  endpoints: (builder) => ({
    getSlides: builder.query<IListResponse<ISlide>, void>({
      query: () => ({
        url: "singles/slides",
        method: "GET",
      }),
    }),

    getSlide: builder.query<IItemResponse<ISlide>, string>({
      query: (id) => ({
        url: `singles/slides/${id}`,
        method: "GET",
      }),
    }),

    createSlide: builder.mutation<IItemResponse<ISlide>, ICreateSlide>({
      query: (body) => ({
        url: "singles/slides",
        method: "POST",
        body,
      }),
    }),

    updateSlide: builder.mutation<IItemResponse<null>, IUpdateSlide>({
      query: ({ id, ...body }) => ({
        url: `singles/slides/${id}`,
        method: "PUT",
        body,
      }),
    }),

    deleteSlide: builder.mutation<IItemResponse<null>, string>({
      query: (id) => ({
        url: `singles/slides/${id}`,
        method: "DELETE",
      }),
    }),

    restoreSlide: builder.mutation<IItemResponse<null>, string>({
      query: (id) => ({
        url: `singles/slides/${id}`,
        method: "PATCH",
      }),
    }),
  }),
});

export const {
  useLazyGetSlideQuery,
  useLazyGetSlidesQuery,
  useCreateSlideMutation,
  useUpdateSlideMutation,
  useDeleteSlideMutation,
  useRestoreSlideMutation,
} = singleApi;
