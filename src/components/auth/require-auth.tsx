'use client';

import { useAuth } from '@/providers/auth.provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, LogIn } from 'lucide-react';
import Link from 'next/link';

interface RequireAuthProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ children, fallback }) => {
  const { isAuthenticated, currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !currentUser) {
    }
  }, [isAuthenticated, currentUser, router]);

  if (!isAuthenticated || !currentUser) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ivory-50 to-ivory-100 p-4">
        <Card className="w-full max-w-md shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-crimson-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-crimson-600" />
            </div>
            <CardTitle className="text-2xl font-cormorant font-semibold text-gray-800">
              Yêu cầu đăng nhập
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Vui lòng đăng nhập để tiếp tục khám phá
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-gray-500 mb-6">
              Đăng nhập để xem đầy đủ các tính năng và nội dung
            </div>
            <div className="space-y-3">
              <Link href="/login" className="w-full">
                <Button className="w-full bg-crimson-600 hover:bg-crimson-700 text-white">
                  <LogIn className="w-4 h-4 mr-2" />
                  Đăng nhập
                </Button>
              </Link>
              <Link href="/register" className="w-full">
                <Button
                  variant="outline"
                  className="w-full border-crimson-200 text-crimson-700 hover:bg-crimson-50"
                >
                  Tạo tài khoản mới
                </Button>
              </Link>
            </div>
            <div className="text-center pt-4 border-t border-gray-100">
              <Link href="/" className="text-sm text-crimson-600 hover:text-crimson-700">
                ← Quay về trang chủ
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};
