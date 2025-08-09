import { baseQueryWithRefresh } from "@/services/apis/base.query";
import {
  ICreateMilestone,
  IItemResponse,
  IListResponse,
  IMilestone,
  IRetiveMilestone,
  IUpdateMilestoneInfo,
  IUpdateMilestoneStatus,
} from "@/services/types";
import { createApi } from "@reduxjs/toolkit/query/react";

export const milestoneApi = createApi({
  reducerPath: "milestoneApi",
  baseQuery: baseQueryWithRefresh,
  endpoints: (builders) => ({
    getMilestones: builders.query<IListResponse<IMilestone>, IRetiveMilestone>({
      query: (params) => ({
        url: `milestones`,
        method: "GET",
        params,
      }),
    }),

    createMilestone: builders.mutation<
      IItemResponse<IMilestone>,
      ICreateMilestone
    >({
      query: (body) => ({
        url: `milestones`,
        method: "POST",
        body,
      }),
    }),

    getMilestone: builders.query<IItemResponse<IMilestone>, string>({
      query: (id) => ({
        url: `milestones/${id}`,
        method: "GET",
      }),
    }),

    updateMilestoneInfo: builders.mutation<
      IItemResponse<IMilestone>,
      IUpdateMilestoneInfo
    >({
      query: ({ id, ...body }) => ({
        url: `milestones/${id}`,
        method: "PUT",
        body,
      }),
    }),

    updateMilestoneStatus: builders.mutation<
      IItemResponse<IMilestone>,
      IUpdateMilestoneStatus
    >({
      query: ({ id, status }) => ({
        url: `milestones/${id}/${status}`,
        method: "PUT",
      }),
    }),
  }),
});

export const {
  useLazyGetMilestonesQuery,
  useCreateMilestoneMutation,
  useLazyGetMilestoneQuery,
  useUpdateMilestoneInfoMutation,
  useUpdateMilestoneStatusMutation,
} = milestoneApi;
