"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Clock, CheckCircle, XCircle, Eye, EyeOff } from "lucide-react";
import { CreateCustomRequestDialog } from "@/components/profile/custom-requests/create-custom-request-dialog";
import { useGetMyCustomRequestsQuery, ICustomRequest } from "@/services/apis";
import { formatDateShort } from "@/lib/order-util";
import { toast } from "sonner";

export const CustomRequestsTab = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  // Fetch custom requests
  const [getMyCustomRequests, { data: requestsData, isLoading }] = useGetMyCustomRequestsQuery();
  const requests = requestsData?.items || [];

  const getStatusBadge = (status: string, isPrivate: boolean) => {
    if (isPrivate) {
      return {
        text: "Riêng tư",
        className: "bg-gray-600 text-white",
        icon: EyeOff,
      };
    }
    
    switch (status) {
      case "DRAFT":
        return {
          text: "Nháp",
          className: "bg-yellow-600 text-white",
          icon: FileText,
        };
      case "SUBMIT":
        return {
          text: "Đã đăng",
          className: "bg-green-600 text-white",
          icon: CheckCircle,
        };
      default:
        return {
          text: status,
          className: "bg-gray-600 text-white",
          icon: FileText,
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Yêu cầu đặt may</h2>
          <p className="text-gray-600 mt-1">
            Quản lý các yêu cầu đặt may tùy chỉnh của bạn
          </p>
        </div>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-rose-600 hover:bg-rose-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Đăng yêu cầu mới
        </Button>
      </div>

                {/* Content */}
          <div className="space-y-4">
            {isLoading ? (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-rose-600 border-t-transparent mx-auto mb-4"></div>
                  <p className="text-gray-600">Đang tải yêu cầu...</p>
                </CardContent>
              </Card>
            ) : requests.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Yêu cầu đặt may
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Chưa có yêu cầu nào
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Bạn chưa có yêu cầu đặt may nào. Hãy tạo yêu cầu đầu tiên!
                    </p>
                    <Button
                      onClick={() => setIsCreateDialogOpen(true)}
                      className="bg-rose-600 hover:bg-rose-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Tạo yêu cầu đầu tiên
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {requests.map((request: ICustomRequest) => {
                  const statusBadge = getStatusBadge(request.status, request.isPrivate);
                  const Icon = statusBadge.icon;
                  
                  return (
                    <Card key={request.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {request.title}
                              </h3>
                              <Badge className={statusBadge.className}>
                                <Icon className="h-3 w-3 mr-1" />
                                {statusBadge.text}
                              </Badge>
                            </div>
                            <p className="text-gray-600 mb-3 line-clamp-2">
                              {request.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {formatDateShort(request.createdAt)}
                              </span>
                              <span>Chiều cao: {request.height}cm</span>
                              <span>Cân nặng: {request.weight}kg</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                // TODO: Implement edit functionality
                                toast.info("Tính năng chỉnh sửa sẽ được phát triển sau");
                              }}
                            >
                              Chỉnh sửa
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                // TODO: Implement view details functionality
                                toast.info("Tính năng xem chi tiết sẽ được phát triển sau");
                              }}
                            >
                              Xem chi tiết
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

      {/* Create Custom Request Dialog */}
      <CreateCustomRequestDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
};
