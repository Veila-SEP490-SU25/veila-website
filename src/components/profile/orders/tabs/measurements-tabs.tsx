import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  IOrderDressDetail,
  IOrderAccessoryDetail,
  IOrderServiceDetail,
  OrderType,
} from "@/services/types";
import {
  Ruler,
  Weight,
  User,
  Shirt,
  MinusCircle as Muscle,
  Circle,
} from "lucide-react";

interface MeasurementsTabProps {
  currentOrderDressDetail: IOrderDressDetail | null;
  orderAccessories: IOrderAccessoryDetail[];
  orderService: IOrderServiceDetail | null;
  orderType: OrderType;
}

export const MeasurementsTab = ({
  currentOrderDressDetail,
  orderAccessories,
  orderService,
  orderType,
}: MeasurementsTabProps) => {
  if (
    (orderType === OrderType.CUSTOM && !orderService) ||
    (orderType !== OrderType.CUSTOM && !currentOrderDressDetail)
  ) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Ruler className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">
            Không có thông tin chi tiết
          </h3>
          <p className="text-muted-foreground">
            Đơn hàng này chưa có thông tin chi tiết về váy hoặc số đo cơ thể.
          </p>
        </CardContent>
      </Card>
    );
  }

  const measurements = [
    {
      label: "Chiều cao",
      value:
        orderType === OrderType.CUSTOM
          ? orderService?.request.height
          : currentOrderDressDetail?.height,
      unit: "cm",
      icon: <Ruler className="h-4 w-4 text-blue-500" />,
    },
    {
      label: "Cân nặng",
      value:
        orderType === OrderType.CUSTOM
          ? orderService?.request.weight
          : currentOrderDressDetail?.weight,
      unit: "kg",
      icon: <Weight className="h-4 w-4 text-green-500" />,
    },
    {
      label: "Vòng ngực",
      value:
        orderType === OrderType.CUSTOM
          ? orderService?.request.bust
          : currentOrderDressDetail?.bust,
      unit: "cm",
      icon: <User className="h-4 w-4 text-purple-500" />,
    },
    {
      label: "Vòng eo",
      value:
        orderType === OrderType.CUSTOM
          ? orderService?.request.waist
          : currentOrderDressDetail?.waist,
      unit: "cm",
      icon: <Circle className="h-4 w-4 text-orange-500" />,
    },
    {
      label: "Vòng hông",
      value:
        orderType === OrderType.CUSTOM
          ? orderService?.request.hip
          : currentOrderDressDetail?.hip,
      unit: "cm",
      icon: <Circle className="h-4 w-4 text-pink-500" />,
    },
    {
      label: "Nách",
      value:
        orderType === OrderType.CUSTOM
          ? orderService?.request.armpit
          : currentOrderDressDetail?.armpit,
      unit: "cm",
      icon: <Shirt className="h-4 w-4 text-indigo-500" />,
    },
    {
      label: "Bắp tay",
      value:
        orderType === OrderType.CUSTOM
          ? orderService?.request.bicep
          : currentOrderDressDetail?.bicep,
      unit: "cm",
      icon: <Muscle className="h-4 w-4 text-red-500" />,
    },
    {
      label: "Cổ",
      value:
        orderType === OrderType.CUSTOM
          ? orderService?.request.neck
          : currentOrderDressDetail?.neck,
      unit: "cm",
      icon: <Circle className="h-4 w-4 text-teal-500" />,
    },
    {
      label: "Vai",
      value:
        orderType === OrderType.CUSTOM
          ? orderService?.request.shoulderWidth
          : currentOrderDressDetail?.shoulderWidth,
      unit: "cm",
      icon: <Shirt className="h-4 w-4 text-cyan-500" />,
    },
    {
      label: "Tay áo",
      value:
        orderType === OrderType.CUSTOM
          ? orderService?.request.sleeveLength
          : currentOrderDressDetail?.sleeveLength,
      unit: "cm",
      icon: <Shirt className="h-4 w-4 text-amber-500" />,
    },
    {
      label: "Dài lưng",
      value:
        orderType === OrderType.CUSTOM
          ? orderService?.request.backLength
          : currentOrderDressDetail?.backLength,
      unit: "cm",
      icon: <Ruler className="h-4 w-4 text-emerald-500" />,
    },
    {
      label: "Eo thấp",
      value:
        orderType === OrderType.CUSTOM
          ? orderService?.request.lowerWaist
          : currentOrderDressDetail?.lowerWaist,
      unit: "cm",
      icon: <Ruler className="h-4 w-4 text-violet-500" />,
    },
    {
      label: "Eo xuống sàn",
      value:
        orderType === OrderType.CUSTOM
          ? orderService?.request.waistToFloor
          : currentOrderDressDetail?.waistToFloor,
      unit: "cm",
      icon: <Ruler className="h-4 w-4 text-rose-500" />,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Ruler className="h-5 w-5" />
          <span>Chi tiết đơn hàng</span>
        </CardTitle>
        <CardDescription>
          Thông tin chi tiết về váy và số đo cơ thể
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Dress Info */}
        {currentOrderDressDetail?.dress && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Thông tin váy</h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <strong className="text-blue-800 shrink-0">Tên váy:</strong>
                <p className="text-blue-800 truncate max-w-full">
                  {currentOrderDressDetail?.dress.name}
                </p>
              </div>
              <div className="flex items-start gap-2">
                <strong className="text-blue-800 shrink-0">Mô tả:</strong>
                <p className="text-blue-800 max-w-full break-words">
                  {currentOrderDressDetail?.dress.description ||
                    "Không có mô tả"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <strong className="text-blue-800 shrink-0">Giá:</strong>
                <span className="text-blue-800">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(Number(currentOrderDressDetail?.price))}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Service Info for Custom Orders */}
        {orderType === "CUSTOM" && orderService && (
          <div className="mb-6 p-4 bg-purple-50 rounded-lg">
            <h4 className="font-semibold text-purple-900 mb-3">
              Thông tin dịch vụ đặt may
            </h4>
            <div className="space-y-4">
              {/* Service Details */}
              <div className="p-3 bg-white rounded-lg border">
                <h5 className="font-medium text-purple-800 mb-2">
                  {orderService.service.name}
                </h5>
                <p className="text-sm text-purple-700 mb-2 break-words">
                  {orderService.service.description || "Không có mô tả"}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-purple-600">
                    Giá dịch vụ:{" "}
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(Number(orderService.price))}
                  </span>
                  <span className="text-purple-500 text-xs">
                    Đánh giá: {orderService.service.ratingAverage}/5 (
                    {orderService.service.ratingCount} đánh giá)
                  </span>
                </div>
              </div>

              {/* Custom Request Details */}
              <div className="p-3 bg-white rounded-lg border">
                <h5 className="font-medium text-purple-800 mb-2">
                  Yêu cầu đặt may
                </h5>
                <p className="text-sm text-purple-700 mb-2 break-words">
                  {orderService.request.description || "Không có mô tả"}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-purple-600">
                  <span>Chiều cao: {orderService.request.height}cm</span>
                  <span>Cân nặng: {orderService.request.weight}kg</span>
                  <span>Vòng ngực: {orderService.request.bust}cm</span>
                  <span>Vòng eo: {orderService.request.waist}cm</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Accessories Info */}
        {orderAccessories.length > 0 && (
          <div className="mb-6 p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-3">
              Phụ kiện đi kèm
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {orderAccessories.map((accessory) => (
                <div
                  key={accessory.id}
                  className="p-3 bg-white rounded-lg border"
                >
                  <div className="flex items-start justify-between mb-2 gap-2">
                    <h5 className="font-medium text-green-800 truncate flex-1 min-w-0">
                      {accessory.accessory.name}
                    </h5>
                    <span className="text-sm text-green-600 font-medium shrink-0">
                      x{accessory.quantity}
                    </span>
                  </div>
                  <p className="text-sm text-green-700 mb-2 break-words">
                    {accessory.accessory.description || "Không có mô tả"}
                  </p>
                  <div className="flex items-center justify-between text-sm gap-2">
                    <span className="text-green-600 shrink-0">
                      Giá:{" "}
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(Number(accessory.price))}
                    </span>
                    {accessory.description && (
                      <span className="text-green-500 italic truncate flex-1 min-w-0">
                        {accessory.description}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Measurements Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {measurements.map((measurement) => (
            <div
              key={measurement.label}
              className="p-3 border rounded-lg bg-gray-50/50"
            >
              <div className="flex items-center gap-2 mb-1">
                {measurement.icon}
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
  );
};
