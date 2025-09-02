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
import { Heart, ShoppingBag, Calendar, MessageCircle } from "lucide-react";
import { UserCard } from "@/components/profile/user-card";
import { WalletCard } from "@/components/profile/wallet-card";
import { MyOrders } from "@/components/profile/orders/my-orders";
import { ProfileEditForm } from "@/components/profile/profile-edit-form";
import { ProfileStatsSkeleton } from "@/components/ui/loading-skeleton";
import { CustomRequestsTab } from "@/components/profile/custom-requests/custom-requests-tab";
import { useAuth } from "@/providers/auth.provider";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const { isAuthenticated } = useAuth();

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
      <div className="w-full space-y-4 grid grid-cols-2 gap-4 mb-4">
        <div className="cols-span-1 w-full h-full">
          <UserCard />
        </div>

        <div className="cols-span-1 w-full h-full">
          <WalletCard />
        </div>
      </div>

      <div className="flex-1">
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
                  <p className="text-sm text-gray-600">Yêu cầu đặt may</p>
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
            <TabsTrigger value="profile">Thông tin cá nhân</TabsTrigger>
            <TabsTrigger value="orders">Đơn Hàng</TabsTrigger>
            <TabsTrigger value="custom-requests">Yêu cầu đặt may</TabsTrigger>
            <TabsTrigger value="favourite">Yêu thích</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <ProfileEditForm />
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <MyOrders />
          </TabsContent>

          <TabsContent value="custom-requests" className="space-y-6">
            <CustomRequestsTab />
          </TabsContent>

          <TabsContent value="favourite" className="space-y-6">
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
