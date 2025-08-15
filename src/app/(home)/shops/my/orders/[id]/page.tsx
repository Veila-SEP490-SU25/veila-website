"use client";

import {
  useLazyGetMilestonesQuery,
  useLazyGetOrderQuery,
  useLazyGetOrderDressDetailQuery,
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
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Phone,
  Mail,
  User,
  Package,
  Ruler,
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle,
  PlayCircle,
  MessageSquare,
  Calendar,
  TrendingUp,
  Eye,
  ChevronRight,
  ChevronLeft,
  Plus,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MilestoneTask } from "@/components/shops/detail/order/milestone-task";
import { CreateMilestoneDialog } from "@/components/shops/detail/order/create-milestone-dialog";

// Helper function to parse comma-separated images
const parseImages = (images: string | string[]): string[] => {
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

// Image Gallery Component
const ImageGallery = ({ images, alt }: { images: string[]; alt: string }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images.length === 0) {
    return (
      <Image
        src="/placeholder.svg?height=80&width=80"
        alt={alt}
        width={80}
        height={80}
        className="rounded-lg object-cover shrink-0"
      />
    );
  }

  if (images.length === 1) {
    return (
      <Image
        src={images[0] || "/placeholder.svg"}
        alt={alt}
        width={80}
        height={80}
        className="rounded-lg object-cover shrink-0"
      />
    );
  }

  return (
    <div className="relative">
      <Image
        src={images[currentIndex] || "/placeholder.svg"}
        alt={`${alt} - ${currentIndex + 1}`}
        width={80}
        height={80}
        className="rounded-lg object-cover shrink-0"
      />
      {images.length > 1 && (
        <div className="absolute inset-0 flex items-center justify-between p-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 bg-black/50 hover:bg-black/70 text-white"
            onClick={() =>
              setCurrentIndex((prev) =>
                prev === 0 ? images.length - 1 : prev - 1
              )
            }
          >
            <ChevronLeft className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 bg-black/50 hover:bg-black/70 text-white"
            onClick={() =>
              setCurrentIndex((prev) =>
                prev === images.length - 1 ? 0 : prev + 1
              )
            }
          >
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      )}
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-1.5 h-1.5 rounded-full ${
              index === currentIndex ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING:
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
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

const formatDate = (date: Date | string) => {
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
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

  const fetchOrder = async () => {
    try {
      const { statusCode, message, item } = await getOrder(
        orderId as string
      ).unwrap();
      if (statusCode === 200) {
        setOrder(item);
      } else {
        toast.error("Không thể l��y dữ liệu thông tin đơn hàng", {
          description: message,
        });
        router.push("/shops/orders");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tải thông tin đơn hàng");
      console.error("Error fetching order:", error);
    }
  };

  const [milestones, setMilestones] = useState<IMilestone[]>([]);
  const [getMilestones, { isLoading: isMilestonesLoading }] =
    useLazyGetMilestonesQuery();

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

  const [getOrderDressDetail, { isLoading: isOrderDressDetailLoading }] =
    useLazyGetOrderDressDetailQuery();
  const [orderDressDetail, setOrderDressDetail] = useState<IOrderDressDetail[]>(
    []
  );

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

  useEffect(() => {
    if (orderId) {
      fetchOrder();
      fetchMilestone();
      fetchOrderDressDetail();
    }
  }, [orderId]);

  // Update order when orderDressDetail is fetched
  useEffect(() => {
  if (
    order &&
    orderDressDetail.length > 0 &&
    order.orderDressDetail !== orderDressDetail[0]
  ) {
    setOrder(prev =>
      prev ? { ...prev, orderDressDetail: orderDressDetail[0] || null } : prev
    );
  }
}, [order, orderDressDetail]);

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

  // Use the fetched orderDressDetail or fallback to order.orderDressDetail
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
                      <p className="font-medium">
                        {formatDateShort(order.dueDate)}
                      </p>
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
                            parseImages(
                              currentOrderDressDetail.dress?.images
                            ) || []
                          }
                          alt={
                            currentOrderDressDetail.dress?.name || "Sản phẩm"
                          }
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

                  {/* Accessories */}
                  {/* {order.orderAccessoryDetail &&
                    Array.isArray(order.orderAccessoryDetail) &&
                    order.orderAccessoryDetail.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-semibold flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          Phụ kiện ({order.orderAccessoryDetail.length})
                        </h4>
                        <div className="space-y-3">
                          {order.orderAccessoryDetail.map((accessory) => (
                            <div
                              key={accessory.id}
                              className="flex items-center space-x-4 p-4 border rounded-lg"
                            >
                              <ImageGallery
                                images={parseImages(accessory.accessory?.images) || []}
                                alt={accessory.accessory?.name || "Phụ kiện"}
                              />
                              <div className="flex-1 min-w-0">
                                <h5 className="font-medium">
                                  {accessory.accessory?.name || ""}
                                </h5>
                                <p className="text-sm text-muted-foreground">
                                  Số lượng: {accessory.quantity}
                                </p>
                                <p className="font-semibold text-green-600">
                                  {formatCurrency(accessory.price)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )} */}

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
                        <p className="text-sm text-muted-foreground">
                          Điện thoại
                        </p>
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
              ) : milestones.length > 0 ? (
                <div className="space-y-4">
                  {milestones.map((milestone, index) => (
                    <Card key={milestone.id} className="relative">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {getMilestoneStatusIcon(milestone.status)}
                            <div>
                              <span className="text-lg">
                                Giai đoạn {milestone.index}: {milestone.title}
                              </span>
                              <p className="text-sm text-muted-foreground font-normal mt-1">
                                Hạn: {formatDateShort(milestone.dueDate)}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className={getMilestoneStatusColor(
                              milestone.status
                            )}
                          >
                            {getMilestoneStatusText(milestone.status)}
                          </Badge>
                        </CardTitle>
                        {milestone.description && (
                          <CardDescription className="text-base">
                            {milestone.description}
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <MilestoneTask
                            milestoneId={milestone.id}
                            milestoneTitle={milestone.title}
                            onChange={fetchMilestone}
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
                      Chưa có giai đoạn nào
                    </h3>
                    <p className="text-muted-foreground">
                      Các giai đoạn sẽ được tạo khi đơn hàng được xử lý.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="measurements" className="space-y-4 mt-4">
              {currentOrderDressDetail ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Ruler className="h-5 w-5" />
                      <span>Số đo cơ thể</span>
                    </CardTitle>
                    <CardDescription>
                      Thông tin số đo chi tiết cho việc may đo
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        {
                          label: "Chiều cao",
                          value: currentOrderDressDetail.high,
                          unit: "cm",
                          icon: "📏",
                        },
                        {
                          label: "Cân nặng",
                          value: currentOrderDressDetail.weight,
                          unit: "kg",
                          icon: "⚖️",
                        },
                        {
                          label: "Vòng ngực",
                          value: currentOrderDressDetail.bust,
                          unit: "cm",
                          icon: "👗",
                        },
                        {
                          label: "Vòng eo",
                          value: currentOrderDressDetail.waist,
                          unit: "cm",
                          icon: "👗",
                        },
                        {
                          label: "Vòng hông",
                          value: currentOrderDressDetail.hip,
                          unit: "cm",
                          icon: "👗",
                        },
                        {
                          label: "Nách",
                          value: currentOrderDressDetail.armpit,
                          unit: "cm",
                          icon: "👕",
                        },
                        {
                          label: "Bắp tay",
                          value: currentOrderDressDetail.bicep,
                          unit: "cm",
                          icon: "💪",
                        },
                        {
                          label: "Cổ",
                          value: currentOrderDressDetail.neck,
                          unit: "cm",
                          icon: "👔",
                        },
                        {
                          label: "Vai",
                          value: currentOrderDressDetail.shoulderWidth,
                          unit: "cm",
                          icon: "👕",
                        },
                        {
                          label: "Tay áo",
                          value: currentOrderDressDetail.sleeveLength,
                          unit: "cm",
                          icon: "👕",
                        },
                        {
                          label: "Dài lưng",
                          value: currentOrderDressDetail.backLength,
                          unit: "cm",
                          icon: "👗",
                        },
                        {
                          label: "Eo thấp",
                          value: currentOrderDressDetail.lowerWaist,
                          unit: "cm",
                          icon: "📐",
                        },
                        {
                          label: "Eo xuống sàn",
                          value: currentOrderDressDetail.waistToFloor,
                          unit: "cm",
                          icon: "📐",
                        },
                      ].map((measurement) => (
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
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Ruler className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold mb-2">
                      Không yêu cầu số đo
                    </h3>
                    <p className="text-muted-foreground">
                      Đơn hàng này không cần thông tin số đo cơ thể.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent
              value="transactions"
              className="space-y-4 mt-4"
            ></TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
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
                    {order.customer.firstName.charAt(0)}
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
              <CreateMilestoneDialog
                orderId={order.id}
                trigger={
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm mốc thời gian
                  </Button>
                }
              />
              <Button
                className="w-full justify-start bg-transparent"
                variant="outline"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Nhắn tin khách hàng
              </Button>
              <Button
                className="w-full justify-start bg-transparent"
                variant="outline"
              >
                <Phone className="h-4 w-4 mr-2" />
                Gọi điện
              </Button>
            </CardContent>
          </Card>

          {/* Order Summary */}
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
                <span className="text-muted-foreground">Tổng tiền:</span>
                <span className="font-bold">
                  {formatCurrency(order.amount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Đã thanh toán:</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Còn lại:</span>
                <span className="font-semibold text-orange-600">
                  {formatCurrency(0)}
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
