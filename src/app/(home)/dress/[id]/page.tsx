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
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateOrderDialog } from "@/components/order/create-order-dialog";
import {
  formatPrice,
  getImages,
  parseNumber,
  formatRating,
} from "@/lib/products-utils";
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

  const fetchDress = useCallback(async () => {
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
  }, [getDress, id]);

  const [favorDress, { isLoading: isFavoriting }] = useAddFavoriteMutation();
  const [unfavorDress, { isLoading: isUnfavoriting }] =
    useRemoveFavoriteMutation();
  const toggleFavorite = useCallback(async () => {
    if (dress) {
      try {
        if (dress.isFavorite) {
          const { statusCode, message } = await unfavorDress(dress.id).unwrap();
          if (statusCode === 200) {
            toast.success("Đã bỏ yêu thích váy cưới!");
            setDress((prev) => (prev ? { ...prev, isFavorite: false } : null));
          } else {
            toast.error("Không thể bỏ yêu thích: " + message);
          }
        } else {
          const { statusCode, message } = await favorDress(dress.id).unwrap();
          if (statusCode === 200) {
            toast.success("Đã thêm yêu thích váy cưới!");
            setDress((prev) => (prev ? { ...prev, isFavorite: true } : null));
          } else {
            toast.error("Không thể thêm yêu thích: " + message);
          }
        }
      } catch (error) {
        console.error("Failed to toggle favorite:", error);
        toast.error("Có lỗi xảy ra, vui lòng thử lại!");
      }
    }
  }, [dress, favorDress, unfavorDress]);

  useEffect(() => {
    if (id) {
      fetchDress();
    }
  }, [fetchDress, id]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <div className="aspect-[3/4] bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-gray-200 rounded-md animate-pulse"
                ></div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="h-4 w-4 bg-gray-200 rounded animate-pulse"
                    ></div>
                  ))}
                </div>
                <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
              <div className="space-y-3">
                <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
            </div>

            <div className="grid grid-cols-4 gap-4 pt-4 border-t">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="text-center space-y-2">
                  <div className="h-6 w-6 bg-gray-200 rounded mx-auto animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-10 bg-gray-200 rounded animate-pulse"
              ></div>
            ))}
          </div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!dress && !isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="mx-auto w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="h-16 w-16 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Không tìm thấy váy cưới
          </h1>
          <p className="text-gray-600 mb-6">
            Váy cưới bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <Button
            onClick={() => router.push("/browse")}
            className="bg-rose-600 hover:bg-rose-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  const images = getImages(dress?.images || "");

  const handleShare = async () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Đã sao chép liên kết!");
  };

  const userName = dress?.user ? dress.user.shop?.name : "Unknown User";

  if (!dress) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Quay lại
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <ImageGallery images={images} alt={dress.name} />

        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {dress.name}
                  </h1>
                  {dress.isFavorite && (
                    <Badge className="bg-gradient-to-r from-rose-500 to-pink-500 text-white">
                      <Heart className="h-3 w-3 mr-1 fill-current" />
                      Yêu thích
                    </Badge>
                  )}
                </div>
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
                  disabled={isFavoriting || isUnfavoriting}
                  className={`transition-all duration-200 group relative ${
                    dress.isFavorite
                      ? "text-rose-500 border-rose-500 bg-rose-50 hover:bg-rose-100"
                      : "hover:border-rose-300 hover:text-rose-500"
                  }`}
                  aria-label={
                    dress.isFavorite ? "Bỏ yêu thích" : "Thêm vào yêu thích"
                  }
                >
                  {isFavoriting || isUnfavoriting ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-rose-500"></div>
                  ) : (
                    <Heart
                      className={`h-4 w-4 transition-all duration-200 ${
                        dress.isFavorite ? "fill-current" : ""
                      }`}
                    />
                  )}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                    {dress.isFavorite ? "Bỏ yêu thích" : "Thêm yêu thích"}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleShare}
                  aria-label="Chia sẻ"
                  className="hover:border-blue-300 hover:text-blue-500"
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
                      i < Math.floor(parseNumber(dress.ratingAverage))
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="font-medium">
                {formatRating(dress.ratingAverage)}
              </span>
              <span className="text-gray-600">
                ({dress.ratingCount} đánh giá)
              </span>
            </div>
          </div>

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
                        {formatPrice(parseNumber(dress.sellPrice))}
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
                        {formatPrice(parseNumber(dress.rentalPrice))}
                      </p>
                      <p className="text-sm text-gray-600">/ lần thuê</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-3">
            <CreateOrderDialog
              dress={dress}
              trigger={
                <Button
                  className="w-full bg-rose-600 hover:bg-rose-700"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                  ) : (
                    <ShoppingBag className="h-4 w-4 mr-2" />
                  )}
                  {isLoading ? "Đang tải..." : "Đặt hàng ngay"}
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

          <div className="grid grid-cols-4 gap-4 pt-4 border-t">
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
            <div className="text-center">
              <Heart className="h-6 w-6 mx-auto mb-2 text-rose-600" />
              <p className="text-xs text-gray-600">
                {dress.isFavorite ? "Đã yêu thích" : "Thêm yêu thích"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="description" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="description" disabled={isLoading}>
            {isLoading ? "Đang tải..." : "Mô tả"}
          </TabsTrigger>
          <TabsTrigger value="reviews" disabled={isLoading}>
            {isLoading
              ? "Đang tải..."
              : `Đánh giá (${dress.feedbacks?.length || 0})`}
          </TabsTrigger>
          <TabsTrigger value="designer" disabled={isLoading}>
            {isLoading ? "Đang tải..." : "Nhà thiết kế"}
          </TabsTrigger>
          <TabsTrigger value="care" disabled={isLoading}>
            {isLoading ? "Đang tải..." : "Hướng dẫn"}
          </TabsTrigger>
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
