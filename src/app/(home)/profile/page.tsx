"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  ShoppingBag,
  Calendar,
  MessageCircle,
  Star,
  Clock,
  CheckCircle,
} from "lucide-react";
import { UserCard } from "@/components/profile/user-card";
import { WalletCard } from "@/components/profile/wallet-card";
import { MyOrders } from "@/components/profile/orders/my-orders";
import { ProfileEditForm } from "@/components/profile/profile-edit-form";
import { ProfileStatsSkeleton } from "@/components/ui/loading-skeleton";
import { useAuth } from "@/providers/auth.provider";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const { isAuthenticated } = useAuth();

  // Loading state
  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <ProfileStatsSkeleton />
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
            <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
      {/* Sidebar */}
      <div className="w-full space-y-4 grid grid-cols-2 gap-4 mb-4">
        <div className="cols-span-1 w-full h-full">
          <UserCard />
        </div>

        <div className="cols-span-1 w-full h-full">
          <WalletCard />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Bảng Điều Khiển</h1>
          <p className="text-gray-600 mt-2">
            Chào mừng trở lại, Sarah! Đây là những gì đang diễn ra trong hành
            trình váy cưới của bạn.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">
                    Đơn Hàng Đang Hoạt Động
                  </p>
                  <p className="text-2xl font-bold text-gray-900">2</p>
                </div>
                <ShoppingBag className="h-8 w-8 text-rose-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Cuộc Tư Vấn</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tin Nhắn</p>
                  <p className="text-2xl font-bold text-gray-900">5</p>
                </div>
                <MessageCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Yêu Thích</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
                <Heart className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Tổng Quan</TabsTrigger>
            <TabsTrigger value="profile">Thông tin cá nhân</TabsTrigger>
            <TabsTrigger value="orders">Đơn Hàng</TabsTrigger>
            <TabsTrigger value="messages">Tin Nhắn</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Hoạt Động Gần Đây</CardTitle>
                <CardDescription>
                  Các tương tác và cập nhật mới nhất của bạn
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div className="flex-1">
                      <p className="font-medium">
                        Thiết kế váy riêng đã được phê duyệt
                      </p>
                      <p className="text-sm text-gray-600">
                        Nhà thiết kế: Emma Wilson • 2 giờ trước
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                    <MessageCircle className="h-5 w-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="font-medium">
                        Tin nhắn mới từ nhà thiết kế
                      </p>
                      <p className="text-sm text-gray-600">
                        Về việc lựa chọn vải • 4 giờ trước
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-lg">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    <div className="flex-1">
                      <p className="font-medium">
                        Cuộc tư vấn đã được lên lịch
                      </p>
                      <p className="text-sm text-gray-600">
                        Ngày mai lúc 2:00 chiều • 1 ngày trước
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommended for You */}
            <Card>
              <CardHeader>
                <CardTitle>Đề Xuất Cho Bạn</CardTitle>
                <CardDescription>
                  Dựa trên sở thích và phong cách của bạn
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="aspect-square bg-gray-100 rounded-lg mb-3"></div>
                    <h4 className="font-medium">Váy Dáng A Thanh Lịch</h4>
                    <p className="text-sm text-gray-600">
                      Nhà thiết kế: Maria Garcia
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-semibold">1.200.000₫</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm ml-1">4.9</span>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="aspect-square bg-gray-100 rounded-lg mb-3"></div>
                    <h4 className="font-medium">Thiết Kế Ren Cổ Điển</h4>
                    <p className="text-sm text-gray-600">
                      Nhà thiết kế: Sophie Chen
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-semibold">950.000₫</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm ml-1">4.8</span>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="aspect-square bg-gray-100 rounded-lg mb-3"></div>
                    <h4 className="font-medium">
                      Phong Cách Tối Giản Hiện Đại
                    </h4>
                    <p className="text-sm text-gray-600">
                      Nhà thiết kế: Alex Thompson
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-semibold">800.000₫</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm ml-1">4.7</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <ProfileEditForm />
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <MyOrders />
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
                <CardDescription>
                  Communicate with designers and support
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback className="bg-rose-100 text-rose-600">
                          EW
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Emma Wilson</h4>
                          <span className="text-sm text-gray-600">
                            2 hours ago
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Great! I've updated the design based on your feedback.
                          The new sketches are ready for review.
                        </p>
                      </div>
                      <div className="w-3 h-3 bg-rose-600 rounded-full"></div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          SC
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Sophie Chen</h4>
                          <span className="text-sm text-gray-600">
                            1 day ago
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Thank you for choosing our vintage collection! Your
                          dress will be ready for pickup on Friday.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback className="bg-green-100 text-green-600">
                          VS
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Veila Support</h4>
                          <span className="text-sm text-gray-600">
                            2 days ago
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Welcome to Veila! We're here to help you find your
                          perfect wedding dress. Let us know if you have any
                          questions.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
