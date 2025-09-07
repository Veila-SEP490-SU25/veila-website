import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithRefresh } from './base.query';

export const vonageApi = createApi({
  reducerPath: 'vonageApi',
  baseQuery: baseQueryWithRefresh,
  tagTypes: [],
  endpoints: (builder) => ({
    sendSms: builder.mutation<{ message: string }, { to: string }>({
      query: (data: { to: string }) => ({
        url: '/vonage/send-sms',
        method: 'POST',
        body: data,
      }),
    }),
    verifyPhoneOtp: builder.mutation<{ message: string }, { phone: string; otp: string }>({
      query: (data: { phone: string; otp: string }) => ({
        url: '/users/identify',
        method: 'PUT',
        body: data,
      }),
    }),
  }),
});

export const { useSendSmsMutation, useVerifyPhoneOtpMutation } = vonageApi;
