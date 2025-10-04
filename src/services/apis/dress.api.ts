import { baseQueryWithRefresh } from '@/services/apis/base.query';
import {
  ICreateDress,
  IDress,
  IItemResponse,
  IListResponse,
  IPagination,
  IUpdateDress,
} from '@/services/types';
import { createApi } from '@reduxjs/toolkit/query/react';

export const dressApi = createApi({
  reducerPath: 'dressApi',
  baseQuery: baseQueryWithRefresh,
  endpoints: (builder) => ({
    // PUBLIC
    getDresses: builder.query<IListResponse<IDress>, IPagination>({
      query: ({ filter = '', page = 0, size = 10, sort = '' }) => ({
        url: 'dresses',
        method: 'GET',
        params: { filter, page, size, sort },
      }),
    }),

    getDress: builder.query<IItemResponse<IDress>, string>({
      query: (id) => ({
        url: `dresses/${id}`,
        method: 'GET',
      }),
    }),

    // FAVORITES
    addFavorite: builder.mutation<IItemResponse<null>, string>({
      query: (id) => ({
        url: `dresses/${id}/favorites`,
        method: 'POST',
      }),
    }),

    removeFavorite: builder.mutation<IItemResponse<null>, string>({
      query: (id) => ({
        url: `dresses/${id}/favorites`,
        method: 'DELETE',
      }),
    }),

    getFavorites: builder.query<IListResponse<IDress>, IPagination>({
      query: ({ filter = '', page = 0, size = 10, sort = '' }) => ({
        url: 'dresses/favorites',
        method: 'GET',
        params: { filter, page, size, sort },
      }),
    }),

    // SHOP (OWNER)
    getMyShopDresses: builder.query<IListResponse<IDress>, IPagination>({
      query: ({ filter = '', page = 0, size = 10, sort = '' }) => ({
        url: 'dresses/me',
        method: 'GET',
        params: { filter, page, size, sort },
      }),
    }),

    getMyShopDress: builder.query<IItemResponse<IDress>, string>({
      query: (id) => ({
        url: `dresses/${id}/me`,
        method: 'GET',
      }),
    }),

    createDress: builder.mutation<IItemResponse<IDress>, ICreateDress>({
      query: (body) => ({
        url: 'dresses/me',
        method: 'POST',
        body,
      }),
    }),

    updateDress: builder.mutation<IItemResponse<null>, IUpdateDress>({
      query: ({ id, ...body }) => ({
        url: `dresses/${id}/me`,
        method: 'PUT',
        body,
      }),
    }),

    deleteDress: builder.mutation<IItemResponse<null>, string>({
      query: (id) => ({
        url: `dresses/${id}/me`,
        method: 'DELETE',
      }),
    }),

    restoreDress: builder.mutation<IItemResponse<null>, string>({
      query: (id) => ({
        url: `dresses/${id}/me`,
        method: 'PATCH',
      }),
    }),
  }),
});

export const {
  useLazyGetDressesQuery,
  useLazyGetDressQuery,
  useLazyGetFavoritesQuery,
  useLazyGetMyShopDressQuery,
  useLazyGetMyShopDressesQuery,
  useCreateDressMutation,
  useUpdateDressMutation,
  useDeleteDressMutation,
  useRestoreDressMutation,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} = dressApi;
