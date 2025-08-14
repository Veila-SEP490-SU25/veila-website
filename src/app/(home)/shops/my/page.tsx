"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Edit,
  Camera,
  MapPin,
  Phone,
  Mail,
  Clock,
  Star,
  Package,
  ShoppingBag,
  Users,
  DollarSign,
  Eye,
  Settings,
  Upload,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import type { IShop } from "@/services/types";
import { useLazyGetMyShopQuery } from "@/services/apis";
import { useRouter } from "next/navigation";
import { MyShopOrders } from "@/components/shops/my/shop-orders";

// Mock recent activities
const mockActivities = [
  {
    id: "1",
    type: "order",
    title: "Đơn hàng mới #ORD-001",
    description: "Khách hàng Sarah Johnson đã đặt váy cưới A-Line",
    time: "2 giờ trước",
    status: "new",
  },
  {
    id: "2",
    type: "product",
    title: "Sản phẩm được duyệt",
    description: "Váy cưới Bohemian đã được duyệt và hiển thị",
    time: "5 giờ trước",
    status: "approved",
  },
  {
    id: "3",
    type: "review",
    title: "Đánh giá mới",
    description: "Emily Davis đã đánh giá 5 sao cho váy cưới Vintage",
    time: "1 ngày trước",
    status: "review",
  },
  {
    id: "4",
    type: "message",
    title: "Tin nhắn mới",
    description: "Jessica Wilson hỏi về tình trạng đơn hàng",
    time: "2 ngày trước",
    status: "message",
  },
];

export default function MyShopPage() {
  const router = useRouter();
  const [shop, setShop] = useState<IShop>();
  const [getMyShop, { isLoading }] = useLazyGetMyShopQuery();
  const [activeTab, setActiveTab] = useState("overview");

  const fetchMyShop = async () => {
    try {
      const { statusCode, message, item } = await getMyShop().unwrap();
      if (statusCode === 200) {
        setShop(item);
      } else {
        toast.error("Không thể tải thông tin cửa hàng", {
          description: message,
        });
      }
    } catch (error) {
      console.error("Error fetching shop data:", error);
    }
  };

  useEffect(() => {
    fetchMyShop();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "order":
        return <ShoppingBag className="h-4 w-4 text-blue-600" />;
      case "product":
        return <Package className="h-4 w-4 text-green-600" />;
      case "review":
        return <Star className="h-4 w-4 text-yellow-600" />;
      case "message":
        return <Mail className="h-4 w-4 text-purple-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge className="bg-blue-600">Mới</Badge>;
      case "approved":
        return <Badge className="bg-green-600">Đã duyệt</Badge>;
      case "review":
        return <Badge className="bg-yellow-600">Đánh giá</Badge>;
      case "message":
        return <Badge className="bg-purple-600">Tin nhắn</Badge>;
      default:
        return <Badge variant="secondary">Khác</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
            <div className="grid gap-4 md:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Không tìm thấy cửa hàng
            </h2>
            <p className="text-gray-600 mb-4">
              Bạn chưa có cửa hàng hoặc có lỗi xảy ra
            </p>
            <Button
              onClick={() => router.push("/shops/register")}
              className="bg-rose-600 hover:bg-rose-700"
            >
              Đăng ký cửa hàng
            </Button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Cửa hàng của tôi
          </h1>
          <p className="text-muted-foreground">
            Quản lý thông tin và hoạt động kinh doanh của bạn
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Xem cửa hàng
          </Button>
          <Button className="bg-rose-600 hover:bg-rose-700">
            <Edit className="h-4 w-4 mr-2" />
            Chỉnh sửa
          </Button>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="info">Thông tin</TabsTrigger>
          <TabsTrigger value="products">Sản phẩm</TabsTrigger>
          <TabsTrigger value="orders">Đơn hàng</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Shop Header */}
          <Card>
            <div className="relative h-48 md:h-64 overflow-hidden rounded-t-lg">
              <img
                src={shop.coverUrl || "/placeholder.svg"}
                alt="Shop Cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute top-4 right-4">
                <Badge className="bg-green-600">Đang hoạt động</Badge>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <Avatar className="h-24 w-24 border-4 border-white shadow-lg -mt-16 relative z-10">
                    <AvatarImage src={shop.logoUrl || "/placeholder.svg"} />
                    <AvatarFallback className="text-2xl">
                      {shop.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {shop.name}
                    </h2>
                    <div className="flex items-center gap-2 mt-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">5</span>
                      <span className="text-gray-600">(10 đánh giá)</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="truncate">{shop.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{shop.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="truncate">{shop.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Doanh thu tháng
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatPrice(100000000)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Đơn hàng</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{6}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sản phẩm</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{10}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Khách hàng
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{10}</div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Hoạt động gần đây</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 p-4 border rounded-lg"
                  >
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm">
                          {activity.title}
                        </h4>
                        {getStatusBadge(activity.status)}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {activity.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-4">
                <Button variant="outline">Xem tất cả hoạt động</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shop Information Tab */}
        <TabsContent value="info" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Thông tin cửa hàng</span>

                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Chỉnh sửa
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Shop Images */}
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">
                    Ảnh bìa cửa hàng
                  </Label>
                  <div className="mt-2 relative">
                    <div className="aspect-[3/1] overflow-hidden rounded-lg border-2 border-dashed border-gray-300">
                      <img
                        src={shop.coverUrl || "/placeholder.svg"}
                        alt="Shop Cover"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Button className="absolute top-2 right-2" size="sm">
                      <Camera className="h-4 w-4 mr-2" />
                      Thay đổi
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium">Logo cửa hàng</Label>
                  <div className="mt-2 flex items-center gap-4">
                    <Avatar className="h-20 w-20 border-2 border-gray-200">
                      <AvatarImage src={shop.logoUrl || "/placeholder.svg"} />
                      <AvatarFallback className="text-xl">
                        {shop.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Tải lên logo mới
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên cửa hàng *</Label>
                  <p className="text-sm p-2 bg-gray-50 rounded">{shop.name}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại *</Label>
                  <p className="text-sm p-2 bg-gray-50 rounded">{shop.phone}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <p className="text-sm p-2 bg-gray-50 rounded">{shop.email}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ *</Label>
                <p className="text-sm p-2 bg-gray-50 rounded">{shop.address}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6"></TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="orders" className="space-y-6">
          <MyShopOrders />
        </TabsContent>
      </Tabs>
    </div>
  );
}
