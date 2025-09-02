"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Ruler, Package, Settings, Tag } from "lucide-react";
import { IOrderDressDetail, IOrder, OrderType } from "@/services/types";
import { formatCurrency } from "@/lib/order-util";

interface MeasurementsTabProps {
  currentOrderDressDetail: IOrderDressDetail | null;
  order: IOrder;
  orderDressDetails?: any[];
  orderAccessories?: any[];
  orderServiceDetails?: any;
}

export const MeasurementsTab = ({
  currentOrderDressDetail,
  order,
  orderDressDetails = [],
  orderAccessories = [],
  orderServiceDetails,
}: MeasurementsTabProps) => {
  const measurementFields = [
    {
      label: "Chiều cao",
      value: currentOrderDressDetail?.height,
      unit: "cm",
      icon: "📏",
    },
    {
      label: "Cân nặng",
      value: currentOrderDressDetail?.weight,
      unit: "kg",
      icon: "⚖️",
    },
    {
      label: "Vòng ngực",
      value: currentOrderDressDetail?.bust,
      unit: "cm",
      icon: "👗",
    },
    {
      label: "Vòng eo",
      value: currentOrderDressDetail?.waist,
      unit: "cm",
      icon: "👗",
    },
    {
      label: "Vòng hông",
      value: currentOrderDressDetail?.hip,
      unit: "cm",
      icon: "👗",
    },
    {
      label: "Nách",
      value: currentOrderDressDetail?.armpit,
      unit: "cm",
      icon: "👕",
    },
    {
      label: "Bắp tay",
      value: currentOrderDressDetail?.bicep,
      unit: "cm",
      icon: "💪",
    },
    {
      label: "Cổ",
      value: currentOrderDressDetail?.neck,
      unit: "cm",
      icon: "👔",
    },
    {
      label: "Vai",
      value: currentOrderDressDetail?.shoulderWidth,
      unit: "cm",
      icon: "👕",
    },
    {
      label: "Tay áo",
      value: currentOrderDressDetail?.sleeveLength,
      unit: "cm",
      icon: "👕",
    },
    {
      label: "Dài lưng",
      value: currentOrderDressDetail?.backLength,
      unit: "cm",
      icon: "👗",
    },
    {
      label: "Eo thấp",
      value: currentOrderDressDetail?.lowerWaist,
      unit: "cm",
      icon: "📐",
    },
    {
      label: "Eo xuống sàn",
      value: currentOrderDressDetail?.waistToFloor,
      unit: "cm",
      icon: "📐",
    },
  ];

  // Đơn hàng custom - hiển thị thông tin dịch vụ
  if (order.type === OrderType.CUSTOM) {
    return (
      <div className="space-y-6">
        {/* Thông tin dịch vụ */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Thông tin dịch vụ</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Chi tiết dịch vụ đặt may
            </p>
          </CardHeader>
          <CardContent>
            {orderServiceDetails ? (
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-blue-50/50">
                  <h4 className="font-semibold text-lg mb-2">
                    {orderServiceDetails.service?.name || "Dịch vụ đặt may"}
                  </h4>
                  <p className="text-sm text-gray-700 mb-3">
                    {orderServiceDetails.service?.description ||
                      "Không có mô tả"}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Giá dịch vụ:</span>
                    <span className="font-bold text-lg text-green-600">
                      {formatCurrency(orderServiceDetails.price || 0)}
                    </span>
                  </div>
                </div>

                {orderServiceDetails.request && (
                  <div className="p-4 border rounded-lg bg-orange-50/50">
                    <h5 className="font-semibold text-blue-800 mb-2">
                      Yêu cầu đặc biệt
                    </h5>
                    <p className="text-sm text-blue-700 mb-2">
                      {orderServiceDetails.request.title}
                    </p>
                    {orderServiceDetails.request.description && (
                      <p className="text-sm text-blue-600">
                        {orderServiceDetails.request.description}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Settings className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-muted-foreground">
                  Chưa có thông tin dịch vụ
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Đơn hàng mua/thuê - hiển thị thông tin váy và phụ kiện
  return (
    <div className="space-y-6">
      {/* Thông tin váy */}
      {orderDressDetails && orderDressDetails.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Thông tin váy</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Chi tiết sản phẩm đã đặt
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orderDressDetails.map((dressDetail, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg bg-gray-50/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-lg">
                      {dressDetail.dress?.name || `Váy #${index + 1}`}
                    </h4>
                    <Badge variant="outline" className="text-sm">
                      {formatCurrency(dressDetail.price || 0)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">
                    {dressDetail.dress?.description || "Không có mô tả"}
                  </p>
                  {dressDetail.description && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-700">
                        <span className="font-medium">Yêu cầu đặc biệt:</span>{" "}
                        {dressDetail.description}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Danh sách phụ kiện */}
      {orderAccessories && orderAccessories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Tag className="h-5 w-5" />
              <span>Danh sách phụ kiện</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground">Các phụ kiện đi kèm</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {orderAccessories.map((accessory, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg bg-green-50/50"
                >
                  <div>
                    <h5 className="font-medium">
                      {accessory.accessory?.name || `Phụ kiện #${index + 1}`}
                    </h5>
                    <p className="text-sm text-gray-600">
                      {accessory.accessory?.description || "Không có mô tả"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      {formatCurrency(accessory.price || 0)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Số lượng: {accessory.quantity || 1}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Số đo cơ thể (nếu có) */}
      {currentOrderDressDetail && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Ruler className="h-5 w-5" />
              <span>Số đo cơ thể</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Thông tin số đo chi tiết cho việc may đo
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {measurementFields.map((measurement) => (
                <div
                  key={measurement.label}
                  className="p-3 border rounded-lg bg-gray-50/50"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{measurement.icon}</span>
                    <label className="text-sm font-medium text-muted-foreground">
                      {measurement.label}
                    </label>
                  </div>
                  <p className="font-semibold text-lg">
                    {measurement.value ? (
                      <span className="text-blue-600">
                        {measurement.value} {measurement.unit}
                      </span>
                    ) : (
                      <span className="text-gray-400">Chưa đo</span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fallback khi không có thông tin */}
      {!orderDressDetails?.length &&
        !orderAccessories?.length &&
        !currentOrderDressDetail && (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">
                Chưa có thông tin chi tiết
              </h3>
              <p className="text-muted-foreground">
                Thông tin sản phẩm và phụ kiện sẽ được cập nhật sau.
              </p>
            </CardContent>
          </Card>
        )}
    </div>
  );
};
