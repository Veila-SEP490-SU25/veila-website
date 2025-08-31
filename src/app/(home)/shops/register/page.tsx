"use client";

import type React from "react";

import { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import {
  Store,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  AlertCircle,
  Camera,
  FileText,
  Clock,
  Shield,
  Building,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ImagesUpload } from "@/components/images-upload";
import { LocationInput } from "@/components/location-input";
import { ICreateShop, IShop } from "@/services/types";
import {
  useCreateShopMutation,
  useRecreateShopMutation,
  useLazyGetMyShopQuery,
} from "@/services/apis";
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
  const [shopInfo, setShopInfo] = useState<IShop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [createShop, { isLoading: isSubmitting }] = useCreateShopMutation();
  const [recreateShop, { isLoading: isRecreating }] = useRecreateShopMutation();
  const [getMyShop] = useLazyGetMyShopQuery();

  useEffect(() => {
    const checkShopStatus = async () => {
      try {
        const { statusCode, item } = await getMyShop().unwrap();
        if (statusCode === 200 && item) {
          setShopInfo(item);
        }
      } catch {
      } finally {
        setIsLoading(false);
      }
    };

    checkShopStatus();
  }, [getMyShop]);

  const handleInputChange = (field: keyof ICreateShop, value: string) => {
    setShopData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const isRejected = shopInfo?.license?.status === "REJECTED";

      const response = isRejected
        ? await recreateShop(shopData).unwrap()
        : await createShop(shopData).unwrap();

      if (
        response &&
        (response.statusCode === 202 ||
          response.statusCode === 200 ||
          response.statusCode === 201)
      ) {
        setIsSubmitted(true);
        setIsEditing(false);

        toast.success(
          isRejected
            ? "Cập nhật đơn đăng ký thành công!"
            : "Đăng ký mở shop thành công!",
          {
            description: "Chúng tôi sẽ xem xét đơn đăng ký của bạn.",
          }
        );

        try {
          const refreshResponse = await getMyShop().unwrap();
          if (refreshResponse.statusCode === 200 && refreshResponse.item) {
            setShopInfo(refreshResponse.item);
          }
        } catch (refreshError) {
          console.error("Failed to refresh shop info:", refreshError);
        }
      } else {
        const errorMessage = response?.message || "Không xác định được lỗi";
        toast.error(
          isRejected
            ? "Cập nhật đơn đăng ký thất bại. Vui lòng thử lại."
            : "Đăng ký mở shop thất bại. Vui lòng thử lại.",
          {
            description: errorMessage,
          }
        );
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Đã xảy ra lỗi khi gửi đơn đăng ký.", {
        description: "Vui lòng đợi trước khi thử lại.",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Đang xem xét
          </Badge>
        );
      case "ACTIVE":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Đang hoạt động
          </Badge>
        );
      case "INACTIVE":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Tạm ngưng hoạt động
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            <Clock className="h-3 w-3 mr-1" />
            {status}
          </Badge>
        );
    }
  };

  const getLicenseStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Đang xem xét
          </Badge>
        );
      case "ACTIVE":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Đang hoạt động
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Bị từ chối
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            {status}
          </Badge>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-6">
              <div className="h-48 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (shopInfo && !isEditing) {
    return (
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Thông tin cửa hàng
            </h1>
            {getStatusBadge(shopInfo.status)}
          </div>
          <p className="text-gray-600">
            Thông tin chi tiết về cửa hàng của bạn và trạng thái đăng ký
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-rose-600" />
                  Thông tin cơ bản
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Tên cửa hàng
                    </Label>
                    <p className="text-lg font-semibold">{shopInfo.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Trạng thái
                    </Label>
                    <div className="mt-1">
                      {getStatusBadge(shopInfo.status)}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Số điện thoại
                    </Label>
                    <p className="text-lg">{shopInfo.phone}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Email
                    </Label>
                    <p className="text-lg">{shopInfo.email}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Địa chỉ
                  </Label>
                  <p className="text-lg">{shopInfo.address}</p>
                </div>
                {shopInfo.description && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Mô tả
                    </Label>
                    <p className="text-lg">{shopInfo.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Giấy phép kinh doanh
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Trạng thái giấy phép
                    </Label>
                    <div className="mt-1">
                      {getLicenseStatusBadge(
                        shopInfo.license?.status || "PENDING"
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <Label className="text-sm font-medium text-gray-600">
                      Ngày tạo
                    </Label>
                    <p className="text-sm">
                      {new Date(
                        shopInfo.license?.createdAt || ""
                      ).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>
                {shopInfo.license?.rejectReason && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Lý do từ chối:</strong>{" "}
                      {shopInfo.license.rejectReason}
                    </AlertDescription>
                  </Alert>
                )}
                {(shopInfo.license as any)?.images && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Hình ảnh giấy phép
                    </Label>
                    <div className="mt-2">
                      <Image
                        src={(shopInfo.license as any).images}
                        alt="Giấy phép kinh doanh"
                        width={400}
                        height={300}
                        className="max-w-full h-auto rounded-lg border"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Thống kê
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {shopInfo.isVerified ? "Đã xác minh" : "Chưa xác minh"}
                    </div>
                    <div className="text-sm text-gray-600">
                      Trạng thái xác minh
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {new Date(shopInfo.createdAt).toLocaleDateString("vi-VN")}
                    </div>
                    <div className="text-sm text-gray-600">Ngày đăng ký</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Trạng thái hiện tại</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-rose-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    ✓
                  </div>
                  <div>
                    <p className="font-medium text-sm">Đã gửi đơn đăng ký</p>
                    <p className="text-xs text-gray-600">Hoàn thành</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                      shopInfo.status === "PENDING"
                        ? "bg-yellow-500"
                        : shopInfo.status === "ACTIVE"
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  >
                    {shopInfo.status === "PENDING"
                      ? "2"
                      : shopInfo.status === "ACTIVE"
                      ? "✓"
                      : "!"}
                  </div>
                  <div>
                    <p className="font-medium text-sm">Xem xét tài liệu</p>
                    <p className="text-xs text-gray-600">
                      {shopInfo.status === "PENDING"
                        ? "Đang xử lý"
                        : shopInfo.status === "ACTIVE"
                        ? "Hoàn thành"
                        : "Bị từ chối"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                      shopInfo.status === "ACTIVE"
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  >
                    {shopInfo.status === "ACTIVE" ? "✓" : "3"}
                  </div>
                  <div>
                    <p className="font-medium text-sm">Phê duyệt & thiết lập</p>
                    <p className="text-xs text-gray-600">
                      {shopInfo.status === "ACTIVE"
                        ? "Hoàn thành"
                        : "Chờ phê duyệt"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {shopInfo.status === "ACTIVE" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Hành động</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    asChild
                    className="w-full bg-rose-600 hover:bg-rose-700"
                  >
                    <Link href="/shops/my">Quản lý cửa hàng</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/profile">Về trang cá nhân</Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {shopInfo.license?.status === "REJECTED" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Hành động</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={() => {
                      setIsEditing(true);
                      setShopData({
                        name: shopInfo.name,
                        phone: shopInfo.phone,
                        email: shopInfo.email,
                        address: shopInfo.address,
                        licenseImages: (shopInfo.license as any)?.images || "",
                      });
                      console.log("isEditing set to true");
                    }}
                    className="w-full bg-rose-600 hover:bg-rose-700"
                  >
                    Chỉnh sửa đơn đăng ký
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/profile">Về trang cá nhân</Link>
                  </Button>
                </CardContent>
              </Card>
            )}

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

<<<<<<< Updated upstream
=======
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Đang xem xét
          </Badge>
        );
      case "ACTIVE":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Đang hoạt động
          </Badge>
        );
      case "INACTIVE":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Tạm ngưng hoạt động
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            <Clock className="h-3 w-3 mr-1" />
            {status}
          </Badge>
        );
    }
  };

  const getLicenseStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Đang xem xét
          </Badge>
        );
      case "ACTIVE":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Đang hoạt động
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Bị từ chối
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            {status}
          </Badge>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-6">
              <div className="h-48 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (shopInfo && !isEditing) {
    return (
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Thông tin cửa hàng
            </h1>
            {getStatusBadge(shopInfo.status)}
          </div>
          <p className="text-gray-600">
            Thông tin chi tiết về cửa hàng của bạn và trạng thái đăng ký
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-rose-600" />
                  Thông tin cơ bản
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Tên cửa hàng
                    </Label>
                    <p className="text-lg font-semibold">{shopInfo.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Trạng thái
                    </Label>
                    <div className="mt-1">
                      {getStatusBadge(shopInfo.status)}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Số điện thoại
                    </Label>
                    <p className="text-lg">{shopInfo.phone}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Email
                    </Label>
                    <p className="text-lg">{shopInfo.email}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Địa chỉ
                  </Label>
                  <p className="text-lg">{shopInfo.address}</p>
                </div>
                {shopInfo.description && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Mô tả
                    </Label>
                    <p className="text-lg">{shopInfo.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Giấy phép kinh doanh
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Trạng thái giấy phép
                    </Label>
                    <div className="mt-1">
                      {getLicenseStatusBadge(
                        shopInfo.license?.status || "PENDING"
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <Label className="text-sm font-medium text-gray-600">
                      Ngày tạo
                    </Label>
                    <p className="text-sm">
                      {new Date(
                        shopInfo.license?.createdAt || ""
                      ).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>
                {shopInfo.license?.rejectReason && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Lý do từ chối:</strong>{" "}
                      {shopInfo.license.rejectReason}
                    </AlertDescription>
                  </Alert>
                )}
                {(shopInfo.license as any)?.images && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Hình ảnh giấy phép
                    </Label>
                    <div className="mt-2">
                      <Image
                        src={(shopInfo.license as any).images}
                        alt="Giấy phép kinh doanh"
                        width={400}
                        height={300}
                        className="max-w-full h-auto rounded-lg border"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Thống kê
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {shopInfo.isVerified ? "Đã xác minh" : "Chưa xác minh"}
                    </div>
                    <div className="text-sm text-gray-600">
                      Trạng thái xác minh
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {new Date(shopInfo.createdAt).toLocaleDateString("vi-VN")}
                    </div>
                    <div className="text-sm text-gray-600">Ngày đăng ký</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Trạng thái hiện tại</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-rose-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    ✓
                  </div>
                  <div>
                    <p className="font-medium text-sm">Đã gửi đơn đăng ký</p>
                    <p className="text-xs text-gray-600">Hoàn thành</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                      shopInfo.status === "PENDING"
                        ? "bg-yellow-500"
                        : shopInfo.status === "ACTIVE"
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  >
                    {shopInfo.status === "PENDING"
                      ? "2"
                      : shopInfo.status === "ACTIVE"
                      ? "✓"
                      : "!"}
                  </div>
                  <div>
                    <p className="font-medium text-sm">Xem xét tài liệu</p>
                    <p className="text-xs text-gray-600">
                      {shopInfo.status === "PENDING"
                        ? "Đang xử lý"
                        : shopInfo.status === "ACTIVE"
                        ? "Hoàn thành"
                        : "Bị từ chối"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                      shopInfo.status === "ACTIVE"
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  >
                    {shopInfo.status === "ACTIVE" ? "✓" : "3"}
                  </div>
                  <div>
                    <p className="font-medium text-sm">Phê duyệt & thiết lập</p>
                    <p className="text-xs text-gray-600">
                      {shopInfo.status === "ACTIVE"
                        ? "Hoàn thành"
                        : "Chờ phê duyệt"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {shopInfo.status === "ACTIVE" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Hành động</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    asChild
                    className="w-full bg-rose-600 hover:bg-rose-700"
                  >
                    <Link href="/shops/my">Quản lý cửa hàng</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/profile">Về trang cá nhân</Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {shopInfo.license?.status === "REJECTED" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Hành động</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={() => {
                      setIsEditing(true);
                      setShopData({
                        name: shopInfo.name,
                        phone: shopInfo.phone,
                        email: shopInfo.email,
                        address: shopInfo.address,
                        licenseImages: (shopInfo.license as any)?.images || "",
                      });
                      console.log("isEditing set to true");
                    }}
                    className="w-full bg-rose-600 hover:bg-rose-700"
                  >
                    Chỉnh sửa đơn đăng ký
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/profile">Về trang cá nhân</Link>
                  </Button>
                </CardContent>
              </Card>
            )}

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

>>>>>>> Stashed changes
  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 md:px-6 lg:px-8 py-16">
        <Card className="text-center">
          <CardContent className="p-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {isEditing
                ? "Cập nhật đơn đăng ký thành công!"
                : "Đăng ký cửa hàng thành công!"}
            </h1>
            <p className="text-gray-600 mb-8">
              {isEditing
                ? "Đơn đăng ký của bạn đã được cập nhật thành công. Đội ngũ của chúng tôi sẽ xem xét lại và phản hồi cho bạn trong vòng 2-3 ngày làm việc."
                : "Đăng ký cửa hàng của bạn đã được gửi thành công. Đội ngũ của chúng tôi sẽ xem xét đơn đăng ký và phản hồi cho bạn trong vòng 2-3 ngày làm việc."}
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
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          {isEditing && (
            <Button
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                setShopData({
                  name: "",
                  phone: "",
                  email: "",
                  address: "",
                  licenseImages: "",
                });
              }}
              className="flex items-center gap-2"
            >
              ← Quay lại
            </Button>
          )}
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isEditing
            ? "Cập nhật đơn đăng ký cửa hàng"
            : "Đăng ký cửa hàng của bạn"}
        </h1>
        <p className="text-gray-600">
          {isEditing
            ? "Cập nhật thông tin đơn đăng ký và gửi lại để được xem xét"
            : "Tham gia Veila với tư cách là nhà cung cấp và bắt đầu cung cấp dịch vụ váy cưới cho các cô dâu trên toàn thế giới"}
        </p>
      </div>

      {!isEditing && (
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
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {isEditing &&
            shopInfo &&
            (shopInfo as IShop).license?.rejectReason && (
              <Alert className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Lý do từ chối:</strong>{" "}
                  {(shopInfo as IShop).license?.rejectReason}
                </AlertDescription>
              </Alert>
            )}
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

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      isRecreating ||
                      !shopData.name ||
                      !shopData.phone ||
                      !shopData.email ||
                      !shopData.address ||
                      !shopData.licenseImages
                    }
                    className="flex-1 bg-rose-600 hover:bg-rose-700"
                  >
                    {isSubmitting || isRecreating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {isEditing ? "Cập nhật đơn đăng ký" : "Gửi đăng ký"}
                      </>
                    )}
                  </Button>
                  {isEditing && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setShopData({
                          name: "",
                          phone: "",
                          email: "",
                          address: "",
                          licenseImages: "",
                        });
                      }}
                      className="px-6"
                    >
                      Hủy chỉnh sửa
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
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
