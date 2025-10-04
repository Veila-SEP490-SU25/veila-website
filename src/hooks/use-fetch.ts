'use client';

import { isSuccess, isTokenExpired } from '@/lib/utils';
import {
  BaseQueryFn,
  TypedLazyQueryTrigger,
  TypedMutationTrigger,
} from '@reduxjs/toolkit/query/react';
import { useRefreshTokenMutation } from '@/services/apis';
import { IResponse } from '@/services/types';
import { useCallback, useRef } from 'react';
import { useAuth } from '@/providers/auth.provider';

export const useFetch = <TArg, TResult extends IResponse>(
  trigger:
    | TypedMutationTrigger<TResult, TArg, BaseQueryFn>
    | TypedLazyQueryTrigger<TResult, TArg, BaseQueryFn>,
): ((payload: TArg) => Promise<TResult>) => {
  const {
    currentRefreshToken: refreshToken,
    saveTokens: setTokens,
    revokeTokens: clearTokens,
  } = useAuth();
  const [refreshTrigger] = useRefreshTokenMutation();

  // Store the latest trigger function in a ref to avoid stale closures
  const triggerRef = useRef(trigger);
  triggerRef.current = trigger;

  // Store token functions in refs to avoid stale closures
  const setTokensRef = useRef(setTokens);
  setTokensRef.current = setTokens;

  const clearTokensRef = useRef(clearTokens);
  clearTokensRef.current = clearTokens;

  const callTrigger = useCallback(
    async (payload: TArg) => {
      const result = await triggerRef.current(payload).unwrap();
      if (isSuccess(result.statusCode)) {
        return result;
      } else if (isTokenExpired(result.statusCode, result.message)) {
        try {
          if (!refreshToken) return result;
          const { statusCode, item, message } = await refreshTrigger({ refreshToken }).unwrap();
          if (isSuccess(statusCode) && item) {
            setTokensRef.current(item.accessToken, item.refreshToken);
            const retryResult = await triggerRef.current(payload).unwrap();
            return retryResult;
          } else {
            console.error('Failed to refresh token:', statusCode, message);
            clearTokensRef.current();
            return result;
          }
        } catch (error) {
          console.error('Lỗi khi làm mới token:', error);
          clearTokensRef.current();
          throw error;
        }
      } else return result as TResult;
    },
    [refreshToken, refreshTrigger],
  );

  return callTrigger;
};
