import {
  getFromLocalStorage,
  removeFromLocalStorage,
  setToLocalStorage,
} from '@/lib/utils/local-storage.util';

export const getAccessToken = () => {
  const token = getFromLocalStorage<string>('accessToken');

  if (token && typeof token === 'string' && token.startsWith('eyJ')) {
    return token;
  }

  if (token) {
    delAccessToken();
  }
  return null;
};

export const getRefreshToken = () => {
  const token = getFromLocalStorage<string>('refreshToken');

  if (token && typeof token === 'string' && token.startsWith('eyJ')) {
    return token;
  }

  if (token) {
    delRefreshToken();
  }
  return null;
};

export const setAccessToken = (token: string) => {
  setToLocalStorage<string>('accessToken', token);
};

export const setRefreshToken = (token: string) => {
  setToLocalStorage<string>('refreshToken', token);
};

export const delAccessToken = () => {
  removeFromLocalStorage('accessToken');
};

export const delRefreshToken = () => {
  removeFromLocalStorage('refreshToken');
};

export const getTokens = () => {
  return {
    accessToken: getAccessToken(),
    refreshToken: getRefreshToken(),
  };
};

export const setTokens = (accessToken: string, refreshToken: string) => {
  setAccessToken(accessToken);
  setRefreshToken(refreshToken);
};

export const delTokens = () => {
  delAccessToken();
  delRefreshToken();
};

export const cleanupCorruptTokens = () => {
  try {
    const rawAccessToken =
      typeof window !== 'undefined' ? window.localStorage.getItem('accessToken') : null;
    if (rawAccessToken && !rawAccessToken.startsWith('eyJ')) {
      delAccessToken();
    }

    const rawRefreshToken =
      typeof window !== 'undefined' ? window.localStorage.getItem('refreshToken') : null;
    if (rawRefreshToken && !rawRefreshToken.startsWith('eyJ')) {
      delRefreshToken();
    }
  } catch (error) {
    console.warn('Error during token cleanup:', error);
  }
};
