"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShopOverview } from "@/components/shops/my/shop-overview";
import { ShopInformation } from "@/components/shops/my/shop-information";

import { SuspendedShopDashboard } from "@/components/shops/suspended-shop-dashboard";
import { useLazyGetMyShopQuery } from "@/services/apis";
import { IShop, ShopStatus } from "@/services/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";

const MyShopPage = () => {
  const [shop, setShop] = useState<IShop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const router = useRouter();
  const [getMyShop] = useLazyGetMyShopQuery();

  const fetchMyShop = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getMyShop().unwrap();
      if (response.statusCode === 200) {
        setShop(response.item);
      } else {
        toast.error("Không thể tải thông tin cửa hàng", {
          description: response.message,
        });
      }
    } catch (error) {
      console.error("Error fetching shop data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [getMyShop]);

  useEffect(() => {
    fetchMyShop();
  }, [fetchMyShop]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header Skeleton */}
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-5 bg-gray-200 rounded w-1/2"></div>
          </div>

          {/* Tabs Skeleton */}
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>

          {/* Content Skeleton */}
          <div className="space-y-6">
            {/* Shop Header Skeleton */}
            <Card className="pt-0">
              <div className="relative h-48 md:h-64 overflow-hidden rounded-t-lg bg-gray-200"></div>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="h-24 w-24 bg-gray-200 rounded-full -mt-16 relative z-10"></div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-4 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Metrics Skeleton */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </CardContent>
                </Card>
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

  // Kiểm tra nếu shop bị suspended
  if (shop.status === ShopStatus.SUSPENDED) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <SuspendedShopDashboard />
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
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="info">Thông tin</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <ShopOverview shop={shop} />
        </TabsContent>

        {/* Shop Information Tab */}
        <TabsContent value="info" className="space-y-6">
          <ShopInformation shop={shop} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyShopPage;
