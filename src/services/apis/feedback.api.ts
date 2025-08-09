import { baseQueryWithRefresh } from "@/services/apis/base.query";
import { ICreateFeedback, IFeedback, IItemResponse } from "@/services/types";
import { createApi } from "@reduxjs/toolkit/query/react";

export const feedbackApi = createApi({
  reducerPath: "feedbackApi",
  baseQuery: baseQueryWithRefresh,
  endpoints: (builders) => ({
    createFeedback: builders.mutation<
      IItemResponse<IFeedback>,
      ICreateFeedback
    >({
      query: (body) => ({
        url: "feedbacks/me",
        method: "POST",
        body,
      }),
    }),

    getFeedback: builders.query<IItemResponse<IFeedback>, string>({
      query: (id) => ({
        url: `feedbacks/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateFeedbackMutation,
  useGetFeedbackQuery,
} = feedbackApi;
