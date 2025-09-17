import { baseQueryWithRefresh } from "@/services/apis/base.query";
import { IItemResponse } from "@/services/types";
import { createApi } from "@reduxjs/toolkit/query/react";

export const uploadApi = createApi({
  reducerPath: "uploadApi",
  baseQuery: baseQueryWithRefresh,
  endpoints: (builder) => ({
    uploadFile: builder.mutation<IItemResponse<string>, FormData>({
      query: (formData) => ({
        url: "upload",
        method: "POST",
        body: formData,
      }),
    })
  })
})

export const { useUploadFileMutation } = uploadApi;