'use client';

import {
  useGoogleAuthMutation,
  useLazyGetMeQuery,
  useLoginMutation,
  useLogoutMutation,
  useRequestOtpMutation,
  useVerifyOtpMutation,
} from '@/services/apis';
import { IGoogleAuth, ILogin, IUser, IVerifyOtp } from '@/services/types';
import {
  delTokens,
  getAccessToken,
  getFromLocalStorage,
  getRefreshToken,
  removeFromLocalStorage,
  setTokens,
  setToLocalStorage,
  cleanupCorruptTokens,
} from '@/lib/utils/index';
import { usePathname, useRouter } from 'next/navigation';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { toast } from 'sonner';

type AuthContextType = {
  login: (body: ILogin) => Promise<void>;
  loginGoogle: (body: IGoogleAuth) => Promise<void>;
  logout: () => Promise<void>;
  verifyOtp: (body: IVerifyOtp) => Promise<void>;
  reloadProfile: () => void;
  isAuthenticating: boolean;
  isAuthenticated: boolean;
  currentAccessToken: string | null;
  currentRefreshToken: string | null;
  currentUser: IUser | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth cần được sử dụng trong AuthProvider.');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const _pathname = usePathname();

  // Initialize auth state from localStorage after component mount
  useEffect(() => {
    const initAuth = () => {
      cleanupCorruptTokens();

      const storedIsAuthenticated = getFromLocalStorage<boolean>('isAuthenticated') || false;
      const storedUser = getFromLocalStorage<IUser>('user');
      const storedAccessToken = getAccessToken();
      const storedRefreshToken = getRefreshToken();

      setIsAuthenticated(storedIsAuthenticated);
      setCurrentUser(storedUser);
      setCurrentAccessToken(storedAccessToken);
      setCurrentRefreshToken(storedRefreshToken);
      setIsInitialized(true);
    };

    initAuth();
  }, []);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [currentAccessToken, setCurrentAccessToken] = useState<string | null>(null);
  const [currentRefreshToken, setCurrentRefreshToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const authCheckRef = useRef(false);

  const saveTokens = useCallback(
    (accessToken: string, refreshToken: string) => {
      setTokens(accessToken, refreshToken);
      setCurrentAccessToken(accessToken);
      setCurrentRefreshToken(refreshToken);
    },
    [setCurrentAccessToken, setCurrentRefreshToken],
  );

  const revokeTokens = useCallback(() => {
    delTokens();
    setCurrentAccessToken(null);
    setCurrentRefreshToken(null);
  }, [setCurrentAccessToken, setCurrentRefreshToken]);

  const [loginMutation, { isLoading: isLoginLoading }] = useLoginMutation();
  const [verifyOtpMutation, { isLoading: isVerifyOtpLoading }] = useVerifyOtpMutation();
  const [logoutMutation, { isLoading: isLogoutLoading }] = useLogoutMutation();
  const [getMeQuery, { isLoading: isGetMeLoading }] = useLazyGetMeQuery();
  const [loginGoogleMutation, { isLoading: isGoogleLading }] = useGoogleAuthMutation();

  const [requestOtpMutation] = useRequestOtpMutation();

  const loginGoogle = useCallback(
    async (body: IGoogleAuth) => {
      try {
        const { item, statusCode } = await loginGoogleMutation(body).unwrap();
        if (statusCode === 200) {
          const { accessToken, refreshToken } = item;
          authCheckRef.current = false;
          saveTokens(accessToken, refreshToken);
          setIsAuthenticated(true);
          setToLocalStorage('isAuthenticated', true);
          toast.success('Đăng nhập thành công.', {
            description: 'Chào mừng bạn quay trở lại.',
          });
          router.push('/');
          return;
        } else if (statusCode === 401) {
          const { item, statusCode } = await requestOtpMutation({
            email: body.email,
          }).unwrap();
          if (statusCode === 200) {
            router.push(`/verify-otp?userId=${item}&email=${body.email}`);
          } else {
            toast.error('Đăng nhập thất bại.', {
              description: 'Có lỗi xảy ra trong quá trình đăng nhập.',
            });
            return;
          }
        } else {
          toast.error('Đăng nhập thất bại.', {
            description: 'Có lỗi xảy ra trong quá trình đăng nhập.',
          });
          return;
        }
      } catch {
        toast.error('Đăng nhập thất bại.', {
          description: 'Có lỗi xảy ra trong quá tình đăng nhập. Vui lòng thử lại sau ít phút.',
        });
        return;
      }
    },
    [loginGoogleMutation, saveTokens, setIsAuthenticated, router, requestOtpMutation],
  );

  const login = useCallback(
    async (body: ILogin) => {
      try {
        const { item, statusCode } = await loginMutation(body).unwrap();
        if (statusCode === 200) {
          const { accessToken, refreshToken } = item;
          authCheckRef.current = false;
          saveTokens(accessToken, refreshToken);
          setIsAuthenticated(true);
          setToLocalStorage('isAuthenticated', true);
          toast.success('Đăng nhập thành công.', {
            description: 'Chào mừng bạn quay trở lại.',
          });
          router.push('/');
          return;
        } else if (statusCode === 401) {
          const { item, statusCode } = await requestOtpMutation({
            email: body.email,
          }).unwrap();
          if (statusCode === 200) {
            router.push(`/verify-otp?userId=${item}&email=${body.email}`);
          } else {
            toast.error('Đăng nhập thất bại.', {
              description: 'Có lỗi xảy ra trong quá trình đăng nhập.',
            });
            return;
          }
        } else {
          toast.error('Đăng nhập thất bại.', {
            description: 'Có lỗi xảy ra trong quá trình đăng nhập.',
          });
          return;
        }
      } catch {
        toast.error('Đăng nhập thất bại.', {
          description: 'Có lỗi xảy ra trong quá tình đăng nhập. Vui lòng thử lại sau ít phút.',
        });
        return;
      }
    },
    [loginMutation, saveTokens, setIsAuthenticated, router, requestOtpMutation],
  );

  const verifyOtp = useCallback(
    async (body: IVerifyOtp) => {
      try {
        const { item, statusCode } = await verifyOtpMutation(body).unwrap();
        if (statusCode === 200) {
          const { accessToken, refreshToken } = item;
          authCheckRef.current = false;
          saveTokens(accessToken, refreshToken);
          setIsAuthenticated(true);
          setToLocalStorage('isAuthenticated', true);
          toast.success('Đăng nhập thành công.', {
            description: 'Chào mừng bạn quay trở lại.',
          });
          router.push('/');
          return;
        } else {
          toast.error('Đăng nhập thất bại.', {
            description: 'Có lỗi xảy ra trong quá trình đăng nhập.',
          });
          return;
        }
      } catch {
        toast.error('Đăng nhập thất bại.', {
          description: 'Có lỗi xảy ra trong quá tình đăng nhập. Vui lòng thử lại sau ít phút.',
        });
        return;
      }
    },
    [verifyOtpMutation, saveTokens, setIsAuthenticated, router],
  );

  const logout = useCallback(async () => {
    try {
      const { statusCode } = await logoutMutation().unwrap();
      revokeTokens();
      setIsAuthenticated(false);
      removeFromLocalStorage('isAuthenticated');
      setCurrentUser(null);
      removeFromLocalStorage('user');

      if (statusCode === 200) {
        toast.success('Đăng xuất thành công.', {
          description: 'Hẹn gặp lại bạn lần sau.',
        });
      } else {
        toast.success('Đăng xuất thành công.', {
          description: 'Phiên đăng nhập đã hết hạn.',
        });
      }

      router.push('/');
    } catch {
      revokeTokens();
      setIsAuthenticated(false);
      removeFromLocalStorage('isAuthenticated');
      setCurrentUser(null);
      removeFromLocalStorage('user');
      toast.success('Đăng xuất thành công.', {
        description: 'Phiên đăng nhập đã được kết thúc.',
      });

      router.push('/');
    }
  }, [logoutMutation, revokeTokens, setIsAuthenticated, setCurrentUser, router]);

  const reloadProfile = useCallback(() => {
    authCheckRef.current = false;
    setIsAuthenticated(false);
  }, [setIsAuthenticated]);

  useEffect(() => {
    if (authCheckRef.current) return;

    const checkAuth = async () => {
      if (!currentAccessToken || !currentRefreshToken) {
        if (isAuthenticated) await logout();
        return;
      }
      try {
        const { item, statusCode } = await getMeQuery().unwrap();
        if (statusCode === 200) {
          setCurrentUser(item);
          setToLocalStorage('user', item);
          setToLocalStorage('isAuthenticated', true);
          setIsAuthenticated(true);
          authCheckRef.current = true;
        } else {
          authCheckRef.current = false;
          revokeTokens();
          setIsAuthenticated(false);
          removeFromLocalStorage('isAuthenticated');
          setCurrentUser(null);
          removeFromLocalStorage('user');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        toast.error('Có lỗi xảy ra trong quá trình xác thực.', {
          description: 'Vui lòng thử lại sau ít phút hoặc liên hệ với bộ phận hỗ trợ.',
        });
        revokeTokens();
        setIsAuthenticated(false);
        removeFromLocalStorage('isAuthenticated');
        setCurrentUser(null);
        removeFromLocalStorage('user');
      }
    };

    if (currentAccessToken || isAuthenticated) {
      checkAuth();
    }
  }, [
    currentAccessToken,
    currentRefreshToken,
    isAuthenticated,
    currentUser,
    getMeQuery,
    logout,
    revokeTokens,
  ]);

  return (
    <AuthContext.Provider
      value={{
        login,
        loginGoogle,
        logout,
        verifyOtp,
        reloadProfile,
        isAuthenticating:
          !isInitialized ||
          isLoginLoading ||
          isLogoutLoading ||
          isVerifyOtpLoading ||
          isGoogleLading ||
          isGetMeLoading,
        isAuthenticated,
        currentAccessToken,
        currentRefreshToken,
        currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
