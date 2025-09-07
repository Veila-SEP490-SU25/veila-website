'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Calendar, DollarSign, Package } from 'lucide-react';
import { toast } from 'sonner';
import { RequestSmartOtpDialog } from '@/components/request-smart-otp-dialog';
import { formatCurrency } from '@/lib/order-util';
import {
  useLazyGetSubscriptionsQuery,
  useRegisterMembershipMutation,
  useGetMyMembershipsQuery,
} from '@/services/apis';
import { ISubscription } from '@/services/types';
import Image from 'next/image';

interface MembershipPackagesDialogProps {
  trigger: React.ReactNode;
}

export function MembershipPackagesDialog({ trigger }: MembershipPackagesDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [getSubscriptions, { data: subscriptionsData, isLoading, error }] =
    useLazyGetSubscriptionsQuery();

  const [registerMembership, { isLoading: isRegistering }] = useRegisterMembershipMutation();
  const { data: membershipsData } = useGetMyMembershipsQuery();

  useEffect(() => {
    if (open) {
      getSubscriptions({ page: 0, size: 100, filter: '', sort: '' });
    }
  }, [open, getSubscriptions]);

  // Refresh data khi membership thay đổi
  useEffect(() => {
    if (open) {
      // Refresh subscriptions và memberships
      getSubscriptions({ page: 0, size: 100, filter: '', sort: '' });
    }
  }, [open, getSubscriptions, membershipsData]);

  const parseImages = (images: string) => {
    try {
      return JSON.parse(images);
    } catch {
      return [];
    }
  };

  const handleRegisterMembership = async (subscription: ISubscription, otp: string) => {
    try {
      const currentMembership = membershipsData?.item;

      let force = false;
      if (!currentMembership) {
        force = true;
      } else if (
        currentMembership.subscription &&
        subscription.amount > currentMembership.subscription.amount
      ) {
        force = true;
      }

      const result = await registerMembership({
        subscriptionId: subscription.id,
        force,
        otp,
      }).unwrap();

      if (result) {
        toast.success('Đăng ký gói dịch vụ thành công!');
        setOpen(false); // Đóng dialog
        // Chuyển về profile và reload page
        router.push('/profile');
        window.location.reload();
        return true;
      }
      return false;
    } catch (error: any) {
      // Xử lý error message an toàn
      let errorMessage = 'Đăng ký gói dịch vụ thất bại!';
      if (error?.data?.message) {
        errorMessage =
          typeof error.data.message === 'string'
            ? error.data.message
            : 'Đăng ký gói dịch vụ thất bại!';
      }

      toast.error(errorMessage);
      return false;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="!w-[98vw] !max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-6 w-6" />
            Chọn Gói Thành Viên
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {error ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Có lỗi xảy ra</h3>
                <p className="text-gray-600">
                  Không thể tải danh sách gói dịch vụ. Vui lòng thử lại sau.
                </p>
              </CardContent>
            </Card>
          ) : isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-gray-600">Đang tải danh sách gói dịch vụ...</p>
            </div>
          ) : !subscriptionsData?.items || subscriptionsData.items.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Không có gói dịch vụ nào
                </h3>
                <p className="text-gray-600">
                  Hiện tại không có gói dịch vụ nào khả dụng. Vui lòng liên hệ admin để được hỗ trợ.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Chọn gói dịch vụ phù hợp với nhu cầu của bạn
                </p>
                <Badge variant="outline" className="text-green-600 border-green-300">
                  {subscriptionsData?.items?.length || 0} gói có sẵn
                </Badge>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {subscriptionsData?.items?.map((subscription: ISubscription) => (
                  <Card
                    key={subscription.id}
                    className="hover:shadow-lg transition-shadow border-2 hover:border-green-300 h-full flex flex-col"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        {/* Package Name and Duration */}
                        <div className="flex-1 min-w-0 pr-4">
                          <CardTitle className="text-xl font-bold text-gray-900 mb-2 break-words">
                            {subscription.name}
                          </CardTitle>
                          <Badge variant="outline" className="text-blue-600 border-blue-300">
                            <Calendar className="h-3 w-3 mr-1" />
                            {subscription.duration}
                          </Badge>
                        </div>

                        {/* Price */}
                        <div className="text-right flex-shrink-0">
                          <div className="text-3xl font-bold text-green-600">
                            {formatCurrency(subscription.amount)}
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-6 flex-1 flex flex-col">
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
                      <p className="text-gray-600 leading-relaxed">{subscription.description}</p>

                      {/* Features */}
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">Mở khóa tất cả tính năng shop</span>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">Quản lý đơn hàng không giới hạn</span>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">Hỗ trợ khách hàng 24/7</span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="mt-auto pt-6">
                        <RequestSmartOtpDialog
                          message={`Nhập mã PIN để đăng ký gói ${subscription.name}`}
                          onConfirm={async (otp: string) => {
                            return await handleRegisterMembership(subscription, otp);
                          }}
                          trigger={
                            <Button
                              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3"
                              disabled={isRegistering}
                            >
                              <DollarSign className="h-4 w-4 mr-2" />
                              {isRegistering ? 'Đang đăng ký...' : 'Đăng ký ngay'}
                            </Button>
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
