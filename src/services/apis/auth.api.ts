import { baseQueryWithRefresh } from "@/services/apis/base.query";
import {
  IChangePassword,
  IGoogleAuth,
  IItemResponse,
  ILogin,
  IRegister,
  IRequestOtp,
  IResetPassword,
  IToken,
  IUser,
  IUpdateProfile,
  IVerifyOtp,
  IIdentifyUser,
} from "@/services/types";
import { createApi } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithRefresh,
  endpoints: (builder) => ({
    login: builder.mutation<IItemResponse<IToken>, ILogin>({
      query: (body) => ({
        url: "auth/login",
        method: "POST",
        body,
      }),
    }),

    logout: builder.mutation<IItemResponse<null>, void>({
      query: () => ({
        url: "auth/logout",
        method: "POST",
      }),
    }),

    getMe: builder.query<IItemResponse<IUser>, void>({
      query: () => ({
        url: "auth/me",
        method: "GET",
      }),
    }),

    refreshToken: builder.mutation<
      IItemResponse<IToken>,
      { refreshToken: string }
    >({
      query: (body) => ({
        url: "auth/refresh-token",
        method: "POST",
        body,
      }),
    }),

    register: builder.mutation<IItemResponse<string>, IRegister>({
      query: (body) => ({
        url: "auth/register",
        method: "POST",
        body,
      }),
    }),

    requestOtp: builder.mutation<IItemResponse<string>, IRequestOtp>({
      query: (body) => ({
        url: "auth/request-otp",
        method: "POST",
        body,
      }),
    }),

    verifyOtp: builder.mutation<IItemResponse<IToken>, IVerifyOtp>({
      query: (body) => ({
        url: "auth/verify-otp",
        method: "POST",
        body,
      }),
    }),

    changePassword: builder.mutation<IItemResponse<null>, IChangePassword>({
      query: (body) => ({
        url: "auth/change-password",
        method: "POST",
        body,
      }),
    }),

    resetPassword: builder.mutation<IItemResponse<null>, IResetPassword>({
      query: (body) => ({
        url: "auth/reset-password",
        method: "POST",
        body,
      }),
    }),

    googleAuth: builder.mutation<IItemResponse<IToken>, IGoogleAuth>({
      query: (body) => ({
        url: "auth/google/login",
        method: "POST",
        body,
      }),
    }),

    updateProfile: builder.mutation<IItemResponse<IUser>, IUpdateProfile>({
      query: (body) => ({
        url: "auth/me",
        method: "PUT",
        body,
      }),
    }),

    identifyUser: builder.mutation<IItemResponse<null>, IIdentifyUser>({
      query: (body) => ({
        url: "users/identify",
        method: "PUT",
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useLazyGetMeQuery,
  useRefreshTokenMutation,
  useRegisterMutation,
  useRequestOtpMutation,
  useVerifyOtpMutation,
  useChangePasswordMutation,
  useResetPasswordMutation,
  useGoogleAuthMutation,
  useUpdateProfileMutation,
  useIdentifyUserMutation,
} = authApi;
