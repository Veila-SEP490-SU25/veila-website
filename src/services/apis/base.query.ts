import { IItemResponse, IToken } from '@/services/types';
import { clearLocalStorage, getTokens, getVeilaServerConfig, setTokens } from '@/lib/utils/index';
import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { toast } from 'sonner';

const API_URL = getVeilaServerConfig();

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers) => {
    const { accessToken } = getTokens();
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }
    headers.set('ngrok-skip-browser-warning', 'true');
  },
});

const toastError = (title: string, description?: string) => {
  return toast.error(title, {
    description,
  });
};

export const baseQueryWithRefresh: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error) {
    // Xử lý error message an toàn
    let errorMessage = 'Đã xảy ra lỗi';
    if (result.error.data) {
      if (typeof result.error.data === 'string') {
        errorMessage = result.error.data;
      } else if (typeof result.error.data === 'object' && result.error.data !== null) {
        // Nếu data là object, thử lấy message
        const data = result.error.data as any;
        errorMessage = data.message || data.error || 'Đã xảy ra lỗi';
      }
    }
    toastError('Đã xảy ra lỗi', errorMessage);
  } else {
    const { statusCode, message } = result.data as IItemResponse<null>;
    if (statusCode === 401) {
      if (message.includes('hết hạn.')) {
        const refreshToken = getTokens().refreshToken;
        if (refreshToken) {
          const refreshResult = await baseQuery(
            {
              url: '/auth/refresh-token',
              method: 'POST',
              body: { refreshToken },
            },
            api,
            extraOptions,
          );
          const { statusCode, message, item } = refreshResult.data as IItemResponse<IToken>;
          if (statusCode === 200) {
            setTokens(item.accessToken, item.refreshToken);
            result = await baseQuery(args, api, extraOptions);
          } else {
            // Xử lý error message an toàn
            let errorMessage = 'Đã xảy ra lỗi';
            if (typeof message === 'string') {
              errorMessage = message;
            } else if (typeof message === 'object' && message !== null) {
              const msg = message as any;
              errorMessage = msg.message || msg.error || 'Đã xảy ra lỗi';
            }
            toastError('Đã xảy ra lỗi', errorMessage);
            clearLocalStorage();
            window.location.href = '/';
          }
        }
      }
    }
  }
  return result;
};
