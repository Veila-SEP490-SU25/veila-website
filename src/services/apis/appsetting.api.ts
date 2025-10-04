import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithRefresh } from '@/services/apis/base.query';
import {
  IAddNewMilestoneTemplate,
  IAppSetting,
  IComplaintReason,
  ICreateComplaintReason,
  IGetMilestoneTemplate,
  IItemResponse,
  IListResponse,
  IMilestoneTemplate,
  IPagination,
  IRemoveMilestoneTemplate,
  ISetCancelPenalty,
  ISetDaysToComplaint,
  ISetDaysToReviewUpdateRequest,
  ISetDelayPenalty,
  IUpdateComplaintReason,
} from '@/services/types';

export const appsettingApi = createApi({
  reducerPath: 'appsettingApi',
  baseQuery: baseQueryWithRefresh,
  endpoints: (builder) => ({
    getAppSetting: builder.query<IItemResponse<IAppSetting>, void>({
      query: () => ({
        url: `/app-settings`,
        method: 'GET',
      }),
    }),

    getCancelPenalty: builder.query<IItemResponse<number>, void>({
      query: () => ({
        url: `/app-settings/cancel-penalty`,
        method: 'GET',
      }),
    }),

    setCancelPenalty: builder.mutation<IItemResponse<null>, ISetCancelPenalty>({
      query: (body) => ({
        url: `/app-settings/cancel-penalty`,
        method: 'POST',
        body,
      }),
    }),

    getComplaintReasons: builder.query<IListResponse<IComplaintReason>, IPagination>({
      query: ({ sort = '', filter = '', page = 0, size = 10 }) => ({
        url: `/app-settings/complaint-reasons`,
        method: 'GET',
        params: { sort, filter, page, size },
      }),
    }),

    createComplaintReason: builder.mutation<
      IItemResponse<IComplaintReason>,
      ICreateComplaintReason
    >({
      query: (body) => ({
        url: `/app-settings/complaint-reasons`,
        method: 'POST',
        body,
      }),
    }),

    updateComplaintReason: builder.mutation<IItemResponse<null>, IUpdateComplaintReason>({
      query: (body) => {
        const { id, ...bodyWithoutId } = body;
        return {
          url: `/app-settings/complaint-reasons/${id}`,
          method: 'PUT',
          body: bodyWithoutId,
        };
      },
    }),

    deleteComplaintReason: builder.mutation<IItemResponse<null>, string>({
      query: (id) => ({
        url: `/app-settings/complaint-reasons/${id}`,
        method: 'DELETE',
      }),
    }),

    getDaysToComplaint: builder.query<IItemResponse<number>, void>({
      query: () => ({
        url: `/app-settings/days-to-complaint`,
        method: 'GET',
      }),
    }),

    setDaysToComplaint: builder.mutation<IItemResponse<null>, ISetDaysToComplaint>({
      query: (body) => ({
        url: `/app-settings/days-to-complaint`,
        method: 'POST',
        body,
      }),
    }),

    getDaysToReviewUpdateRequest: builder.query<IItemResponse<number>, void>({
      query: () => ({
        url: `/app-settings/days-to-review-update-request`,
        method: 'GET',
      }),
    }),

    setDaysToReviewUpdateRequest: builder.mutation<
      IItemResponse<null>,
      ISetDaysToReviewUpdateRequest
    >({
      query: (body) => ({
        url: `/app-settings/days-to-review-update-request`,
        method: 'POST',
        body,
      }),
    }),

    getDelayPenalty: builder.query<IItemResponse<number>, void>({
      query: () => ({
        url: `/app-settings/delay-penalty`,
        method: 'GET',
      }),
    }),

    setDelayPenalty: builder.mutation<IItemResponse<null>, ISetDelayPenalty>({
      query: (body) => ({
        url: `/app-settings/delay-penalty`,
        method: 'POST',
        body,
      }),
    }),

    getMilestoneTemplate: builder.query<IListResponse<IMilestoneTemplate>, IGetMilestoneTemplate>({
      query: ({ type }) => ({
        url: `/app-settings/milestone-templates/${type}`,
        method: 'GET',
      }),
    }),

    addMilestoneTemplate: builder.mutation<IItemResponse<null>, IAddNewMilestoneTemplate>({
      query: (body) => ({
        url: `/app-settings/milestone-templates`,
        method: 'POST',
        body,
      }),
    }),

    updateMilestoneTemplate: builder.mutation<IItemResponse<null>, IUpdateComplaintReason>({
      query: (body) => {
        const { id, ...bodyWithoutId } = body;
        return {
          url: `/app-settings/milestone-templates/${id}`,
          method: 'PUT',
          body: bodyWithoutId,
        };
      },
    }),

    removeMilestoneTemplate: builder.mutation<IItemResponse<null>, IRemoveMilestoneTemplate>({
      query: ({ type }) => ({
        url: `/app-settings/milestone-templates/${type}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  //app settings
  useLazyGetAppSettingQuery,

  //cancel penalty
  useLazyGetCancelPenaltyQuery,
  useSetCancelPenaltyMutation,

  //complaint reasons
  useLazyGetComplaintReasonsQuery,
  useCreateComplaintReasonMutation,
  useUpdateComplaintReasonMutation,
  useDeleteComplaintReasonMutation,

  //days to complaint
  useLazyGetDaysToComplaintQuery,
  useSetDaysToComplaintMutation,

  //days to review update request
  useLazyGetDaysToReviewUpdateRequestQuery,
  useSetDaysToReviewUpdateRequestMutation,

  //delay penalty
  useLazyGetDelayPenaltyQuery,
  useSetDelayPenaltyMutation,

  //milestone templates
  useLazyGetMilestoneTemplateQuery,
  useAddMilestoneTemplateMutation,
  useUpdateMilestoneTemplateMutation,
  useRemoveMilestoneTemplateMutation,
} = appsettingApi;
