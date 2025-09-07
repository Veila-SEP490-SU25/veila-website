"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Settings, MapPin, Phone, Mail, Package, Tag } from "lucide-react";
import { IOrder, IOrderDressDetail } from "@/services/types";
import { ImageGallery } from "@/components/image-gallery";
import { formatCurrency } from "@/lib/order-util";
import { formatDateOnly } from "@/utils/format";
import { EditOrderDialog } from "./edit-order-dialog";

interface OrderDetailsTabProps {
  order: IOrder;
  currentDress?: any;
  currentOrderDressDetail?: IOrderDressDetail | null;
  onUpdate?: () => void;
}

const parseImages = (
  images: string | string[] | null | undefined
): string[] => {
  if (Array.isArray(images)) {
    return images;
  }
  if (typeof images === "string") {
    return images
      .split(",")
      .map((img) => img.trim())
      .filter((img) => img.length > 0);
  }
  return [];
};

const getTypeText = (type: string) => {
  switch (type) {
    case "SELL":
      return "Bán hàng";
    case "RENT":
      return "Cho thuê";
    case "CUSTOM":
      return "Đặt may";
    default:
      return type;
  }
};

export const OrderDetailsTab = ({
  order,
  currentDress,
  currentOrderDressDetail,
  onUpdate,
}: OrderDetailsTabProps) => {
  return (
    <div className="space-y-6">
      {/* Order Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5" />
              <span>Thông tin đơn hàng</span>
            </div>
            <EditOrderDialog order={order} onUpdate={onUpdate} />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">
                Loại đơn hàng
              </label>
              <p className="font-medium">{getTypeText(order.type)}</p>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">
                Shop
              </label>
              <p className="font-medium text-blue-600">
                {currentDress?.dress?.user?.shop?.name ||
                  currentOrderDressDetail?.dress?.user?.shop?.name ||
                  order.shop?.name ||
                  "Không xác định"}
              </p>
            </div>
            <div className="space-y-1">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-blue-700">
                    {order.type === "RENT" ? "Tiền thuê" : "Tiền mua"}
                  </label>
                  <p className="font-bold text-lg text-blue-900">
                    {formatCurrency(order.amount)}
                  </p>
                </div>

                {order.type === "RENT" && parseFloat(order.deposit) > 0 && (
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-blue-700">
                      Tiền cọc
                    </label>
                    <p className="font-bold text-lg text-orange-600">
                      {formatCurrency(parseFloat(order.deposit))}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">
                Ngày giao hàng
              </label>
              <p className="font-medium">{formatDateOnly(order.dueDate)}</p>
            </div>
          </div>

          {(currentDress ||
            (currentOrderDressDetail && currentOrderDressDetail.dress)) && (
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Sản phẩm
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-gray-50/50">
                {/* Hình ảnh */}
                <div className="md:col-span-1">
                  {currentDress?.dress?.images ||
                  currentOrderDressDetail?.dress?.images ? (
                    <ImageGallery
                      images={
                        parseImages(
                          currentDress?.dress?.images ||
                            currentOrderDressDetail?.dress?.images
                        ) || []
                      }
                      alt={
                        currentDress?.dress?.name ||
                        currentOrderDressDetail?.dress?.name ||
                        "Váy cưới"
                      }
                    />
                  ) : (
                    <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm text-gray-500">
                        Không có hình
                      </span>
                    </div>
                  )}
                </div>

                {/* Thông tin sản phẩm */}
                <div className="md:col-span-2 space-y-4">
                  {/* Header với tên và mã đơn hàng */}
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                    <div className="flex-1">
                      <h5 className="font-semibold text-xl text-gray-900 break-words">
                        {currentDress?.dress?.name ||
                          currentOrderDressDetail?.dress?.name ||
                          "Váy cưới"}
                      </h5>
                      {!currentDress?.dress?.name &&
                        !currentOrderDressDetail?.dress?.name && (
                          <p className="text-xs text-orange-600 mt-1">
                            ⚠️ Tên váy chưa được cập nhật
                          </p>
                        )}
                    </div>
                    <Badge
                      variant="outline"
                      className="text-sm px-3 py-1 shrink-0"
                    >
                      #{order.id.slice(-8)}
                    </Badge>
                  </div>

                  <div className="bg-white p-3 rounded-lg border">
                    <p className="text-sm text-gray-700 break-words">
                      {currentDress?.dress?.description ||
                        currentOrderDressDetail?.dress?.description ||
                        "Không có mô tả"}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">
                          Shop
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-blue-900 break-words">
                        {currentDress?.dress?.user?.shop?.name ||
                          currentOrderDressDetail?.dress?.user?.shop?.name ||
                          order.shop?.name ||
                          "Không xác định"}
                      </p>
                    </div>

                    {/* Giá cả */}
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Tag className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">
                          {order.type === "RENT" ? "Giá thuê" : "Giá mua"}
                        </span>
                      </div>
                      <p className="text-xl font-bold text-green-700">
                        {formatCurrency(
                          currentOrderDressDetail?.price || order.amount || 0
                        )}
                      </p>
                      {order.type === "RENT" &&
                        parseFloat(order.deposit) > 0 && (
                          <div className="mt-2 pt-2 border-t border-green-200">
                            <p className="text-xs text-green-600">Tiền cọc:</p>
                            <p className="text-sm font-semibold text-green-700">
                              {formatCurrency(parseFloat(order.deposit))}
                            </p>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
              {currentOrderDressDetail?.description && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <label className="text-sm font-semibold text-blue-800 block mb-1">
                    Yêu cầu đặc biệt
                  </label>
                  <p className="text-sm text-blue-700">
                    {currentOrderDressDetail?.description}
                  </p>
                </div>
              )}
            </div>
          )}

          {order.orderServiceDetail && (
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Dịch vụ
              </h4>
              <div className="p-4 border rounded-lg bg-gray-50/50">
                <h5 className="font-semibold text-lg">
                  {order.orderServiceDetail.service.name}
                </h5>
                <p className="text-sm text-muted-foreground mt-1">
                  {order.orderServiceDetail.service.description}
                </p>
                <p className="font-bold text-lg text-green-600 mt-2">
                  {formatCurrency(order.orderServiceDetail.price)}
                </p>
                {order.orderServiceDetail.request && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <label className="text-sm font-semibold text-blue-800 block mb-1">
                      Yêu cầu
                    </label>
                    <p className="text-sm font-medium text-blue-700">
                      {order.orderServiceDetail.request.title}
                    </p>
                    {order.orderServiceDetail.request.description && (
                      <p className="text-sm text-blue-600 mt-1">
                        {order.orderServiceDetail.request.description}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Thông tin liên hệ</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Phone className="h-5 w-5 text-green-600 shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Điện thoại</p>
                <p className="font-medium">{order.phone}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="h-5 w-5 text-blue-600 shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium truncate">{order.email}</p>
              </div>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <MapPin className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Địa chỉ</p>
              <p className="font-medium">{order.address}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
