'use client';

import { toast } from 'sonner';
import { Crown, Calendar, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useGetMyMembershipsQuery } from '@/services/apis';
import { MembershipStatus } from '@/services/types';
import { MembershipPackagesDialog } from './membership-packages-dialog';

export const MembershipInfo = () => {
  const { data: membershipsData, isLoading, error } = useGetMyMembershipsQuery();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const getStatusBadge = (status: MembershipStatus) => {
    switch (status) {
      case MembershipStatus.ACTIVE:
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Đang hoạt động
          </Badge>
        );
      case MembershipStatus.INACTIVE:
        return (
          <Badge variant="outline" className="text-gray-600 border-gray-300">
            <XCircle className="h-3 w-3 mr-1" />
            Đã kết thúc
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-gray-600 border-gray-300">
            <AlertCircle className="h-3 w-3 mr-1" />
            Không xác định
          </Badge>
        );
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Có lỗi xảy ra khi tải thông tin gói dịch vụ. Vui lòng thử lại sau.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // API trả về IItemResponse<IMembership> nên dùng .item thay vì .items
  const membership = membershipsData?.item;
  const hasActiveMembership = membership && membership.status === MembershipStatus.ACTIVE;

  if (!membership) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Crown className="h-5 w-5 text-yellow-600" />
              <span>Gói dịch vụ</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Crown className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có gói dịch vụ nào</h3>
            <p className="text-gray-600 mb-4">
              Bạn chưa đăng ký gói dịch vụ nào. Hãy đăng ký để mở khóa tất cả tính năng.
            </p>
            <Button
              className="bg-yellow-600 hover:bg-yellow-700"
              onClick={() => (window.location.href = '/shops/my')}
            >
              <Crown className="h-4 w-4 mr-2" />
              Đăng ký gói dịch vụ
            </Button>
          </CardContent>
        </Card>

        {/* Rules Info for new users */}
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center">
                <AlertCircle className="h-4 w-4 text-blue-600" />
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-blue-800">Quy tắc đăng ký gói dịch vụ</h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>
                    • <strong>Có thể đăng ký gói mới ngay cả khi đang có gói hoạt động</strong>
                  </p>
                  <p>
                    • <strong>Gói mới phải có giá trị lớn hơn gói hiện tại để được đăng ký</strong>
                  </p>
                  <p>
                    • <strong>Gói cũ sẽ tự động bị hủy khi đăng ký gói mới (force = true)</strong>
                  </p>
                  <p>
                    • <strong>Không thể gia hạn gói đang hoạt động</strong>
                  </p>
                  <p>
                    • <strong>Có thể đăng ký gói mới bất cứ lúc nào nếu đáp ứng điều kiện</strong>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Active Membership */}
      {membership && hasActiveMembership && (
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-800">
              <Crown className="h-5 w-5" />
              <span>Gói dịch vụ đang hoạt động</span>
              {getStatusBadge(membership.status)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Ngày bắt đầu</p>
                  <p className="font-medium">{formatDate(membership.startDate)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Ngày kết thúc</p>
                  <p className="font-medium">{formatDate(membership.endDate)}</p>
                </div>
              </div>
            </div>

            {membership.subscription && (
              <div className="pt-4 border-t border-green-200">
                <h4 className="font-medium text-green-800 mb-2">
                  Thông tin gói: {membership.subscription.name}
                </h4>
                <p className="text-sm text-green-700">{membership.subscription.description}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Rules Info */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-blue-600" />
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-blue-800">Quy tắc đăng ký gói dịch vụ</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p>
                  • <strong>Có thể đăng ký gói mới ngay cả khi đang có gói hoạt động</strong>
                </p>
                <p>
                  • <strong>Gói mới phải có giá trị lớn hơn gói hiện tại để được đăng ký</strong>
                </p>
                <p>
                  • <strong>Gói cũ sẽ tự động bị hủy khi đăng ký gói mới (force = true)</strong>
                </p>
                <p>
                  • <strong>Không thể gia hạn gói đang hoạt động</strong>
                </p>
                <p>
                  • <strong>Có thể đăng ký gói mới bất cứ lúc nào nếu đáp ứng điều kiện</strong>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-center space-x-4">
        {hasActiveMembership && (
          <Button
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-50"
            onClick={() => {
              // TODO: Implement cancel membership
              toast.info('Tính năng hủy gói sẽ được cập nhật sớm');
            }}
          >
            <XCircle className="h-4 w-4 mr-2" />
            Hủy gói hiện tại
          </Button>
        )}

        <MembershipPackagesDialog
          trigger={
            <Button className="bg-yellow-600 hover:bg-yellow-700">
              <Crown className="h-4 w-4 mr-2" />
              {hasActiveMembership ? 'Đăng ký gói mới' : 'Đăng ký gói dịch vụ'}
            </Button>
          }
        />

        {hasActiveMembership && (
          <Button
            variant="outline"
            disabled
            className="opacity-50 cursor-not-allowed"
            title="Không thể gia hạn gói đang hoạt động"
          >
            <Clock className="h-4 w-4 mr-2" />
            Gia hạn gói
          </Button>
        )}
      </div>
    </div>
  );
};
