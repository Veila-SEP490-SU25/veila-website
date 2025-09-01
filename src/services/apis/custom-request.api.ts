import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./base-query";
import { IItemResponse, IListResponse } from "../types/base.type";

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

export const customRequestApi = createApi({
  reducerPath: "customRequestApi",
  baseQuery,
  endpoints: (builder) => ({
    createCustomRequest: builder.mutation<IItemResponse<any>, ICreateCustomRequest>({
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
  }),
});

export const { 
  useCreateCustomRequestMutation,
  useGetMyCustomRequestsQuery,
} = customRequestApi;
