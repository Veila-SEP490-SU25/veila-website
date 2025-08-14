"use client";

import { ShopApproveDialog } from "@/components/staff/shop/shop-approve-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useLazyStaffGetShopQuery } from "@/services/apis";
import { IShop, ShopStatus } from "@/services/types";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  AlertTriangle,
  Ban,
  Building,
  Calendar,
  CheckCircle,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Shield,
  ShieldCheck,
  Star,
  Trash2,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ShopDetailDialogProps {
  shopId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  onChange: () => Promise<void>;
}

export const ShopDetailDialog = ({
  shopId,
  open,
  setOpen,
  onChange,
}: ShopDetailDialogProps) => {
  const [getShop, { isLoading }] = useLazyStaffGetShopQuery();
  const [shop, setShop] = useState<IShop | null>(null);

  const fetchShop = async () => {
    try {
      const { statusCode, message, item } = await getShop(shopId).unwrap();
      if (statusCode === 200) {
        setShop(item);
      } else {
        toast.error("Đã có lỗi xảy ra khi lấy thông tin của hàng.", {
          description: message,
        });
      }
    } catch (error) {
      toast.error("Đã có lỗi xảy ra khi lấy thông tin của hàng.");
      setOpen(false);
    }
  };

  useEffect(() => {
    if (open && shopId) {
      fetchShop();
    }
  }, [open, shopId]);

  const getVerificationBadge = (isVerified: boolean) => {
    return isVerified ? (
      <Badge className="bg-blue-100 text-blue-700">
        <ShieldCheck className="h-3 w-3 mr-1" />
        Đã xác minh
      </Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-700">
        <Shield className="h-3 w-3 mr-1" />
        Chưa xác minh
      </Badge>
    );
  };

  const getStatusBadge = (status: ShopStatus) => {
    const statusConfig = {
      [ShopStatus.ACTIVE]: {
        label: "Hoạt động",
        className: "bg-green-100 text-green-700",
      },
      [ShopStatus.PENDING]: {
        label: "Chờ duyệt",
        className: "bg-yellow-100 text-yellow-700",
      },
      [ShopStatus.SUSPENDED]: {
        label: "Tạm khóa",
        className: "bg-red-100 text-red-700",
      },
      [ShopStatus.INACTIVE]: {
        label: "Tạm ngưng",
        className: "bg-gray-100 text-gray-700",
      },
      [ShopStatus.BANNED]: {
        label: "Bị cấm",
        className: "bg-red-200 text-red-800",
      },
    };
    const config = statusConfig[status];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[90vw] max-w-[90vw] md:max-w-4xl h-[90vh] p-0 overflow-hidden border-0">
        <DialogHeader className="bg-rose-200 p-4 text-left">
          <DialogTitle className="text-lg md:text-2xl">
            Thông tin chi tiết cửa hàng
          </DialogTitle>
          <DialogDescription className="text-sm md:text-base">
            {shop?.name}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-120px)]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              <span className="mt-2 text-gray-600">
                Đang tải thông tin cửa hàng...
              </span>
            </div>
          ) : shop ? (
            <div className="space-y-6 p-2 md:p-4">
              {/* Header Section - mobile first */}
              <div className="flex flex-col items-center gap-4 md:flex-row md:items-start md:gap-6">
                <Avatar className="h-20 w-20 md:h-24 md:w-24">
                  <AvatarImage
                    src={
                      shop.logoUrl ||
                      `/placeholder.svg?height=96&width=96&text=${
                        shop.name.charAt(0) || "S"
                      }`
                    }
                    alt={shop.name}
                  />
                  <AvatarFallback className="bg-rose-100 text-rose-600 text-2xl">
                    {shop.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 w-full">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 gap-2">
                    <h2 className="text-xl md:text-3xl font-bold text-gray-900 text-center">
                      {shop.name}
                    </h2>
                    <div className="flex items-center gap-2 flex-wrap justify-center">
                      {getStatusBadge(shop.status)}
                      {getVerificationBadge(shop.isVerified)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-base md:text-lg">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="font-semibold">{shop.reputation}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Contact Information - mobile first */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Thông Tin Liên Hệ
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-xs md:text-sm text-gray-500">
                          Email
                        </p>
                        <p className="font-medium break-all">{shop.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-xs md:text-sm text-gray-500">
                          Số điện thoại
                        </p>
                        <p className="font-medium">{shop.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                      <div>
                        <p className="text-xs md:text-sm text-gray-500">
                          Địa chỉ
                        </p>
                        <p className="font-medium break-all">{shop.address}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Thông Tin Thời Gian
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs md:text-sm text-gray-500">
                        Ngày tham gia
                      </p>
                      <p className="font-medium">
                        {new Date(shop.createdAt).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-gray-500">
                        Cập nhật lần cuối
                      </p>
                      <p className="font-medium">
                        {new Date(shop.updatedAt).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                    {shop.deletedAt && (
                      <div>
                        <p className="text-xs md:text-sm text-gray-500">
                          Ngày xóa
                        </p>
                        <p className="font-medium text-red-600">
                          {new Date(shop.deletedAt).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* License Images - full size, responsive, clickable */}
              {shop.license?.images && (
                <>
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                      Ảnh Giấy Phép
                    </h3>
                    <div className="flex flex-col gap-4">
                      {String(shop.license.images)
                        .split(",")
                        .map((image, index) => (
                          <div
                            key={index}
                            className="rounded-lg overflow-hidden border"
                          >
                            <a
                              href={image || "/placeholder.svg"}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img
                                src={image || "/placeholder.svg"}
                                alt={`${shop.name} license ${index + 1}`}
                                className="w-full h-auto object-contain max-h-[60vh]"
                              />
                            </a>
                          </div>
                        ))}
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              {/* Description */}
              {shop.description && (
                <>
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                      Mô Tả
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 leading-relaxed">
                        {shop.description}
                      </p>
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              {/* Cover Image */}
              {shop.coverUrl && (
                <>
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                      Ảnh Bìa
                    </h3>
                    <div className="rounded-lg overflow-hidden border">
                      <img
                        src={shop.coverUrl || "/placeholder.svg"}
                        alt={`${shop.name} cover`}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              {/* Additional Images */}
              {shop.images && (
                <>
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                      Hình Ảnh Khác
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {typeof shop.images === "string" ? (
                        <div className="rounded-lg overflow-hidden border">
                          <img
                            src={shop.images || "/placeholder.svg"}
                            alt={`${shop.name} image`}
                            className="w-full h-24 object-cover"
                          />
                        </div>
                      ) : (
                        String(shop.images)
                          .split(",")
                          .map((image, index) => (
                            <div
                              key={index}
                              className="rounded-lg overflow-hidden border"
                            >
                              <img
                                src={image || "/placeholder.svg"}
                                alt={`${shop.name} image ${index + 1}`}
                                className="w-full h-24 object-cover"
                              />
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              {/* Reject Reason */}
              {shop.rejectReason && (
                <>
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-red-700 mb-3 flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      Lý Do Từ Chối
                    </h3>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-700">{shop.rejectReason}</p>
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              {/* Action Buttons - mobile first */}
              <div className="flex flex-wrap gap-3 pt-4 items-center justify-center">
                {shop.status === ShopStatus.PENDING && (
                  <ShopApproveDialog
                    shopId={shop.id}
                    onChange={async () => {
                      await fetchShop();
                      await onChange();
                    }}
                  />
                )}
                {shop.status === ShopStatus.ACTIVE && (
                  <Button className="bg-rose-600">
                    <Ban className="h-4 w-4 mr-2" />
                    Tạm khóa
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Không tìm thấy thông tin cửa hàng</p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
