import { baseQueryWithRefresh } from "@/services/apis/base.query";
import {
  IIdentifyUser,
  IItemResponse,
  IListResponse,
  IPagination,
  IUser,
  UserRole,
  UserStatus,
} from "@/services/types";
import { createApi } from "@reduxjs/toolkit/query/react";

export interface ICreateUser {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  isVerified: boolean;
  isIdentified: boolean;
}

export interface IUpdateUser extends ICreateUser {
  id: string;
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithRefresh,
  endpoints: (builder) => ({
    identify: builder.mutation<IItemResponse<null>, IIdentifyUser>({
      query: (body) => ({
        url: "users/identify",
        method: "PUT",
        body,
      }),
    }),

    getUsers: builder.query<IListResponse<IUser>, IPagination>({
      query: ({ sort = "", filter = "", page = 0, size = 10 }) => ({
        url: "users",
        method: "GET",
        params: { sort, filter, page, size },
      }),
    }),

    getUser: builder.query<IItemResponse<IUser>, string>({
      query: (id) => ({
        url: `users/${id}`,
        method: "GET",
      }),
    }),

    createUser: builder.mutation<IItemResponse<IUser>, ICreateUser>({
      query: (body) => ({
        url: "users",
        method: "POST",
        body,
      }),
    }),

    updateUser: builder.mutation<IItemResponse<IUser>, IUpdateUser>({
      query: (body) => ({
        url: `users/${body.id}`,
        method: "PUT",
        body,
      }),
    }),

    deleteUser: builder.mutation<IItemResponse<null>, string>({
      query: (id) => ({
        url: `users/${id}`,
        method: "DELETE",
      }),
    }),

    restoreUser: builder.mutation<IItemResponse<IUser>, string>({
      query: (id) => ({
        url: `users/${id}`,
        method: "PATCH",
      }),
    }),
  }),
});

export const {
  useIdentifyMutation,
  useLazyGetUsersQuery,
  useLazyGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useRestoreUserMutation,
} = userApi;
