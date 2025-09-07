'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/providers/auth.provider';
import { useFirebase } from '@/services/firebase';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { signInWithRedirect } from 'firebase/auth';

interface GoogleButtonProps {
  variant?: 'login' | 'signup';
}

export const GoogleButton: React.FC<GoogleButtonProps> = ({ variant = 'login' }) => {
  const { auth, signInWithPopup, googleProvider } = useFirebase();
  const { loginGoogle, isAuthenticating } = useAuth();

  const handleGoogleSignIn = useCallback(async () => {
    if (!auth || !signInWithPopup || !googleProvider) {
      toast.error('Firebase chưa được khởi tạo. Vui lòng thử lại sau.');
      return;
    }

    try {
      const { user } = await signInWithPopup(auth, googleProvider);
      const { displayName, email } = user;
      if (!displayName || !email) {
        toast.error('Có lỗi xảy ra trong quá trình xác thực.', {
          description: 'Vui lòng thử lại sau ít phút hoặc liên hệ với bộ phận hỗ trợ.',
        });
        return;
      } else {
        await loginGoogle({
          email,
          fullname: displayName,
        });
      }
    } catch (error: any) {
      console.error('Google sign-in error:', error);

      // Xử lý lỗi COOP
      if (
        error.code === 'auth/popup-closed-by-user' ||
        error.message?.includes('popup') ||
        error.message?.includes('COOP') ||
        error.code === 'auth/popup-blocked' ||
        error.code === 'auth/cancelled-popup-request'
      ) {
        toast.error('Popup bị chặn', {
          description: 'Đang chuyển sang chế độ redirect...',
        });

        // Fallback: sử dụng redirect
        try {
          await signInWithRedirect(auth, googleProvider);
        } catch (redirectError: any) {
          console.error('Redirect error:', redirectError);
          toast.error('Không thể đăng nhập Google', {
            description: 'Vui lòng thử đăng nhập bằng email hoặc liên hệ hỗ trợ.',
          });
        }
      } else {
        toast.error('Có lỗi xảy ra khi đăng nhập Google', {
          description: error.message || 'Vui lòng thử lại sau.',
        });
      }
    }
  }, [auth, signInWithPopup, googleProvider, loginGoogle]);

  return (
    <Button
      variant="outline"
      className="w-full h-11 text-base font-medium border-gray-300 hover:bg-gray-50"
      onClick={handleGoogleSignIn}
      disabled={isAuthenticating}
    >
      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      {variant === 'login' ? 'Đăng nhập' : 'Đăng ký'} với Google
    </Button>
  );
};
