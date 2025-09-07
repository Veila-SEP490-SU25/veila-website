import { baseQueryWithRefresh } from '@/services/apis/base.query';
import { IItemResponse, IListResponse, IMilestone, ITask } from '@/services/types';
import { createApi } from '@reduxjs/toolkit/query/react';

/**
 * Request interfaces
 */
export interface IGetMilestonesParams {
  page?: number;
  size?: number;
  sort?: string;
  filter?: string;
}

export interface ICreateMilestone {
  name: string;
  description?: string | null;
  dueDate: string; // ISO 8601
}

export interface IUpdateMilestoneInfo {
  id: string;
  dueDate: string; // ISO 8601
}

export interface IUpdateMilestoneStatus {
  id: string;
  status: string; // e.g., "IN_PROGRESS", "COMPLETED"
}

export interface IGetMilestoneTasksParams {
  id: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface ICreateTask {
  milestoneId: string;
  title: string;
  description?: string | null;
  dueDate: string; // ISO 8601
}

export interface IUpdateTask {
  milestoneId: string;
  taskId: string;
  title?: string;
  description?: string | null;
  dueDate?: string; // ISO 8601
  status?: string; // e.g., "PENDING", "CANCELLED", "COMPLETED"
}

export interface ITaskAction {
  milestoneId: string;
  taskId: string;
}

export const milestoneApi = createApi({
  reducerPath: 'milestoneApi',
  baseQuery: baseQueryWithRefresh,
  endpoints: (builder) => ({
    // ---- Milestone ----
    getMilestones: builder.query<IListResponse<IMilestone>, IGetMilestonesParams>({
      query: (params) => ({
        url: `milestones`,
        method: 'GET',
        params,
      }),
    }),

    getMilestone: builder.query<IItemResponse<IMilestone>, string>({
      query: (id) => ({
        url: `milestones/${id}`,
        method: 'GET',
      }),
    }),

    createMilestone: builder.mutation<IItemResponse<IMilestone>, ICreateMilestone>({
      query: (body) => ({
        url: `milestones`,
        method: 'POST',
        body,
      }),
    }),

    updateMilestoneInfo: builder.mutation<IItemResponse<IMilestone>, IUpdateMilestoneInfo>({
      query: ({ id, ...body }) => ({
        url: `milestones/${id}`,
        method: 'PUT',
        body,
      }),
    }),

    updateMilestoneStatus: builder.mutation<IItemResponse<IMilestone>, IUpdateMilestoneStatus>({
      query: ({ id, status }) => ({
        url: `milestones/${id}/${status}`,
        method: 'PUT',
      }),
    }),

    // ---- Tasks ----
    getMilestoneTasks: builder.query<IListResponse<ITask>, IGetMilestoneTasksParams>({
      query: ({ id, ...params }) => ({
        url: `milestones/${id}/tasks`,
        method: 'GET',
        params,
      }),
    }),

    getTaskDetail: builder.query<IItemResponse<ITask>, ITaskAction>({
      query: ({ milestoneId, taskId }) => ({
        url: `milestones/${milestoneId}/tasks/${taskId}`,
        method: 'GET',
      }),
    }),

    createTask: builder.mutation<IItemResponse<ITask>, ICreateTask>({
      query: ({ milestoneId, ...body }) => ({
        url: `milestones/${milestoneId}/tasks`,
        method: 'POST',
        body,
      }),
    }),

    updateTask: builder.mutation<IItemResponse<ITask>, IUpdateTask>({
      query: ({ milestoneId, taskId, ...body }) => ({
        url: `milestones/${milestoneId}/tasks/${taskId}`,
        method: 'PUT',
        body,
      }),
    }),

    deleteTask: builder.mutation<IItemResponse<null>, ITaskAction>({
      query: ({ milestoneId, taskId }) => ({
        url: `milestones/${milestoneId}/tasks/${taskId}`,
        method: 'DELETE',
      }),
    }),

    cancelTask: builder.mutation<IItemResponse<null>, ITaskAction>({
      query: ({ milestoneId, taskId }) => ({
        url: `milestones/${milestoneId}/tasks/${taskId}/cancelled`,
        method: 'PUT',
      }),
    }),

    completeTask: builder.mutation<IItemResponse<null>, ITaskAction>({
      query: ({ milestoneId, taskId }) => ({
        url: `milestones/${milestoneId}/tasks/${taskId}/completed`,
        method: 'PUT',
      }),
    }),
  }),
});

export const {
  // Milestone
  useLazyGetMilestonesQuery,
  useLazyGetMilestoneQuery,
  useCreateMilestoneMutation,
  useUpdateMilestoneInfoMutation,
  useUpdateMilestoneStatusMutation,

  // Tasks
  useLazyGetMilestoneTasksQuery,
  useLazyGetTaskDetailQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useCancelTaskMutation,
  useCompleteTaskMutation,
} = milestoneApi;
