"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Package } from "lucide-react";
import { IMilestone, IOrder, IOrderDressDetail, MilestoneStatus } from "@/services/types";
import {
  useCheckoutOrderMutation,
  useLazyGetMilestonesQuery,
  useLazyGetOrderDressDetailQuery,
  useLazyGetOrderQuery,
} from "@/services/apis";
import {
  formatDateShort,
  getStatusColor,
  getStatusText,
  getTypeColor,
  getTypeText,
} from "@/lib/orders/order-util";
import { OrderProgressCard } from "@/components/profile/orders/order-progress-card";
import { OrderDetailsTab } from "@/components/profile/orders/tabs/order-details-tabs";
import { MilestonesTab } from "@/components/profile/orders/tabs/milestones-tabs";
import { MeasurementsTab } from "@/components/profile/orders/tabs/measurements-tabs";
import { CustomerInfoCard } from "@/components/profile/orders/customer-info-card";
import { QuickActionsCard } from "@/components/profile/orders/quick-action-card";
import { OrderSummaryCard } from "@/components/profile/orders/order-summary-card";

const OrderDetailPage = () => {
  const { id: orderId } = useParams();
  const router = useRouter();

  // State management
  const [order, setOrder] = useState<IOrder>();
  const [milestones, setMilestones] = useState<IMilestone[]>([]);
  const [orderDressDetail, setOrderDressDetail] = useState<IOrderDressDetail[]>(
    []
  );

  // API hooks
  const [getOrder, { isLoading: isOrderLoading }] = useLazyGetOrderQuery();
  const [getMilestones, { isLoading: isMilestonesLoading }] =
    useLazyGetMilestonesQuery();
  const [getOrderDressDetail, { isLoading: isOrderDressDetailLoading }] =
    useLazyGetOrderDressDetailQuery();
  const [checkoutOrder, { isLoading: isCheckingOut }] =
    useCheckoutOrderMutation();

  // Fetch functions
  const fetchOrder = async () => {
    try {
      const { statusCode, message, item } = await getOrder(
        orderId as string
      ).unwrap();
      if (statusCode === 200) {
        setOrder(item);
      } else {
        toast.error("Không thể lấy dữ liệu thông tin đơn hàng", {
          description: message,
        });
        router.push("/profile");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tải thông tin đơn hàng");
      console.error("Error fetching order:", error);
    }
  };

  const fetchMilestone = async () => {
    try {
      const { statusCode, message, items } = await getMilestones({
        orderId: orderId as string,
        sort: "index:asc",
      }).unwrap();
      if (statusCode === 200) {
        setMilestones(items);
      } else {
        toast.error("Không thể lấy dữ liệu thông tin milestones", {
          description: message,
        });
      }
    } catch (error) {
      toast.error("Không thể lấy dữ liệu thông tin milestones");
      console.error("Error fetching milestones:", error);
    }
  };

  const fetchOrderDressDetail = async () => {
    try {
      const { statusCode, message, items } = await getOrderDressDetail(
        orderId as string
      ).unwrap();
      if (statusCode === 200) {
        setOrderDressDetail(items);
        if (order) {
          setOrder((prev) =>
            prev ? { ...prev, orderDressDetail: items[0] || null } : prev
          );
        }
      } else {
        toast.error("Không thể lấy dữ liệu thông tin dress details", {
          description: message,
        });
      }
    } catch (error) {
      toast.error("Không thể lấy dữ liệu thông tin dress details");
      console.error("Error fetching order dress detail:", error);
    }
  };

  const handleCheckout = async () => {
    try {
      const { statusCode, message } = await checkoutOrder(
        orderId as string
      ).unwrap();
      if (statusCode === 200) {
        toast.success("Đặt hàng thành công");
        router.push("/profile");
      } else {
        toast.error("Đã xảy ra lỗi khi đặt hàng", { description: message });
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi đặt hàng");
    }
  };

  // Effects
  useEffect(() => {
    if (orderId) {
      fetchOrder();
      fetchMilestone();
      fetchOrderDressDetail();
    }
  }, [orderId]);

  useEffect(() => {
    if (
      order &&
      orderDressDetail.length > 0 &&
      order.orderDressDetail !== orderDressDetail[0]
    ) {
      setOrder((prev) =>
        prev ? { ...prev, orderDressDetail: orderDressDetail[0] || null } : prev
      );
    }
  }, [order, orderDressDetail]);

  // Loading state
  if (isOrderLoading || isOrderDressDetailLoading) {
    return (
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-24" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="h-96 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Order not found
  if (!order) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Package className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Không tìm thấy đơn hàng
          </h3>
          <p className="text-muted-foreground mb-4">
            Đơn hàng có thể đã bị xóa hoặc bạn không có quyền truy cập.
          </p>
          <Link href="/shops/orders">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại danh sách đơn hàng
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Calculate progress
  const completedMilestones = milestones.filter(
    (m) => m.status === MilestoneStatus.COMPLETED
  ).length;
  const totalMilestones = milestones.length;
  const progress =
    totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

  // Get current order dress detail
  const currentOrderDressDetail =
    orderDressDetail.length > 0 ? orderDressDetail[0] : order.orderDressDetail;

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Link href="/shops/orders">
            <Button variant="ghost" size="sm" className="shrink-0">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
          </Link>
          <div className="min-w-0">
            <h1 className="text-xl md:text-2xl font-bold truncate">
              Đơn hàng #{order.id.slice(-8)}
            </h1>
            <p className="text-sm text-muted-foreground">
              Tạo ngày {formatDateShort(order.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge className={getTypeColor(order.type)} variant="outline">
            {getTypeText(order.type)}
          </Badge>
          <Badge className={getStatusColor(order.status)} variant="outline">
            {getStatusText(order.status)}
          </Badge>
        </div>
      </div>

      {/* Progress Overview */}
      <OrderProgressCard milestones={milestones} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details" className="text-xs sm:text-sm">
                Chi tiết
              </TabsTrigger>
              <TabsTrigger value="milestones" className="text-xs sm:text-sm">
                Tiến độ
              </TabsTrigger>
              <TabsTrigger value="measurements" className="text-xs sm:text-sm">
                Số đo
              </TabsTrigger>
              <TabsTrigger value="transactions" className="text-xs sm:text-sm">
                Thanh toán
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 mt-4">
              <OrderDetailsTab
                order={order}
                currentOrderDressDetail={currentOrderDressDetail}
              />
            </TabsContent>

            <TabsContent value="milestones" className="space-y-4 mt-4">
              <MilestonesTab
                milestones={milestones}
                isMilestonesLoading={isMilestonesLoading}
                fetchMilestone={fetchMilestone}
              />
            </TabsContent>

            <TabsContent value="measurements" className="space-y-4 mt-4">
              <MeasurementsTab
                currentOrderDressDetail={currentOrderDressDetail}
              />
            </TabsContent>

            <TabsContent value="transactions" className="space-y-4 mt-4">
              {/* Transactions content would go here */}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <CustomerInfoCard customer={order.customer} />
          <QuickActionsCard
            onCheckout={handleCheckout}
            isCheckingOut={isCheckingOut}
          />
          <OrderSummaryCard order={order} progress={progress} />
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
