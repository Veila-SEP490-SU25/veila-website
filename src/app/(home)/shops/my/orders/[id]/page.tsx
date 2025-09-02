"use client";

import {
  useLazyGetOrderMilestoneQuery,
  useLazyGetOrderQuery,
  useLazyGetOrderDressesQuery,
  useLazyGetOrderAccessoriesQuery,
  useLazyGetOrderServiceQuery,
} from "@/services/apis";
import {
  type IMilestone,
  type IOrder,
  type IOrderDressDetail,
  OrderStatus,
  OrderType,
  MilestoneStatus,
} from "@/services/types";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  Clock,
  User,
  Package,
  CheckCircle,
  XCircle,
  AlertCircle,
  PlayCircle,
  MessageSquare,
  TrendingUp,
  Plus,
  Edit,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MilestoneTask } from "@/components/shops/detail/order/milestone-task";
import { EditMilestoneDialog } from "@/components/shops/detail/order/edit-milestone-dialog";
import { ImageGallery } from "@/components/image-gallery";
import { ChangeOrderStatusButton } from "@/components/shops/detail/order/change-order-status-button";
import { OrderDetailsTab } from "@/components/shops/detail/order/order-details-tab";
import { MeasurementsTab } from "@/components/shops/detail/order/measurements-tab";

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

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING:
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case OrderStatus.PAYING:
      return "bg-orange-100 text-orange-800 border-orange-200";
    case OrderStatus.IN_PROCESS:
      return "bg-blue-100 text-blue-800 border-blue-200";
    case OrderStatus.COMPLETED:
      return "bg-green-100 text-green-800 border-green-200";
    case OrderStatus.CANCELLED:
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusText = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING:
      return "Chờ xử lý";
    case OrderStatus.PAYING:
      return "Chờ thanh toán";
    case OrderStatus.IN_PROCESS:
      return "Đang xử lý";
    case OrderStatus.COMPLETED:
      return "Hoàn thành";
    case OrderStatus.CANCELLED:
      return "Đã hủy";
    default:
      return status;
  }
};

const getTypeText = (type: OrderType) => {
  switch (type) {
    case OrderType.SELL:
      return "Bán hàng";
    case OrderType.RENT:
      return "Cho thuê";
    case OrderType.CUSTOM:
      return "Đặt may";
    default:
      return type;
  }
};

const getTypeColor = (type: OrderType) => {
  switch (type) {
    case OrderType.SELL:
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case OrderType.RENT:
      return "bg-purple-100 text-purple-800 border-purple-200";
    case OrderType.CUSTOM:
      return "bg-orange-100 text-orange-800 border-orange-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getMilestoneStatusIcon = (status: MilestoneStatus) => {
  switch (status) {
    case MilestoneStatus.COMPLETED:
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    case MilestoneStatus.IN_PROGRESS:
      return <PlayCircle className="h-5 w-5 text-blue-600" />;
    case MilestoneStatus.CANCELLED:
      return <XCircle className="h-5 w-5 text-red-600" />;
    default:
      return <AlertCircle className="h-5 w-5 text-gray-400" />;
  }
};

const getMilestoneStatusText = (status: MilestoneStatus) => {
  switch (status) {
    case MilestoneStatus.COMPLETED:
      return "Hoàn thành";
    case MilestoneStatus.IN_PROGRESS:
      return "Đang thực hiện";
    case MilestoneStatus.CANCELLED:
      return "Đã hủy";
    case MilestoneStatus.PENDING:
      return "Chờ thực hiện";
    default:
      return status;
  }
};

const getMilestoneStatusColor = (status: MilestoneStatus) => {
  switch (status) {
    case MilestoneStatus.COMPLETED:
      return "bg-green-100 text-green-800 border-green-200";
    case MilestoneStatus.IN_PROGRESS:
      return "bg-blue-100 text-blue-800 border-blue-200";
    case MilestoneStatus.CANCELLED:
      return "bg-red-100 text-red-800 border-red-200";
    case MilestoneStatus.PENDING:
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const formatDateShort = (date: Date | string) => {
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
};

const ShopOrderDetailPage = () => {
  const { id: orderId } = useParams();
  const router = useRouter();

  const [getOrder, { isLoading: isOrderLoading }] = useLazyGetOrderQuery();
  const [order, setOrder] = useState<IOrder>();

  const fetchOrder = useCallback(async () => {
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
        router.push("/shops/my");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tải thông tin đơn hàng");
      console.error("Error fetching order:", error);
    }
  }, [getOrder, orderId, router]);

  const [milestones, setMilestones] = useState<IMilestone[]>([]);
  const [getMilestones, { isLoading: isMilestonesLoading }] =
    useLazyGetOrderMilestoneQuery();

  const fetchMilestone = useCallback(async () => {
    try {
      const { statusCode, message, items } = await getMilestones({
        filter: "",
        orderId: orderId as string,
        page: 0,
        size: 10,
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
  }, [getMilestones, orderId]);

  const [getOrderDressDetail, { isLoading: isOrderDressDetailLoading }] =
    useLazyGetOrderDressesQuery();
  const [orderDresses, setOrderDresses] = useState<IOrderDressDetail[]>([]);

  const [getOrderAccessories, { isLoading: isOrderAccessoriesLoading }] =
    useLazyGetOrderAccessoriesQuery();
  const [orderAccessories, setOrderAccessories] = useState<any[]>([]);

  const [getOrderService, { isLoading: isOrderServiceLoading }] =
    useLazyGetOrderServiceQuery();
  const [orderServiceDetails, setOrderServiceDetails] = useState<any>(null);

  const fetchOrderDressDetail = useCallback(async () => {
    try {
      const { statusCode, message, items } = await getOrderDressDetail(
        orderId as string
      ).unwrap();
      if (statusCode === 200) {
        setOrderDresses(items);
      } else {
        toast.error("Không thể lấy dữ liệu thông tin dress details", {
          description: message,
        });
      }
    } catch (error) {
      toast.error("Không thể lấy dữ liệu thông tin dress details");
      console.error("Error fetching order dress detail:", error);
    }
  }, [getOrderDressDetail, orderId]);

  const fetchOrderAccessories = useCallback(async () => {
    try {
      const { statusCode, message, items } = await getOrderAccessories(
        orderId as string
      ).unwrap();
      if (statusCode === 200) {
        setOrderAccessories(items);
      } else {
        toast.error("Không thể lấy dữ liệu thông tin accessories", {
          description: message,
        });
      }
    } catch (error) {
      toast.error("Không thể lấy dữ liệu thông tin accessories");
      console.error("Error fetching order accessories:", error);
    }
  }, [getOrderAccessories, orderId]);

  const fetchOrderService = useCallback(async () => {
    try {
      const { statusCode, message, item } = await getOrderService(
        orderId as string
      ).unwrap();
      if (statusCode === 200) {
        setOrderServiceDetails(item);
      } else {
        toast.error("Không thể lấy dữ liệu thông tin service", {
          description: message,
        });
      }
    } catch (error) {
      toast.error("Không thể lấy dữ liệu thông tin service");
      console.error("Error fetching order service:", error);
    }
  }, [getOrderService, orderId]);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
      fetchMilestone();
      fetchOrderDressDetail();
      fetchOrderAccessories();
    }
  }, [
    orderId,
    fetchOrder,
    fetchMilestone,
    fetchOrderDressDetail,
    fetchOrderAccessories,
  ]);

  // Gọi API service riêng khi đã có thông tin order và là đơn custom
  useEffect(() => {
    if (order && order.type === OrderType.CUSTOM) {
      fetchOrderService();
    }
  }, [order, fetchOrderService]);

  // Update order when orderDresses is fetched
  // Note: Since API returns IDress[] instead of IOrderDressDetail[], we skip this update

  if (
    isOrderLoading ||
    isOrderDressDetailLoading ||
    isOrderAccessoriesLoading
  ) {
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

  const completedMilestones = milestones.filter(
    (m) => m.status === MilestoneStatus.COMPLETED
  ).length;
  const totalMilestones = milestones.length;
  const progress =
    totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

  // Calculate payment information

  // Use the fetched orderDresses or fallback to order.orderDressDetail
  const currentDress = orderDresses.length > 0 ? orderDresses[0] : null;
  const currentOrderDressDetail = order.orderDressDetail;

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Link href="/shops/my">
            <Button variant="ghost" size="sm" className="shrink-0">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
          </Link>
          <div className="min-w-0">
            <h1 className="text-xl md:text-2xl font-bold truncate">
              Đơn hàng #{order.id.slice(-8)}
            </h1>
            <div className="flex items-center gap-4 mt-1">
              <p className="text-sm text-muted-foreground">
                Tạo ngày {formatDateShort(order.createdAt)}
              </p>
              <span className="text-sm text-muted-foreground">•</span>
              <p className="text-sm text-muted-foreground">
                Shop:{" "}
                <span className="font-medium text-blue-600">
                  {currentDress?.dress?.user?.shop?.name ||
                    currentOrderDressDetail?.dress?.user?.shop?.name ||
                    order.shop?.name ||
                    "Không xác định"}
                </span>
              </p>
            </div>
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

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <TrendingUp className="h-5 w-5" />
            <span>Tiến độ thực hiện</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Hoàn thành {completedMilestones}/{totalMilestones} giai đoạn
              </span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
            {totalMilestones === 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Chưa có giai đoạn nào được thiết lập cho đơn hàng này.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details" className="text-xs sm:text-sm">
                Thông tin
              </TabsTrigger>
              <TabsTrigger value="milestones" className="text-xs sm:text-sm">
                Tiến độ
              </TabsTrigger>
              <TabsTrigger value="measurements" className="text-xs sm:text-sm">
                Chi tiết
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 mt-4">
              <OrderDetailsTab
                order={order}
                currentDress={currentDress}
                currentOrderDressDetail={currentOrderDressDetail}
              />
            </TabsContent>

            <TabsContent value="milestones" className="space-y-4 mt-4">
              {isMilestonesLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i}>
                      <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-20 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Hiển thị milestones nếu có */}
                  {milestones.length > 0 ? (
                    <div className="space-y-4">
                      {milestones.map((milestone, index) => (
                        <Card key={milestone.id} className="relative">
                          <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                {getMilestoneStatusIcon(milestone.status)}
                                <div>
                                  <span className="text-lg">
                                    Giai đoạn {milestone.index}:{" "}
                                    {milestone.title}
                                  </span>
                                  <p className="text-sm text-muted-foreground font-normal mt-1">
                                    Hạn: {formatDateShort(milestone.dueDate)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <EditMilestoneDialog
                                  milestone={milestone}
                                  previousMilestoneDueDate={
                                    index > 0
                                      ? milestones[
                                          index - 1
                                        ].dueDate?.toString() || null
                                      : null
                                  }
                                  onSuccess={() => {
                                    fetchMilestone();
                                  }}
                                  trigger={
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-8 px-3"
                                    >
                                      <Edit className="h-3 w-3 mr-1" />
                                      Sửa hạn
                                    </Button>
                                  }
                                />
                                <Badge
                                  variant="outline"
                                  className={getMilestoneStatusColor(
                                    milestone.status
                                  )}
                                >
                                  {getMilestoneStatusText(milestone.status)}
                                </Badge>
                              </div>
                            </CardTitle>
                            {milestone.description && (
                              <p className="text-base text-muted-foreground">
                                {milestone.description}
                              </p>
                            )}
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <MilestoneTask
                                milestoneId={milestone.id}
                                milestoneTitle={milestone.title}
                                onChange={fetchMilestone}
                                orderStatus={order.status}
                                isLastMilestone={
                                  index === milestones.length - 1
                                }
                                orderId={order.id}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="text-center py-12">
                        <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-lg font-semibold mb-2">
                          {order.status === OrderStatus.PENDING
                            ? "Chưa có giai đoạn nào được tạo"
                            : "Chưa có giai đoạn nào được thiết lập cho đơn hàng này."}
                        </h3>
                        <p className="text-muted-foreground">
                          {order.status === OrderStatus.PENDING
                            ? "Hãy tạo các giai đoạn công việc để bắt đầu xử lý đơn hàng."
                            : "Các giai đoạn sẽ được tạo khi đơn hàng được xử lý."}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="measurements" className="space-y-4 mt-4">
              <MeasurementsTab
                currentOrderDressDetail={currentOrderDressDetail}
                order={order}
                orderDressDetails={orderDresses}
                orderAccessories={orderAccessories}
                orderServiceDetails={
                  order.type === OrderType.CUSTOM
                    ? orderServiceDetails || order.orderServiceDetail
                    : null
                }
              />
            </TabsContent>

            <TabsContent
              value="transactions"
              className="space-y-4 mt-4"
            ></TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Shop Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Thông tin shop</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold truncate text-blue-600">
                    {currentDress?.dress?.user?.shop?.name ||
                      currentOrderDressDetail?.dress?.user?.shop?.name ||
                      order.shop?.name ||
                      "Không xác định"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {currentDress?.dress?.user?.shop?.address ||
                      currentOrderDressDetail?.dress?.user?.shop?.address ||
                      order.shop?.address ||
                      "Không có địa chỉ"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Khách hàng</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={order.customer.avatarUrl || ""} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                    {order.customer.firstName?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold truncate">
                    {order.customer.firstName} {order.customer.middleName}{" "}
                    {order.customer.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {order.customer.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.customer.phone}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Thao tác nhanh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {order.status === OrderStatus.PENDING && (
                <ChangeOrderStatusButton
                  message="Xác nhận đơn hàng"
                  orderId={order.id}
                  status={OrderStatus.PAYING}
                  onSuccess={() => {
                    fetchOrder();
                    fetchMilestone();
                    fetchOrderDressDetail();
                  }}
                />
              )}
              <Button
                className="w-full justify-start bg-transparent"
                variant="outline"
                onClick={() => {
                  router.push("/chat");
                }}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Nhắn tin khách hàng
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tóm tắt đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Loại:</span>
                <Badge className={getTypeColor(order.type)} variant="outline">
                  {getTypeText(order.type)}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Số tiền chuyển cho Shop:
                </span>
                <span className="font-bold">
                  {formatCurrency(order.amount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Số dư bị khoá:</span>
                <span className="font-bold">
                  {" "}
                  {formatCurrency(parseFloat(order.deposit))}
                </span>
              </div>

              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ngày giao:</span>
                <span className="font-medium">
                  {formatDateShort(order.dueDate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tiến độ:</span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ShopOrderDetailPage;
