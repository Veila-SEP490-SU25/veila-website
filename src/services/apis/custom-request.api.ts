import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "./base.query";
import { IItemResponse, IListResponse } from "@/services/types";

export interface ICreateCustomRequest {
  title: string;
  description: string;
  images: string;
  height: number;
  weight: number;
  bust: number;
  waist: number;
  hip: number;
  armpit: number;
  bicep: number;
  neck: number;
  shoulderWidth: number;
  sleeveLength: number;
  backLength: number;
  lowerWaist: number;
  waistToFloor: number;
  material?: string;
  color?: string;
  length?: string;
  neckline?: string;
  sleeve?: string;
  status: "DRAFT" | "SUBMIT";
  isPrivate: boolean;
}

export interface ICustomRequest extends ICreateCustomRequest {
  id: string;
  createdAt: string;
  updatedAt: string;
  customerId: string;
}

export interface IUpdateCustomRequest extends Partial<ICreateCustomRequest> {
  id: string;
}

export const customRequestApi = createApi({
  reducerPath: "customRequestApi",
  baseQuery: baseQueryWithRefresh,
  endpoints: (builder) => ({
    createCustomRequest: builder.mutation<
      IItemResponse<any>,
      ICreateCustomRequest
    >({
      query: (data) => ({
        url: "requests/me",
        method: "POST",
        body: data,
      }),
    }),
    getMyCustomRequests: builder.query<IListResponse<ICustomRequest>, void>({
      query: () => ({
        url: "requests/me",
        method: "GET",
      }),
    }),
    getCustomRequestById: builder.query<IItemResponse<ICustomRequest>, string>({
      query: (id) => ({
        url: `requests/${id}/me`,
        method: "GET",
      }),
    }),
    updateCustomRequest: builder.mutation<
      IItemResponse<any>,
      IUpdateCustomRequest
    >({
      query: ({ id, ...data }) => ({
        url: `requests/${id}/me`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteCustomRequest: builder.mutation<IItemResponse<any>, string>({
      query: (id) => ({
        url: `requests/${id}/me`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateCustomRequestMutation,
  useGetMyCustomRequestsQuery,
  useGetCustomRequestByIdQuery,
  useUpdateCustomRequestMutation,
  useDeleteCustomRequestMutation,
} = customRequestApi;
