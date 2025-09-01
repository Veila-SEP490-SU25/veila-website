"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetCustomOrderRequestByIdQuery } from "@/services/apis/custom-order.api";

import { formatDateDetailed } from "@/utils/format";
import {
  ArrowLeft,
  Calendar,
  User,
  Ruler,
  MessageCircle,
  Eye,
  Download,
} from "lucide-react";

export function CustomOrderDetail() {
  const params = useParams();
  const router = useRouter();
  const requestId = params.id as string;

  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useGetCustomOrderRequestByIdQuery(requestId, {
    skip: !requestId,
    refetchOnMountOrArgChange: true,
  });

  const request = response?.item;

  const handleChat = () => {
    router.push(`/chat?requestId=${requestId}`);
  };

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="h-12 w-12 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-lg font-medium">Đang tải thông tin yêu cầu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error("CustomOrderDetail - Detailed error:", error);
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-muted-foreground mb-4">
            <User className="h-12 w-12 mx-auto opacity-50" />
            <p className="text-lg font-medium mb-2">Lỗi khi tải dữ liệu</p>
            <p className="text-sm text-red-600">
              Có lỗi xảy ra khi tải thông tin yêu cầu
            </p>
            <pre className="text-xs mt-2 p-2 bg-gray-100 rounded text-left overflow-auto">
              {JSON.stringify(error, null, 2)}
            </pre>
          </div>
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-muted-foreground mb-4">
            <User className="h-12 w-12 mx-auto opacity-50" />
            <p className="text-lg font-medium mb-2">Không tìm thấy yêu cầu</p>
            <p className="text-sm">
              Yêu cầu này có thể đã bị xóa hoặc không tồn tại
            </p>
          </div>
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-12">
      <div className="flex items-center justify-between">
        <Button onClick={handleBack} variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          Tải lại
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2">
                    {request.title}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDateDetailed(request.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                {request.description}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ruler className="h-5 w-5" />
                Số đo chi tiết
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {request.height}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Chiều cao (cm)
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {request.weight}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Cân nặng (kg)
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {request.bust}
                  </div>
                  <div className="text-sm text-muted-foreground">Ngực (cm)</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {request.waist}
                  </div>
                  <div className="text-sm text-muted-foreground">Eo (cm)</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {request.hip}
                  </div>
                  <div className="text-sm text-muted-foreground">Mông (cm)</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {request.armpit}
                  </div>
                  <div className="text-sm text-muted-foreground">Nách (cm)</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {request.bicep}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Bắp tay (cm)
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {request.neck}
                  </div>
                  <div className="text-sm text-muted-foreground">Cổ (cm)</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {request.shoulderWidth}
                  </div>
                  <div className="text-sm text-muted-foreground">Vai (cm)</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {request.sleeveLength}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Tay áo (cm)
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {request.backLength}
                  </div>
                  <div className="text-sm text-muted-foreground">Lưng (cm)</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {request.lowerWaist}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Eo dưới (cm)
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {request.waistToFloor}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Eo đến sàn (cm)
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {(request.material ||
            request.color ||
            request.length ||
            request.neckline ||
            request.sleeve) && (
            <Card>
              <CardHeader>
                <CardTitle>Thông tin thiết kế</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {request.material && (
                    <Badge variant="outline">{request.material}</Badge>
                  )}
                  {request.color && (
                    <Badge variant="outline">{request.color}</Badge>
                  )}
                  {request.length && (
                    <Badge variant="outline">{request.length}</Badge>
                  )}
                  {request.neckline && (
                    <Badge variant="outline">{request.neckline}</Badge>
                  )}
                  {request.sleeve && (
                    <Badge variant="outline">{request.sleeve}</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {request.images && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Hình ảnh tham khảo
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Tải xuống
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {request.images.split(",").map((image, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={image.trim()}
                        alt={`Hình ảnh ${index + 1}`}
                        width={200}
                        height={120}
                        className="w-full h-48 object-cover rounded-lg border cursor-pointer hover:opacity-90 transition-opacity"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => window.open(image.trim(), "_blank")}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hành động nhanh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={handleChat} className="w-full">
                <MessageCircle className="h-4 w-4 mr-2" />
                Nhắn tin ngay
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thông tin yêu cầu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ngày tạo:</span>
                <span>{formatDateDetailed(request.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cập nhật:</span>
                <span>{formatDateDetailed(request.updatedAt)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
