"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { IDress } from "@/services/types";
import {
  useAddFavoriteMutation,
  useLazyGetDressQuery,
  useRemoveFavoriteMutation,
} from "@/services/apis";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  ArrowLeft,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Heart,
  Info,
  Mail,
  MessageCircle,
  RotateCcw,
  Share2,
  Shield,
  ShoppingBag,
  Star,
  Truck,
} from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { CreateOrderDialog } from "@/components/order/create-order-dialog";
import { formatPrice, getImages } from "@/lib/products-utils";
import { ImageGallery } from "@/components/image-gallery";
import { DressDescriptionTabs } from "@/components/dress/detail/dress-description-tabs";
import { DressFeedbackTabs } from "@/components/dress/detail/dress-feedbacks-tabs";
import { CreateChatButton } from "@/components/chat/create-chat-button";

const DressDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<"buy" | "rent" | null>(
    null
  );
  const [dress, setDress] = useState<IDress | null>(null);
  const [getDress, { isLoading }] = useLazyGetDressQuery();

  const fetchDress = async () => {
    try {
      const { statusCode, message, item } = await getDress(
        id as string
      ).unwrap();
      if (statusCode === 200) {
        setDress(item);
      } else {
        console.error("Failed to fetch dress:", message);
      }
    } catch (error) {
      console.error("Failed to fetch dress:", error);
    }
  };

  const [favorDress, { isLoading: isFavoriting }] = useAddFavoriteMutation();
  const [unfavorDress, { isLoading: isUnfavoriting }] =
    useRemoveFavoriteMutation();
  const toggleFavorite = useCallback(async () => {
    if (dress) {
      if (dress.isFavorite) {
        try {
          const { statusCode, message } = await unfavorDress(dress.id).unwrap();
          if (statusCode === 200) {
            toast.success("Đã bỏ yêu thích váy cưới!");
            fetchDress();
          } else {
            console.error("Failed to unfavorite dress:", message);
          }
        } catch (error) {
          console.log("Failed to unfavorite dress:", error);
        }
      } else {
        try {
          const { statusCode, message } = await favorDress(dress.id).unwrap();
          if (statusCode === 200) {
            toast.success("Đã thêm yêu thích váy cưới!");
            fetchDress();
          } else {
            console.error("Failed to favorite dress:", message);
          }
        } catch (error) {
          console.log("Failed to favorite dress:", error);
        }
      }
    }
  }, [dress, favorDress, unfavorDress, fetchDress]);

  useEffect(() => {
    if (id) {
      fetchDress();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-24 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <div className="aspect-[3/4] bg-gray-200 rounded-lg"></div>
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gray-200 rounded-md"
                  ></div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="space-y-4">
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!dress) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Không tìm thấy váy cưới
          </h1>
          <Button onClick={() => router.push("/browse")}>
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  // Get processed image URLs
  const images = getImages(dress.images);

  const handleShare = async () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Đã sao chép liên kết!");
  };

  const userName = dress.user ? dress.user.shop?.name : "Unknown User";

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Quay lại
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <ImageGallery images={images} alt={dress.name} />

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {dress.name}
                </h1>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={dress.user?.shop?.logoUrl || "/placeholder.svg"}
                      />
                      <AvatarFallback>
                        {(userName || "Shop").charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-gray-600">
                      Thiết kế bởi {userName}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleFavorite}
                  className={
                    dress.isFavorite ? "text-rose-500 border-rose-500" : ""
                  }
                  aria-label={
                    dress.isFavorite ? "Bỏ yêu thích" : "Thêm vào yêu thích"
                  }
                >
                  <Heart
                    className={`h-4 w-4 ${
                      dress.isFavorite ? "fill-current" : ""
                    }`}
                  />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleShare}
                  aria-label="Chia sẻ"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(dress.ratingAverage)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="font-medium">{dress.ratingAverage}</span>
              <span className="text-gray-600">
                ({dress.ratingCount} đánh giá)
              </span>
            </div>
          </div>

          {/* Pricing Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Tùy chọn mua hàng</h3>

            {dress.isSellable && (
              <Card
                className={`cursor-pointer transition-all ${
                  selectedOption === "buy"
                    ? "border-rose-500 bg-rose-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedOption("buy")}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Mua sở hữu</h4>
                      <p className="text-sm text-gray-600">
                        Sở hữu vĩnh viễn chiếc váy
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        {formatPrice(dress.sellPrice)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {dress.isRentable && (
              <Card
                className={`cursor-pointer transition-all ${
                  selectedOption === "rent"
                    ? "border-rose-500 bg-rose-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedOption("rent")}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Thuê váy</h4>
                      <p className="text-sm text-gray-600">
                        Thuê cho ngày cưới (3-7 ngày)
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        {formatPrice(dress.rentalPrice)}
                      </p>
                      <p className="text-sm text-gray-600">/ lần thuê</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <CreateOrderDialog
              dress={dress}
              trigger={
                <Button
                  className="w-full bg-rose-600 hover:bg-rose-700"
                  size="lg"
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Đặt hàng ngay
                </Button>
              }
            />
            <CreateChatButton
              shopId={dress.user?.shop?.id || ""}
              shopName={dress.user?.shop?.name || ""}
              shopAvatarUrl={dress.user?.shop?.logoUrl || ""}
              className="w-full bg-transparent"
            />
          </div>

          {/* Service Features */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <Shield className="h-6 w-6 mx-auto mb-2 text-rose-600" />
              <p className="text-xs text-gray-600">Bảo hành chất lượng</p>
            </div>
            <div className="text-center">
              <Truck className="h-6 w-6 mx-auto mb-2 text-rose-600" />
              <p className="text-xs text-gray-600">Giao hàng miễn phí</p>
            </div>
            <div className="text-center">
              <RotateCcw className="h-6 w-6 mx-auto mb-2 text-rose-600" />
              <p className="text-xs text-gray-600">Đổi trả 7 ngày</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Information Tabs */}
      <Tabs defaultValue="description" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="description">Mô tả</TabsTrigger>
          <TabsTrigger value="reviews">
            Đánh giá ({dress.feedbacks?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="designer">Nhà thiết kế</TabsTrigger>
          <TabsTrigger value="care">Hướng dẫn</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="space-y-6">
          <DressDescriptionTabs dress={dress} />
        </TabsContent>

        <TabsContent value="reviews" className="space-y-6">
          <DressFeedbackTabs dress={dress} />
        </TabsContent>

        <TabsContent value="designer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin nhà thiết kế</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={dress.user?.shop?.logoUrl || "/placeholder.svg"}
                  />
                  <AvatarFallback className="text-2xl">
                    {(userName || "Shop").charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{userName}</h3>
                  <p className="text-gray-600 mb-4">
                    Nhà thiết kế váy cưới chuyên nghiệp
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{dress.user?.email || "Không có thông tin"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Nhà thiết kế đã xác minh</span>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <Button variant="outline" size="sm">
                      Xem hồ sơ
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Nhắn tin
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="care" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Hướng dẫn bảo quản
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 mt-1">•</span>
                    <span>
                      Giặt khô chuyên nghiệp để đảm bảo chất lượng vải
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 mt-1">•</span>
                    <span>Tránh ánh nắng trực tiếp khi phơi khô</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 mt-1">•</span>
                    <span>Bảo quản ở nơi khô ráo, thoáng mát</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 mt-1">•</span>
                    <span>Sử dụng túi vải để treo, tránh móc nhựa</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 mt-1">•</span>
                    <span>Không sử dụng chất tẩy mạnh</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Chính sách đổi trả
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Đổi trả trong vòng 7 ngày</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Miễn phí giao hàng toàn quốc</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Bảo hành chất lượng 1 năm</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Hỗ trợ chỉnh sửa miễn phí</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Tư vấn size miễn phí</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DressDetailPage;
