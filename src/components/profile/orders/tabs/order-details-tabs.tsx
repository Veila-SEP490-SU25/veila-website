import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Eye, Settings, MapPin, Phone, Mail } from "lucide-react";
import { IOrder, IOrderDressDetail } from "@/services/types";
import {
  formatCurrency,
  formatDateShort,
  getTypeText,
  parseImages,
} from "@/lib/orders/order-util";
import { ImageGallery } from "@/components/image-gallery";

interface OrderDetailsTabProps {
  order: IOrder;
  currentOrderDressDetail: IOrderDressDetail | null;
}

export const OrderDetailsTab = ({
  order,
  currentOrderDressDetail,
}: OrderDetailsTabProps) => {
  return (
    <div className="space-y-4">
      {/* Order Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>Thông tin đơn hàng</span>
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
                Tổng tiền
              </label>
              <p className="font-bold text-lg text-green-600">
                {formatCurrency(order.amount)}
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">
                Ngày giao hàng
              </label>
              <p className="font-medium">{formatDateShort(order.dueDate)}</p>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">
                Mua lại
              </label>
              <Badge
                variant={order.isBuyBack ? "default" : "secondary"}
                className="w-fit"
              >
                {order.isBuyBack ? "Có" : "Không"}
              </Badge>
            </div>
          </div>

          {/* Product Details */}
          {currentOrderDressDetail && currentOrderDressDetail.dress && (
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Sản phẩm
              </h4>
              <div className="flex items-start space-x-4 p-4 border rounded-lg bg-gray-50/50">
                <ImageGallery
                  images={
                    parseImages(currentOrderDressDetail.dress?.images) || []
                  }
                  alt={currentOrderDressDetail.dress?.name || "Sản phẩm"}
                />
                <div className="flex-1 min-w-0">
                  <h5 className="font-semibold text-lg">
                    {currentOrderDressDetail.dress?.name || ""}
                  </h5>
                  <p className="text-sm text-muted-foreground mt-1">
                    {currentOrderDressDetail.dress?.description || ""}
                  </p>
                  <p className="font-bold text-lg text-green-600 mt-2">
                    {formatCurrency(currentOrderDressDetail.price)}
                  </p>
                </div>
              </div>
              {currentOrderDressDetail.description && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <label className="text-sm font-semibold text-blue-800 block mb-1">
                    Yêu cầu đặc biệt
                  </label>
                  <p className="text-sm text-blue-700">
                    {currentOrderDressDetail.description}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Services */}
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
