"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Calendar, DollarSign, Package } from "lucide-react";
import { toast } from "sonner";
import { RequestSmartOtpDialog } from "@/components/request-smart-otp-dialog";
import { formatCurrency } from "@/lib/order-util";
import { useLazyGetSubscriptionsQuery } from "@/services/apis";
import { ISubscription } from "@/services/types";

interface MembershipPackagesDialogProps {
  trigger: React.ReactNode;
}

export function MembershipPackagesDialog({ trigger }: MembershipPackagesDialogProps) {
  const [open, setOpen] = useState(false);
  const [getSubscriptions, { data: subscriptionsData, isLoading, error }] = useLazyGetSubscriptionsQuery();

  useEffect(() => {
    if (open) {
      getSubscriptions({ page: 0, size: 100, filter: null, sort: null });
    }
  }, [open, getSubscriptions]);

  const parseImages = (images: string) => {
    try {
      return JSON.parse(images);
    } catch {
      return [];
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
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
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Có lỗi xảy ra
                </h3>
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
                  Hiện tại không có gói dịch vụ nào khả dụng. Vui lòng liên hệ
                  admin để được hỗ trợ.
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subscriptionsData?.items?.map((subscription: ISubscription) => (
                  <Card
                    key={subscription.id}
                    className="hover:shadow-lg transition-shadow border-2 hover:border-green-300"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <CardTitle className="text-lg leading-tight">
                            {subscription.name}
                          </CardTitle>
                          <Badge
                            variant="outline"
                            className="text-blue-600 border-blue-300"
                          >
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
                      {subscription.images &&
                        parseImages(subscription.images).length > 0 && (
                          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                            <img
                              src={parseImages(subscription.images)[0]}
                              alt={subscription.name}
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
                        onConfirm={async (smartOtp: string) => {
                          // TODO: Implement subscription registration logic
                          toast.success("Đăng ký gói dịch vụ thành công!");
                          return true;
                        }}
                        trigger={
                          <Button className="w-full bg-green-600 hover:bg-green-700">
                            <DollarSign className="h-4 w-4 mr-2" />
                            Đăng ký ngay
                          </Button>
                        }
                      />
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
