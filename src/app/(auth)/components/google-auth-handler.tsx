'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/providers/auth.provider';
import { useFirebase } from '@/services/firebase';
import { getRedirectResult } from 'firebase/auth';
import { toast } from 'sonner';

export const GoogleAuthHandler = () => {
  const { auth } = useFirebase();
  const { loginGoogle } = useAuth();

  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const handleRedirectResult = async () => {
      if (!auth) return;

      try {
        setIsProcessing(true);
        const result = await getRedirectResult(auth);

        if (result) {
          const { user } = result;
          const { displayName, email } = user;

          if (!displayName || !email) {
            toast.error('Có lỗi xảy ra trong quá trình xác thực.');
            return;
          }

          await loginGoogle({
            email,
            fullname: displayName,
          });

          toast.success('Đăng nhập Google thành công!');
        }
      } catch (error: any) {
        console.error('Google redirect error:', error);
        toast.error('Có lỗi xảy ra khi xử lý đăng nhập Google');
      } finally {
        setIsProcessing(false);
      }
    };

    handleRedirectResult();
  }, [auth, loginGoogle]);

  if (isProcessing) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600 mx-auto"></div>
          <p className="mt-4 text-center">Đang xử lý đăng nhập Google...</p>
        </div>
      </div>
    );
  }

  return null;
};
