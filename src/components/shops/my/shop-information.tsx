"use client";

import { UpdateShopInfoDialog } from "@/components/shops/my/upadte-shop-info-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { SingleImageUploadDialog } from "@/components/upload-image-dialog";
import { useUpdateShopInfoMutation } from "@/services/apis";
import { IShop, IUpdateShopInfo } from "@/services/types";
import { Camera, Edit } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface ShopInformationProps {
  shop: IShop;
}

export const ShopInformation = ({ shop }: ShopInformationProps) => {
  const [updateShopInfo, { isLoading: isUpdating }] =
    useUpdateShopInfoMutation();
  const [info, setInfo] = useState<IUpdateShopInfo>({
    name: shop.name,
    phone: shop.phone,
    email: shop.email,
    address: shop.address,
    coverUrl: shop.coverUrl || "",
    description: shop.description || "",
    logoUrl: shop.logoUrl || "",
  });

  const handleUpdateInfo = useCallback(async (info: IUpdateShopInfo) => {
    try {
      const { statusCode, message } = await updateShopInfo(info).unwrap();
      if (statusCode === 200) {
        toast.success("Cập nhật thông tin cửa hàng thành công");
      } else {
        toast.error("Có lỗi xảy ra khi cập nhật thông tin cửa hàng", {
          description: message,
        });
      }
    } catch (error) {
      toast.error(
        "Có lỗi xảy ra khi cập nhật thông tin cửa hàng vui lòng thử lại sau"
      );
    }
  }, [info, updateShopInfo]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Thông tin cửa hàng</span>
          <UpdateShopInfoDialog
            shop={shop}
            handleUpdateInfo={handleUpdateInfo}
            setInfo={setInfo}
            isUpdating={isUpdating}
            trigger={
              <Button variant="outline" size="sm" disabled={isUpdating}>
                <Edit className="h-4 w-4 mr-2" />
                Chỉnh sửa
              </Button>
            }
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Shop Images */}
        <div className="space-y-4">
          <div>
            <Label className="text-base font-medium">Ảnh bìa cửa hàng</Label>
            <div className="mt-2 relative">
              <div className="aspect-[3/1] overflow-hidden rounded-lg border-2 border-dashed border-gray-300">
                <Image
                  src={shop.coverUrl || "/placeholder.svg"}
                  alt="Shop Cover"
                  width={300}
                  height={100}
                  className="w-full h-full object-cover"
                />
              </div>
              <SingleImageUploadDialog
                imageUrl={shop.coverUrl || undefined}
                onImageChange={(url) =>
                  setInfo((prev) => ({ ...prev, coverUrl: url }))
                }
                trigger={
                  <Button className="absolute top-2 right-2" size="sm">
                    <Camera className="h-4 w-4 mr-2" />
                    Thay đổi
                  </Button>
                }
                handleUpload={() => handleUpdateInfo(info)}
              />
            </div>
          </div>

          <div>
            <Label className="text-base font-medium">Logo cửa hàng</Label>
            <div className="mt-2 flex items-center gap-4">
              <Avatar className="h-20 w-20 border-2 border-gray-200">
                <AvatarImage src={shop.logoUrl || "/placeholder.svg"} />
                <AvatarFallback className="text-xl">
                  {shop.name.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <SingleImageUploadDialog
                imageUrl={shop.logoUrl || undefined}
                onImageChange={(url) =>
                  setInfo((prev) => ({ ...prev, logoUrl: url }))
                }
                trigger={
                  <Button className="" size="sm">
                    <Camera className="h-4 w-4 mr-2" />
                    Tải lên ảnh đại diện mới
                  </Button>
                }
                handleUpload={() => handleUpdateInfo(info)}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Tên cửa hàng *</Label>
            <p className="text-sm p-2 bg-gray-50 rounded">{shop.name}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Số điện thoại *</Label>
            <p className="text-sm p-2 bg-gray-50 rounded">{shop.phone}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <p className="text-sm p-2 bg-gray-50 rounded">{shop.email}</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Địa chỉ *</Label>
          <p className="text-sm p-2 bg-gray-50 rounded">{shop.address}</p>
        </div>
      </CardContent>
    </Card>
  );
};
