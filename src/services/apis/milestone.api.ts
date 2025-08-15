import { baseQueryWithRefresh } from "@/services/apis/base.query";
import {
  ICreateMilestone,
  IItemResponse,
  IListResponse,
  IMilestone,
  IRetiveMilestone,
  IRetriveTasks,
  ITask,
  IUpdateMilestoneInfo,
  IUpdateMilestoneStatus,
} from "@/services/types";
import { createApi } from "@reduxjs/toolkit/query/react";

export const milestoneApi = createApi({
  reducerPath: "milestoneApi",
  baseQuery: baseQueryWithRefresh,
  endpoints: (builder) => ({
    getMilestones: builder.query<IListResponse<IMilestone>, IRetiveMilestone>({
      query: (params) => ({
        url: `milestones`,
        method: "GET",
        params,
      }),
    }),

    createMilestone: builder.mutation<
      IItemResponse<IMilestone>,
      ICreateMilestone
    >({
      query: (body) => ({
        url: `milestones`,
        method: "POST",
        body,
      }),
    }),

    getMilestone: builder.query<IItemResponse<IMilestone>, string>({
      query: (id) => ({
        url: `milestones/${id}`,
        method: "GET",
      }),
    }),

    updateMilestoneInfo: builder.mutation<
      IItemResponse<IMilestone>,
      IUpdateMilestoneInfo
    >({
      query: ({ id, ...body }) => ({
        url: `milestones/${id}`,
        method: "PUT",
        body,
      }),
    }),

    updateMilestoneStatus: builder.mutation<
      IItemResponse<IMilestone>,
      IUpdateMilestoneStatus
    >({
      query: ({ id, status }) => ({
        url: `milestones/${id}/${status}`,
        method: "PUT",
      }),
    }),

    getMilestoneTasks: builder.query<IListResponse<ITask>, IRetriveTasks >({
      query: ({id, ...params}) => ({
        url:`milestones/${id}/tasks`,
        method: "GET",
        params
      })
    })
  }),
});

export const {
  useLazyGetMilestonesQuery,
  useCreateMilestoneMutation,
  useLazyGetMilestoneQuery,
  useUpdateMilestoneInfoMutation,
  useUpdateMilestoneStatusMutation,
  useLazyGetMilestoneTasksQuery
} = milestoneApi;
