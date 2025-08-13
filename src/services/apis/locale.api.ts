import {
  IDistrict,
  IGetLocation,
  ILocaleResponse,
  IPaging,
  IProvince,
  IWard,
} from "@/services/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "https://open.oapi.vn/",
});

export const localeApi = createApi({
  reducerPath: "localeApi",
  baseQuery: async (args, api, extraOptions) => {
    return await baseQuery(args, api, extraOptions);
  },
  endpoints: (builder) => ({
    getProvinces: builder.query<ILocaleResponse<IProvince>, IPaging>({
      query: ({ page, size, query }) => ({
        url: `location/provinces`,
        params: {
          page,
          size,
          query,
        },
      }),
    }),

    getDistricts: builder.query<ILocaleResponse<IDistrict>, IGetLocation>({
      query: ({ id, page, size, query }) => ({
        url: `location/districts/${id}`,
        params: {
          page,
          size,
          query,
        },
      }),
    }),

    getWards: builder.query<ILocaleResponse<IWard>, IGetLocation>({
      query: ({ id, page, size, query }) => ({
        url: `location/wards/${id}`,
        params: {
          page,
          size,
          query,
        },
      }),
    }),
  }),
});

export const {
  useLazyGetDistrictsQuery,
  useLazyGetProvincesQuery,
  useLazyGetWardsQuery,
} = localeApi;
