"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import type { IShop } from "@/services/types";
import { useLazyGetMyShopQuery } from "@/services/apis";
import { useRouter } from "next/navigation";
import { MyShopOrders } from "@/components/shops/my/shop-orders";
import { ShopOverview } from "@/components/shops/my/shop-overview";
import { ShopInformation } from "@/components/shops/my/shop-information";
import { ShopDressesTabs } from "@/components/shops/my/dresses/shop-dresses-tabs";
import { ShopAccessoriesTabs } from "@/components/shops/my/accessories/shop-accessories-tabs";
import { ShopBlogsTabs } from "@/components/shops/my/blogs/shop-blogs-tabs";

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
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="info">Thông tin</TabsTrigger>
          <TabsTrigger value="dresses">Váy cưới</TabsTrigger>
          <TabsTrigger value="accessories">Phụ kiện</TabsTrigger>
          <TabsTrigger value="orders">Đơn hàng</TabsTrigger>
          <TabsTrigger value="blogs">Blog</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <ShopOverview shop={shop} />
        </TabsContent>

        {/* Shop Information Tab */}
        <TabsContent value="info" className="space-y-6">
          <ShopInformation shop={shop} />
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="dresses" className="space-y-6">
          <ShopDressesTabs />
        </TabsContent>

        {/* Accessories Tab */}
        <TabsContent value="accessories" className="space-y-6">
          <ShopAccessoriesTabs />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="orders" className="space-y-6">
          <MyShopOrders />
        </TabsContent>

        {/* Blog Tab */}
        <TabsContent value="blogs" className="space-y-6">
          <ShopBlogsTabs />
        </TabsContent>
      </Tabs>
    </div>
  );
}
