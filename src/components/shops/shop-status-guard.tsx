'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/providers/auth.provider';
import { ShopStatus } from '@/services/types';
import { SuspendedShopDashboard } from './suspended-shop-dashboard';

interface ShopStatusGuardProps {
  children: React.ReactNode;
}

// Danh sách các route được phép truy cập khi shop bị SUSPENDED
const ALLOWED_ROUTES_WHEN_SUSPENDED = [
  '/shops/my', // Dashboard
  '/profile', // Profile
];

export const ShopStatusGuard = ({ children }: ShopStatusGuardProps) => {
  const { currentUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (currentUser) {
      setIsChecking(false);
    }
  }, [currentUser]);

  // Nếu đang check hoặc không phải shop, render children
  if (isChecking || currentUser?.role !== 'SHOP') {
    return <>{children}</>;
  }

  // Kiểm tra shop status
  const shopStatus = currentUser.shop?.status;

  // Nếu shop bị SUSPENDED và đang truy cập route không được phép
  if (shopStatus === ShopStatus.SUSPENDED) {
    const isAllowedRoute = ALLOWED_ROUTES_WHEN_SUSPENDED.some((route) =>
      pathname.startsWith(route),
    );

    if (!isAllowedRoute) {
      // Redirect về dashboard
      router.push('/shops/my');
      return null;
    }

    // Nếu đang ở dashboard, hiển thị SuspendedShopDashboard
    if (pathname === '/shops/my') {
      return <SuspendedShopDashboard />;
    }
  }

  // Nếu shop không bị suspended hoặc đang truy cập route được phép, render children
  return <>{children}</>;
};
