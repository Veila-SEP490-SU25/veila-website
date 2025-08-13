"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Store,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  AlertCircle,
  Camera,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { ImagesUpload } from "@/components/images-upload";
import { LocationInput } from "@/components/location-input";
import { ICreateShop } from "@/services/types";
import { useCreateShopMutation } from "@/services/apis";
import { toast } from "sonner";

export default function ShopRegisterPage() {
  const [shopData, setShopData] = useState<ICreateShop>({
    name: "",
    phone: "",
    email: "",
    address: "",
    licenseImages: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (field: keyof ICreateShop, value: string) => {
    setShopData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const [createShop, { isLoading: isSubmitting }] = useCreateShopMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { statusCode, message } = await createShop(shopData).unwrap();
      if (statusCode === 201) {
        setIsSubmitted(true);
        toast.success("Đăng ký mở shop thành công!", {
          description: "Chúng tôi sẽ xem xét đơn đăng ký của bạn.",
        });
      } else {
        toast.error("Đăng ký mở shop thất bại. Vui lòng thử lại.", {
          description: message,
        });
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi đăng ký mở shop.", {
        description: "Vui lòng đợi trước khi đăng ký lại.",
      });
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 md:px-6 lg:px-8 py-16">
        <Card className="text-center">
          <CardContent className="p-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Đăng ký cửa hàng thành công!
            </h1>
            <p className="text-gray-600 mb-8">
              Đăng ký cửa hàng của bạn đã được gửi thành công. Đội ngũ của chúng
              tôi sẽ xem xét đơn đăng ký và phản hồi cho bạn trong vòng 2-3 ngày
              làm việc.
            </p>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Tiếp theo sẽ như thế nào?
                </h3>
                <ul className="text-sm text-gray-600 space-y-1 text-left">
                  <li>
                    • Đội ngũ của chúng tôi sẽ xác minh giấy phép kinh doanh
                  </li>
                  <li>• Bạn sẽ nhận được email xác nhận khi được phê duyệt</li>
                  <li>
                    • Quyền truy cập vào bảng điều khiển nhà cung cấp sẽ được
                    cấp
                  </li>
                  <li>• Bạn có thể bắt đầu đăng sản phẩm và dịch vụ</li>
                </ul>
              </div>
              <div className="flex gap-4 justify-center">
                <Button asChild className="bg-rose-600 hover:bg-rose-700">
                  <Link href="/profile">Về trang cá nhân</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4"></div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Đăng ký cửa hàng của bạn
        </h1>
        <p className="text-gray-600">
          Tham gia Veila với tư cách là nhà cung cấp và bắt đầu cung cấp dịch vụ
          váy cưới cho các cô dâu trên toàn thế giới
        </p>
      </div>

      {/* Benefits Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-rose-200 bg-rose-50">
          <CardContent className="p-6 text-center">
            <Store className="h-8 w-8 text-rose-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">
              Mở rộng tầm với
            </h3>
            <p className="text-sm text-gray-600">
              Kết nối với các cô dâu từ khắp nơi trên thế giới
            </p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6 text-center">
            <FileText className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">
              Quản lý dễ dàng
            </h3>
            <p className="text-sm text-gray-600">
              Quản lý đơn hàng, kho hàng và khách hàng tại một nơi
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">
              Nền tảng đáng tin cậy
            </h3>
            <p className="text-sm text-gray-600">
              Tham gia mạng lưới các nhà cung cấp chất lượng đã được xác minh
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5 text-rose-600" />
                Thông tin cửa hàng
              </CardTitle>
              <CardDescription>
                Vui lòng cung cấp thông tin chính xác về doanh nghiệp của bạn.
                Tất cả các trường đều bắt buộc để xác minh.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Shop Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <Store className="h-4 w-4" />
                    Tên cửa hàng *
                  </Label>
                  <Input
                    id="name"
                    value={shopData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Nhập tên cửa hàng của bạn"
                    required
                  />
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Số điện thoại *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={shopData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder="0901234567"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Địa chỉ email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={shopData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="shop@example.com"
                      required
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Địa chỉ kinh doanh *
                  </Label>
                  <LocationInput
                    location={shopData.address}
                    setLocation={(location) =>
                      handleInputChange("address", location)
                    }
                  />
                </div>

                {/* License Upload */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    Giấy phép kinh doanh *
                  </Label>
                  <ImagesUpload
                    imageUrls={shopData.licenseImages}
                    setImageUrls={(urls) =>
                      handleInputChange("licenseImages", urls)
                    }
                  />
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      !shopData.name ||
                      !shopData.phone ||
                      !shopData.email ||
                      !shopData.address ||
                      !shopData.licenseImages
                    }
                    className="flex-1 bg-rose-600 hover:bg-rose-700"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Gửi đăng ký
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Yêu cầu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">
                    Giấy phép kinh doanh hợp lệ
                  </p>
                  <p className="text-xs text-gray-600">Bắt buộc để xác minh</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">
                    Thông tin liên hệ đầy đủ
                  </p>
                  <p className="text-xs text-gray-600">
                    Điện thoại, email và địa chỉ
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Tiêu chuẩn chất lượng</p>
                  <p className="text-xs text-gray-600">
                    Cam kết về sự xuất sắc
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Process Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quy trình phê duyệt</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-rose-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium text-sm">Gửi đơn đăng ký</p>
                  <p className="text-xs text-gray-600">Hoàn thành biểu mẫu</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium text-sm">Xem xét tài liệu</p>
                  <p className="text-xs text-gray-600">1-2 ngày làm việc</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium text-sm">Phê duyệt & thiết lập</p>
                  <p className="text-xs text-gray-600">Kích hoạt tài khoản</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              Cần hỗ trợ? Liên hệ với đội ngũ hỗ trợ của chúng tôi tại{" "}
              <a
                href="mailto:veila.studio.mail@gmail.com"
                className="text-rose-600 hover:underline"
              >
                veila.studio.mail@gmail.com
              </a>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}
