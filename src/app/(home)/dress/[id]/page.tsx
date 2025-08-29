"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IDress } from "@/services/types";
import { useLazyGetDressQuery } from "@/services/apis";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  ArrowLeft,
  Calendar,
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

const DressDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<"buy" | "rent" | null>(
    null
  );
  const [isFavorite, setIsFavorite] = useState(false);
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

  useEffect(() => {
    if (id) {
      fetchDress();
    }
  }, [id]);

  const getImageUrls = (imagesString: string): string[] => {
    if (!imagesString)
      return ["/placeholder.svg?height=600&width=400&text=No+Image"];

    const urls = imagesString
      .split(",")
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    // If no valid URLs found, return placeholder
    if (urls.length === 0) {
      return ["/placeholder.svg?height=600&width=400&text=No+Image"];
    }

    return urls;
  };

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
  const images = getImageUrls(dress.images || "");

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: dress.name,
          text: `Xem váy cưới ${dress.name} tại Veila`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("Đã sao chép liên kết!");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
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
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={images[selectedImageIndex] || "/placeholder.svg"}
              alt={`${dress.name} - Ảnh ${selectedImageIndex + 1}`}
              fill
              className="object-cover"
              priority
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                const target = e.target as HTMLImageElement;
                target.src =
                  "/placeholder.svg?height=600&width=400&text=Image+Error";
              }}
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all"
                  aria-label="Ảnh trước"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all"
                  aria-label="Ảnh tiếp theo"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      selectedImageIndex === index ? "bg-white" : "bg-white/50"
                    }`}
                    aria-label={`Xem ảnh ${index + 1}`}
                  />
                ))}
              </div>
            )}
            {/* Image counter */}
            <div className="absolute top-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
              {selectedImageIndex + 1} / {images.length}
            </div>
          </div>

          {/* Thumbnail Gallery */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.slice(0, 4).map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square overflow-hidden rounded-md border-2 transition-all ${
                    selectedImageIndex === index
                      ? "border-rose-500"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  aria-label={`Xem ảnh ${index + 1}`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${dress.name} - Thumbnail ${index + 1}`}
                    width={100}
                    height={100}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "/placeholder.svg?height=100&width=100&text=Error";
                    }}
                  />
                  {images.length > 4 && index === 3 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm font-medium">
                      +{images.length - 4}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* View All Images Button */}
          {images.length > 4 && (
            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => {
                // Could open a modal or gallery view
                toast.info("Tính năng xem tất cả ảnh sẽ được cập nhật sớm!");
              }}
            >
              Xem tất cả {images.length} ảnh
            </Button>
          )}
        </div>

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
                  {dress.category && (
                    <Badge variant="outline">{dress.category.name}</Badge>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={isFavorite ? "text-rose-500 border-rose-500" : ""}
                  aria-label={
                    isFavorite ? "Bỏ yêu thích" : "Thêm vào yêu thích"
                  }
                >
                  <Heart
                    className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`}
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
                <Button className="w-full bg-rose-600 hover:bg-rose-700" size="lg">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Đặt hàng ngay
                </Button>
              }
            />
            <Button
              variant="outline"
              className="w-full bg-transparent"
              size="lg"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Nhắn tin với cửa hàng
            </Button>
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
          <Card>
            <CardHeader>
              <CardTitle>Mô tả sản phẩm</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {dress.description ||
                    "Không có mô tả chi tiết cho sản phẩm này."}
                </p>
              </div>
              <Separator className="my-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Thông tin sản phẩm</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Danh mục:</span>
                      <span>{dress.category?.name || "Chưa phân loại"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Trạng thái:</span>
                      <Badge variant="outline">{dress.status}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Có thể mua:</span>
                      <span>{dress.isSellable ? "Có" : "Không"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Có thể thuê:</span>
                      <span>{dress.isRentable ? "Có" : "Không"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Số lượng ảnh:</span>
                      <span>{images.length}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Đánh giá</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Điểm trung bình:</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{dress.ratingAverage}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Số lượt đánh giá:</span>
                      <span>{dress.ratingCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Đánh giá từ khách hàng</CardTitle>
            </CardHeader>
            <CardContent>
              {dress.feedbacks && dress.feedbacks.length > 0 ? (
                <div className="space-y-6">
                  {dress.feedbacks.map((feedback) => (
                    <div
                      key={feedback.id}
                      className="border-b pb-6 last:border-b-0"
                    >
                      <div className="flex items-start gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={
                              feedback.customer.firstName || "/placeholder.svg"
                            }
                          />
                          <AvatarFallback>
                            {feedback.customer.firstName?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">
                              {feedback.customer.firstName ||
                                "Người dùng ẩn danh"}
                            </span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < feedback.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-700 mb-2">
                            {feedback.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    Chưa có đánh giá nào cho sản phẩm này.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
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
