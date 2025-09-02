"use client";

import { CreateCustomOrderDialog } from "@/components/shops/detail/create-custom-order-dialog";
import { ShopAccessories } from "@/components/shops/detail/shop-accessories";
import { ShopBlogs } from "@/components/shops/detail/shop-blogs";
import { ShopDresses } from "@/components/shops/detail/shop-dresses";
import { ShopChatButton } from "@/components/shops/chat-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useLazyGetShopQuery } from "@/services/apis";
import { IShop } from "@/services/types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { ArrowLeft, Mail, MapPin, Phone, Share2 } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const ShopDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [shop, setShop] = useState<IShop>();
  const [activeTab, setActiveTab] = useState("about");

  const [getShop, { isLoading }] = useLazyGetShopQuery();

  const fetchShop = useCallback(async () => {
    try {
      const { statusCode, item } = await getShop(id as string).unwrap();
      if (statusCode === 200) {
        setShop(item);
      } else {
        router.push("/shops");
      }
    } catch {}
  }, [getShop, id, router]);

  useEffect(() => {
    fetchShop();
  }, [fetchShop]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-24 mb-6"></div>
          <div className="h-64 md:h-80 bg-gray-200 rounded-lg mb-8"></div>
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="h-24 w-24 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="flex gap-3">
                <div className="h-10 bg-gray-200 rounded w-24"></div>
                <div className="h-10 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Không tìm thấy cửa hàng
          </h1>
          <Button onClick={() => router.push("/shops")}>
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Quay lại
      </Button>

      {/* Cover Image */}
      <div className="relative h-64 md:h-80 rounded-lg overflow-hidden mb-8">
        <Image
          src={shop.coverUrl || "/placeholder.svg"}
          alt={shop.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            variant="secondary"
            size="icon"
            className="bg-white/90 hover:bg-white"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Shop Header */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="flex-shrink-0">
          <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
            <AvatarImage src={shop.logoUrl || "/placeholder.svg"} />
            <AvatarFallback className="text-2xl">
              {shop.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {shop.name}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>{shop.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>{shop.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>{shop.email}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <ShopChatButton
              shopId={shop.id}
              shopName={shop.name}
              shopAvatarUrl={shop.logoUrl}
              className="bg-rose-600 hover:bg-rose-700 text-white border-rose-600"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-7 bg-gray-100/50 p-1 rounded-lg">
          <TabsTrigger
            value="about"
            className="relative py-2 rounded-md transition-all duration-300 ease-out focus:outline-none focus:ring-0 focus:bg-white focus:shadow-lg focus:scale-105 hover:bg-white/80 hover:shadow-md data-[state=active]:bg-white data-[state=active]:text-rose-600 data-[state=active]:shadow-lg data-[state=active]:font-medium"
          >
            Giới thiệu
          </TabsTrigger>
          <TabsTrigger
            value="dresses"
            className="relative py-2 rounded-md transition-all duration-300 ease-out focus:outline-none focus:ring-0 focus:bg-white focus:shadow-lg focus:scale-105 hover:bg-white/80 hover:shadow-md data-[state=active]:bg-white data-[state=active]:text-rose-600 data-[state=active]:shadow-lg data-[state=active]:font-medium"
          >
            Váy
          </TabsTrigger>
          <TabsTrigger
            value="accessories"
            className="relative  py-2 rounded-md transition-all duration-300 ease-out focus:outline-none focus:ring-0 focus:bg-white focus:shadow-lg focus:scale-105 hover:bg-white/80 hover:shadow-md data-[state=active]:bg-white data-[state=active]:text-rose-600 data-[state=active]:shadow-lg data-[state=active]:font-medium"
          >
            Phụ kiện
          </TabsTrigger>
          <TabsTrigger
            value="custom"
            className="relative  py-2 rounded-md transition-all duration-300 ease-out focus:outline-none focus:ring-0 focus:bg-white focus:shadow-lg focus:scale-105 hover:bg-white/80 hover:shadow-md data-[state=active]:bg-white data-[state=active]:text-rose-600 data-[state=active]:shadow-lg data-[state=active]:font-medium"
          >
            Đặt may
          </TabsTrigger>
          <TabsTrigger
            value="services"
            className="relative  py-2 rounded-md transition-all duration-300 ease-out focus:outline-none focus:ring-0 focus:bg-white focus:shadow-lg focus:scale-105 hover:bg-white/80 hover:shadow-md data-[state=active]:bg-white data-[state=active]:text-rose-600 data-[state=active]:shadow-lg data-[state=active]:font-medium"
          >
            Dịch vụ
          </TabsTrigger>
          <TabsTrigger
            value="blogs"
            className="relative  py-2 rounded-md transition-all duration-300 ease-out focus:outline-none focus:ring-0 focus:bg-white focus:shadow-lg focus:scale-105 hover:bg-white/80 hover:shadow-md data-[state=active]:bg-white data-[state=active]:text-rose-600 data-[state=active]:shadow-lg data-[state=active]:font-medium"
          >
            Bài đăng
          </TabsTrigger>
          <TabsTrigger
            value="info"
            className="relative  py-2 rounded-md transition-all duration-300 ease-out focus:outline-none focus:ring-0 focus:bg-white focus:shadow-lg focus:scale-105 hover:bg-white/80 hover:shadow-md data-[state=active]:bg-white data-[state=active]:text-rose-600 data-[state=active]:shadow-lg data-[state=active]:font-medium"
          >
            Thông tin liên hệ
          </TabsTrigger>
        </TabsList>

        {/* About Tab */}
        <TabsContent value="custom">
          <Card>
            <CardHeader>
              <CardTitle>Đặt may</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <p className="text-gray-700 leading-relaxed">
                Nếu bạn không tìm thấy mẫu váy cưới ưng ý, chúng tôi cung cấp
                dịch vụ đặt may theo yêu cầu. Hãy cho chúng tôi biết ý tưởng của
                bạn và chúng tôi sẽ biến nó thành hiện thực.
              </p>
              <CreateCustomOrderDialog
                children={
                  <Button className="mt-4 bg-rose-600 hover:bg-rose-700">
                    Đặt may ngay
                  </Button>
                }
                shopId={shop.id}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="about" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Về {shop.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                Chào mừng bạn đến với {shop.name}! Chúng tôi là một trong những
                cửa hàng váy cưới uy tín, chuyên cung cấp các mẫu váy cưới đẹp
                và chất lượng cao. Với đội ngũ thiết kế giàu kinh nghiệm, chúng
                tôi cam kết mang đến cho bạn những chiếc váy cưới hoàn hảo cho
                ngày trọng đại.
              </p>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Dịch vụ chuyên nghiệp
                  </h4>
                  <p className="text-sm text-gray-600">
                    Tư vấn và thiết kế váy cưới theo yêu cầu riêng của từng
                    khách hàng
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Chất lượng cao
                  </h4>
                  <p className="text-sm text-gray-600">
                    Sử dụng chất liệu cao cấp và kỹ thuật may đo tinh tế
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Info Tab */}
        <TabsContent value="info">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin liên hệ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Địa chỉ</p>
                    <p className="text-gray-600">{shop.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Số điện thoại</p>
                    <p className="text-gray-600">{shop.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-gray-600">{shop.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Giờ làm việc</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Thứ 2 - Thứ 6:</span>
                  <span className="font-medium">9:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Thứ 7:</span>
                  <span className="font-medium">9:00 - 17:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Chủ nhật:</span>
                  <span className="font-medium">10:00 - 16:00</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="dresses">
          <ShopDresses id={id as string} />
        </TabsContent>

        <TabsContent value="accessories">
          <ShopAccessories id={id as string} />
        </TabsContent>

        <TabsContent value="blogs">
          <ShopBlogs id={id as string} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ShopDetailPage;
