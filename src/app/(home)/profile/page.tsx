'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserCard } from '@/components/profile/user-card';
import { WalletCard } from '@/components/profile/wallet-card';
import { MyOrders } from '@/components/profile/orders/my-orders';
import { ProfileEditForm } from '@/components/profile/profile-edit-form';
import { ProfileStatsSkeleton } from '@/components/ui/loading-skeleton';
import { CustomRequestsTab } from '@/components/profile/custom-requests/custom-requests-tab';
import { MembershipInfo } from '@/components/profile/membership-info';
import { useAuth } from '@/providers/auth.provider';
import { UserRole } from '@/services/types';
import { ProfileFavoriteCard } from '@/components/profile/favourites/profile-favorite-card';

export default function DashboardPage() {
  const { isAuthenticated, currentUser } = useAuth();

  // Kiểm tra nếu user là shop thì ẩn một số tab
  const isShop = currentUser?.role === UserRole.SHOP;

  // Chỉ cho phép tab profile cho shop
  const [activeTab, setActiveTab] = useState(isShop ? 'profile' : 'profile');

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <ProfileStatsSkeleton />
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
            <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
      <div className="w-full space-y-4 grid grid-cols-2 gap-4 mb-4">
        <div className="cols-span-1 w-full h-full">
          <UserCard />
        </div>

        <div className="cols-span-1 w-full h-full">
          <WalletCard />
        </div>
      </div>

      <div className="flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className={`grid w-full ${isShop ? 'grid-cols-1' : 'grid-cols-4'}`}>
            <TabsTrigger value="profile">Thông tin cá nhân</TabsTrigger>
            {!isShop && (
              <>
                <TabsTrigger value="orders">Đơn Hàng</TabsTrigger>
                <TabsTrigger value="custom-requests">Yêu cầu đặt may</TabsTrigger>
                <TabsTrigger value="favourite">Yêu thích</TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <ProfileEditForm />
            {isShop && <MembershipInfo />}
          </TabsContent>

          {!isShop && (
            <>
              <TabsContent value="orders" className="space-y-6">
                <MyOrders />
              </TabsContent>

              <TabsContent value="custom-requests" className="space-y-6">
                <CustomRequestsTab />
              </TabsContent>

              <TabsContent value="favourite" className="space-y-6">
                <ProfileFavoriteCard />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
}
