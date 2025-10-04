'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';
import { AlertTriangle, Package, Calendar, DollarSign, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  useLazyGetSubscriptionsQuery,
  useRegisterMembershipMutation,
  useLazyGetMyMembershipsQuery,
} from '@/services/apis';
import { ISubscription } from '@/services/types';
import { RequestSmartOtpDialog } from '@/components/request-smart-otp-dialog';

export const SuspendedShopDashboard = () => {
  const [subscriptions, setSubscriptions] = useState<ISubscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [getSubscriptions] = useLazyGetSubscriptionsQuery();
  const [registerMembership] = useRegisterMembershipMutation();

  // Lấy thông tin membership hiện tại để so sánh
  const [getMyMemberships, { data: membershipsData }] = useLazyGetMyMembershipsQuery();

  // fetch memberships on mount
  useEffect(() => {
    getMyMemberships();
  }, [getMyMemberships]);

  const fetchSubscriptions = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getSubscriptions({
        page: 0,
        size: 100,
        sort: 'amount:asc',
        filter: '',
      }).unwrap();

      if (response.statusCode === 200) {
        setSubscriptions(response.items || []);
      } else {
        toast.error('Không thể tải danh sách gói đăng ký', {
          description: response.message,
        });
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      toast.error('Có lỗi xảy ra khi tải gói đăng ký');
    } finally {
      setIsLoading(false);
    }
  }, [getSubscriptions]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const parseImages = (images: string | null): string[] => {
    if (!images) return [];
    return images
      .split(',')
      .map((img) => img.trim())
      .filter((img) => img.length > 0);
  };

  const handleRegisterMembership = async (
    subscription: ISubscription,
    smartOtp: string,
  ): Promise<boolean> => {
    try {
      // Lấy membership hiện tại để so sánh
      const currentMembership = membershipsData?.item;

      // Logic để xác định force dựa trên gói hiện tại:
      // - Chưa có gói nào: force = true (không có gì để hủy)
      // - Nếu gói mới xịn hơn gói hiện tại (giá cao hơn) thì force = true
      //   -> Tự động hủy gói hiện tại và đăng ký gói mới
      // - Nếu gói mới nhỏ hơn gói hiện tại (giá thấp hơn) thì force = false
      //   -> Không cho đăng ký, hiển thị thông báo lỗi
      // - Nếu gói bằng nhau thì force = false
      //   -> Không cần hủy gói hiện tại

      let force = false;
      let canRegister = true;

      if (currentMembership && currentMembership.subscription) {
        const currentAmount = currentMembership.subscription.amount || 0;
        const newAmount = subscription.amount || 0;

        if (newAmount > currentAmount) {
          // Gói mới lớn hơn -> cho phép đăng ký với force = true
          force = true;
          canRegister = true;
        } else if (newAmount < currentAmount) {
          // Gói mới nhỏ hơn -> không cho đăng ký
          canRegister = false;
          toast.error('Không thể đăng ký gói có giá trị thấp hơn gói hiện tại', {
            description: `Gói hiện tại: ${currentMembership.subscription.name} (${currentMembership.subscription.amount} VND)`,
          });
          return false;
        } else {
          // Gói bằng nhau -> không cần force
          force = false;
          canRegister = true;
        }
      } else {
        // Chưa có gói nào -> force = true (vì không có gì để hủy)
        force = true;
        canRegister = true;
      }

      if (!canRegister) {
        return false;
      }

      const result = await registerMembership({
        subscriptionId: subscription.id,
        force,
        otp: smartOtp,
      }).unwrap();

      if (result.statusCode === 200 || result.statusCode === 201) {
        toast.success('Đăng ký gói dịch vụ thành công!');
        // Chuyển về profile shop và reload page
        window.location.href = '/profile';
        window.location.reload();
      } else {
        toast.error(result.message || 'Có lỗi xảy ra khi đăng ký gói dịch vụ');
      }
      return true;
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(
        error?.data?.message || 'Có lỗi xảy ra khi đăng ký gói dịch vụ. Vui lòng thử lại sau.',
      );
      return false;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-10 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="h-8 w-8 text-orange-600" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-orange-800">
              Tài khoản Shop bị tạm ngưng
            </h1>
            <p className="text-muted-foreground">
              Tài khoản của bạn đã bị tạm ngưng. Vui lòng đăng ký gói dịch vụ để tiếp tục sử dụng.
            </p>
          </div>
        </div>

        <Alert className="border-orange-200 bg-orange-50/50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Lưu ý:</strong> Khi tài khoản bị tạm ngưng, bạn chỉ có thể truy cập trang
            Dashboard và Profile. Để mở khóa tất cả tính năng, vui lòng đăng ký gói dịch vụ phù hợp.
          </AlertDescription>
        </Alert>
      </div>

      {/* Subscriptions Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Gói dịch vụ có sẵn</h2>
          <Badge variant="outline" className="text-green-600 border-green-300">
            {subscriptions.length} gói
          </Badge>
        </div>

        {subscriptions.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Không có gói dịch vụ nào</h3>
              <p className="text-gray-600">
                Hiện tại không có gói dịch vụ nào khả dụng. Vui lòng liên hệ admin để được hỗ trợ.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subscriptions.map((subscription) => (
              <Card key={subscription.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-lg leading-tight">{subscription.name}</CardTitle>
                      <Badge variant="outline" className="text-blue-600 border-blue-300">
                        <Calendar className="h-3 w-3 mr-1" />
                        {subscription.duration}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(subscription.amount)}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Images */}
                  {subscription.images && parseImages(subscription.images).length > 0 && (
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={parseImages(subscription.images)[0]}
                        alt={subscription.name}
                        width={400}
                        height={225}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {subscription.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Mở khóa tất cả tính năng shop</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Quản lý đơn hàng không giới hạn</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Hỗ trợ khách hàng 24/7</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <RequestSmartOtpDialog
                    message={`Nhập mã PIN để đăng ký gói ${subscription.name}`}
                    trigger={
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Đăng ký ngay
                      </Button>
                    }
                    onConfirm={(smartOtp) => handleRegisterMembership(subscription, smartOtp)}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Additional Info */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Package className="h-4 w-4 text-blue-600" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-blue-800">Cần hỗ trợ thêm?</h3>
              <p className="text-sm text-blue-700">
                Nếu bạn cần tư vấn về gói dịch vụ hoặc gặp vấn đề với tài khoản, vui lòng liên hệ
                đội ngũ hỗ trợ của chúng tôi qua email hoặc hotline.
              </p>
              <div className="flex items-center space-x-4 text-sm text-blue-600">
                <span>📧 veila.studio.mail@gmail.com</span>
                <span>📞 0966316803</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
