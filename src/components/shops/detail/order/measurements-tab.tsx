'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Ruler,
  Package,
  Settings,
  Tag,
  Weight,
  User,
  Circle,
  Shirt,
  Hand,
  Check,
} from 'lucide-react';
import {
  IOrderDressDetail,
  IOrder,
  OrderType,
  IUpdateRequest,
  UpdateRequestStatus,
} from '@/services/types';
import { formatCurrency } from '@/lib/order-util';
import { useLazyGetUpdateRequestsQuery } from '@/services/apis';
import { JSX, useCallback, useEffect, useState } from 'react';
import { isSuccess } from '@/lib/utils';
import { ResponseUpdateRequestDialog } from '@/components/shops/detail/order/response-update-request-dialog';
import { Button } from '@/components/ui/button';

interface MeasurementsTabProps {
  currentOrderDressDetail: IOrderDressDetail | null;
  order: IOrder;
  orderDressDetails?: any[];
  orderAccessories?: any[];
  orderService?: any;
  onUpdate?: () => void;
}

export const MeasurementsTab = ({
  currentOrderDressDetail,
  order,
  orderDressDetails = [],
  orderAccessories = [],
  orderService: orderService,
  onUpdate,
}: MeasurementsTabProps) => {
  const orderType = order.type;
  const [measurements, setMeasurements] = useState<
    {
      label: string;
      value: number | undefined;
      unit: string;
      icon: JSX.Element;
    }[]
  >([
    {
      label: 'Chiều cao',
      value:
        orderType === OrderType.CUSTOM
          ? orderService?.request.height
          : currentOrderDressDetail?.height,
      unit: 'cm',
      icon: <Ruler className="h-4 w-4 text-blue-500" />,
    },
    {
      label: 'Cân nặng',
      value:
        orderType === OrderType.CUSTOM
          ? orderService?.request.weight
          : currentOrderDressDetail?.weight,
      unit: 'kg',
      icon: <Weight className="h-4 w-4 text-green-500" />,
    },
    {
      label: 'Vòng ngực',
      value:
        orderType === OrderType.CUSTOM ? orderService?.request.bust : currentOrderDressDetail?.bust,
      unit: 'cm',
      icon: <User className="h-4 w-4 text-purple-500" />,
    },
    {
      label: 'Vòng eo',
      value:
        orderType === OrderType.CUSTOM
          ? orderService?.request.waist
          : currentOrderDressDetail?.waist,
      unit: 'cm',
      icon: <Circle className="h-4 w-4 text-orange-500" />,
    },
    {
      label: 'Vòng hông',
      value:
        orderType === OrderType.CUSTOM ? orderService?.request.hip : currentOrderDressDetail?.hip,
      unit: 'cm',
      icon: <Circle className="h-4 w-4 text-pink-500" />,
    },
    {
      label: 'Nách',
      value:
        orderType === OrderType.CUSTOM
          ? orderService?.request.armpit
          : currentOrderDressDetail?.armpit,
      unit: 'cm',
      icon: <Shirt className="h-4 w-4 text-indigo-500" />,
    },
    {
      label: 'Bắp tay',
      value:
        orderType === OrderType.CUSTOM
          ? orderService?.request.bicep
          : currentOrderDressDetail?.bicep,
      unit: 'cm',
      icon: <Hand className="h-4 w-4 text-red-500" />,
    },
    {
      label: 'Cổ',
      value:
        orderType === OrderType.CUSTOM ? orderService?.request.neck : currentOrderDressDetail?.neck,
      unit: 'cm',
      icon: <Circle className="h-4 w-4 text-teal-500" />,
    },
    {
      label: 'Vai',
      value:
        orderType === OrderType.CUSTOM
          ? orderService?.request.shoulderWidth
          : currentOrderDressDetail?.shoulderWidth,
      unit: 'cm',
      icon: <Shirt className="h-4 w-4 text-cyan-500" />,
    },
    {
      label: 'Tay áo',
      value:
        orderType === OrderType.CUSTOM
          ? orderService?.request.sleeveLength
          : currentOrderDressDetail?.sleeveLength,
      unit: 'cm',
      icon: <Shirt className="h-4 w-4 text-amber-500" />,
    },
    {
      label: 'Dài lưng',
      value:
        orderType === OrderType.CUSTOM
          ? orderService?.request.backLength
          : currentOrderDressDetail?.backLength,
      unit: 'cm',
      icon: <Ruler className="h-4 w-4 text-emerald-500" />,
    },
    {
      label: 'Eo thấp',
      value:
        orderType === OrderType.CUSTOM
          ? orderService?.request.lowerWaist
          : currentOrderDressDetail?.lowerWaist,
      unit: 'cm',
      icon: <Ruler className="h-4 w-4 text-violet-500" />,
    },
    {
      label: 'Eo xuống sàn',
      value:
        orderType === OrderType.CUSTOM
          ? orderService?.request.waistToFloor
          : currentOrderDressDetail?.waistToFloor,
      unit: 'cm',
      icon: <Ruler className="h-4 w-4 text-rose-500" />,
    },
  ]);

  const [trigger, {}] = useLazyGetUpdateRequestsQuery();
  const [updateRequests, setUpdateRequests] = useState<IUpdateRequest[]>([]);

  const fetchUpdateRequests = useCallback(async () => {
    if (orderType !== OrderType.CUSTOM) return;
    try {
      const { statusCode, items } = await trigger({
        requestId: orderService.request.id,
        filter: '',
        sort: 'updatedAt:asc',
        page: 0,
        size: 1000,
      }).unwrap();
      if (isSuccess(statusCode)) {
        setUpdateRequests(items);
        const lastItem = items[items.length - 1];
        setMeasurements([
          {
            label: 'Chiều cao',
            value: lastItem.height || undefined,
            unit: 'cm',
            icon: <Ruler className="h-4 w-4 text-blue-500" />,
          },
          {
            label: 'Cân nặng',
            value: lastItem.weight || undefined,
            unit: 'kg',
            icon: <Weight className="h-4 w-4 text-green-500" />,
          },
          {
            label: 'Vòng ngực',
            value: lastItem.bust || undefined,
            unit: 'cm',
            icon: <User className="h-4 w-4 text-purple-500" />,
          },
          {
            label: 'Vòng eo',
            value: lastItem.waist || undefined,
            unit: 'cm',
            icon: <Circle className="h-4 w-4 text-orange-500" />,
          },
          {
            label: 'Vòng hông',
            value: lastItem.hip || undefined,
            unit: 'cm',
            icon: <Circle className="h-4 w-4 text-pink-500" />,
          },
          {
            label: 'Nách',
            value: lastItem.armpit || undefined,
            unit: 'cm',
            icon: <Shirt className="h-4 w-4 text-indigo-500" />,
          },
          {
            label: 'Bắp tay',
            value: lastItem.bicep || undefined,
            unit: 'cm',
            icon: <Hand className="h-4 w-4 text-red-500" />,
          },
          {
            label: 'Cổ',
            value: lastItem.neck || undefined,
            unit: 'cm',
            icon: <Circle className="h-4 w-4 text-teal-500" />,
          },
          {
            label: 'Vai',
            value: lastItem.shoulderWidth || undefined,
            unit: 'cm',
            icon: <Shirt className="h-4 w-4 text-cyan-500" />,
          },
          {
            label: 'Tay áo',
            value: lastItem.sleeveLength || undefined,
            unit: 'cm',
            icon: <Shirt className="h-4 w-4 text-amber-500" />,
          },
          {
            label: 'Dài lưng',
            value: lastItem.backLength || undefined,
            unit: 'cm',
            icon: <Ruler className="h-4 w-4 text-emerald-500" />,
          },
          {
            label: 'Eo thấp',
            value: lastItem.lowerWaist || undefined,
            unit: 'cm',
            icon: <Ruler className="h-4 w-4 text-violet-500" />,
          },
          {
            label: 'Eo xuống sàn',
            value: lastItem.waistToFloor || undefined,
            unit: 'cm',
            icon: <Ruler className="h-4 w-4 text-rose-500" />,
          },
        ]);
      }
    } catch (error) {
      console.error(error);
    }
  }, [setUpdateRequests, trigger, orderService, orderType]);

  useEffect(() => {
    fetchUpdateRequests();
  }, [fetchUpdateRequests]);

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
            <p className="text-sm text-muted-foreground">Chi tiết dịch vụ đặt may</p>
          </CardHeader>
          <CardContent>
            {orderService ? (
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-blue-50/50">
                  <h4 className="font-semibold text-lg mb-2">
                    {orderService.service?.name || 'Dịch vụ đặt may'}
                  </h4>
                  <p className="text-sm text-gray-700 mb-3">
                    {orderService.service?.description || 'Không có mô tả'}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Giá dịch vụ:</span>
                    <span className="font-bold text-lg text-green-600">
                      {formatCurrency(orderService.price || 0)}
                    </span>
                  </div>
                </div>

                {orderService.request && (
                  <div className="p-4 border rounded-lg bg-orange-50/50">
                    <h5 className="font-semibold text-blue-800 mb-2">Yêu cầu đặc biệt</h5>
                    <p className="text-sm text-blue-700 mb-2">{orderService.request.title}</p>
                    {orderService.request.description && (
                      <p className="text-sm text-blue-600">{orderService.request.description}</p>
                    )}
                  </div>
                )}

                {updateRequests &&
                  updateRequests.length > 0 &&
                  updateRequests.map((request, index) => (
                    <div
                      key={request.id}
                      className="p-4 border rounded-lg bg-rose-50/50 flex items-start justify-between"
                    >
                      <div className="">
                        <h5 className="font-semibold text-blue-800 mb-2">
                          Yêu cầu chỉnh sửa #{index + 1}
                        </h5>
                        <p className="text-sm text-blue-700 mb-2">{request.title}</p>
                        {request.description && (
                          <p className="text-sm text-blue-600">{request.description}</p>
                        )}
                      </div>
                      {request.status === UpdateRequestStatus.PENDING && (
                        <ResponseUpdateRequestDialog
                          requestId={orderService.request.id}
                          updateRequest={request}
                          onUpdate={() => {
                            fetchUpdateRequests();
                            onUpdate?.();
                          }}
                          trigger={
                            <Button
                              className="flex items-center justify-start gap-2"
                              variant="outline"
                            >
                              <Check className="size-4" />
                              Phê duyệt yêu cầu
                            </Button>
                          }
                        />
                      )}
                    </div>
                  ))}

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
                      {measurements.map((measurement) => (
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
              </div>
            ) : (
              <div className="text-center py-8">
                <Settings className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-muted-foreground">Chưa có thông tin dịch vụ</p>
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
            <p className="text-sm text-muted-foreground">Chi tiết sản phẩm đã đặt</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orderDressDetails.map((dressDetail, index) => (
                <div key={index} className="p-4 border rounded-lg bg-gray-50/50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-lg">
                      {dressDetail.dress?.name || `Váy #${index + 1}`}
                    </h4>
                    <Badge variant="outline" className="text-sm">
                      {formatCurrency(dressDetail.price || 0)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">
                    {dressDetail.dress?.description || 'Không có mô tả'}
                  </p>
                  {dressDetail.description && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-700">
                        <span className="font-medium">Yêu cầu đặc biệt:</span>{' '}
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
                      {accessory.accessory?.description || 'Không có mô tả'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      {formatCurrency(accessory.price || 0)}
                    </p>
                    <p className="text-xs text-gray-500">Số lượng: {accessory.quantity || 1}</p>
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
              {measurements.map((measurement) => (
                <div key={measurement.label} className="p-3 border rounded-lg bg-gray-50/50">
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
      {!orderDressDetails?.length && !orderAccessories?.length && !currentOrderDressDetail && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">Chưa có thông tin chi tiết</h3>
            <p className="text-muted-foreground">
              Thông tin sản phẩm và phụ kiện sẽ được cập nhật sau.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
