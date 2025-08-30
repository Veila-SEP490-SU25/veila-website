"use client";

import type React from "react";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Plus, Loader2, Save, Edit } from "lucide-react";
import {
  useCreateAccessoryMutation,
  useUpdateAccessoryMutation,
} from "@/services/apis";
import {
  AccessoryStatus,
  IAccessory,
  ICreateAccessory,
  IUpdateAccessory,
} from "@/services/types";
import { toast } from "sonner";
import { ImagesUpload } from "@/components/images-upload";

interface UpdateAccessoryDialogProps {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
  accessory: IAccessory;
}

export function UpdateAccessoryDialog({
  trigger,
  onSuccess,
  accessory,
}: UpdateAccessoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [updateAccessory, { isLoading }] = useUpdateAccessoryMutation();

  const [accessoryData, setAccessoryData] = useState<IUpdateAccessory>({
    id: accessory.id,
    categoryId: accessory.categoryId || "",
    name: accessory.name,
    description: accessory.description || "",
    sellPrice: parseInt(accessory.sellPrice.toString()),
    rentalPrice: parseInt(accessory.rentalPrice.toString()),
    isSellable: accessory.isSellable,
    isRentable: accessory.isRentable,
    status: AccessoryStatus.AVAILABLE,
    images: accessory.images || "",
  });

  const [imageUrls, setImageUrls] = useState<string>(accessory.images || "");

  const handleInputChange = (field: keyof IUpdateAccessory, value: any) => {
    setAccessoryData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setAccessoryData({
      id: accessory.id,
      categoryId: accessory.categoryId || "",
      name: accessory.name,
      description: accessory.description || "",
      sellPrice: parseInt(accessory.sellPrice.toString()),
      rentalPrice: parseInt(accessory.rentalPrice.toString()),
      isSellable: accessory.isSellable,
      isRentable: accessory.isRentable,
      status: AccessoryStatus.AVAILABLE,
      images: accessory.images || "",
    });
    setImageUrls(accessory.images || "");
  };

  const handleSubmit = async () => {
    try {
      const { statusCode, message } = await updateAccessory(
        accessoryData
      ).unwrap();
      if (statusCode === 204) {
        toast.success("Cập nhật phụ kiện thành công!");
        setOpen(false);
        resetForm();
        onSuccess?.();
      } else {
        toast.error(message || "Có lỗi xảy ra khi cập nhật phụ kiện");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật phụ kiện");
    }
  };

  const handleCancel = () => {
    setOpen(false);
    resetForm();
  };

  useEffect(() => {
    handleInputChange("images", imageUrls);
  }, [imageUrls]);

  const defaultTrigger = (
    <Button className="bg-rose-600 hover:bg-rose-700">
      <Edit className="h-4 w-4 mr-2" />
      Chỉnh sửa phụ kiện
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="min-w-[90vw] md:min-w-5xl max-w-5xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Chỉnh sửa phụ kiện
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="grid grid-cols-1 gap-6">
            {/* Main Information */}
            <div className="lg:col-span-1 space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Thông tin cơ bản</h3>

                <div className="space-y-2">
                  <Label htmlFor="name">Tên váy *</Label>
                  <Input
                    id="name"
                    placeholder="Nhập tên phụ kiện"
                    value={accessoryData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả *</Label>
                  <Textarea
                    id="description"
                    placeholder="Nhập mô tả chi tiết về phụ kiện"
                    value={accessoryData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    rows={3}
                  />
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Giá cả</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Có thể bán *</Label>
                    <p className="text-sm text-muted-foreground">
                      Cho phép khách hàng mua váy này
                    </p>
                  </div>
                  <Switch
                    checked={accessoryData.isSellable}
                    onCheckedChange={(checked) =>
                      handleInputChange("isSellable", checked)
                    }
                  />
                </div>

                {accessoryData.isSellable && (
                  <div className="space-y-2">
                    <Label htmlFor="sellPrice">Giá bán (VNĐ) *</Label>
                    <Input
                      id="sellPrice"
                      type="number"
                      placeholder="0"
                      value={accessoryData.sellPrice || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "sellPrice",
                          Number.parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                )}

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Có thể thuê *</Label>
                    <p className="text-sm text-muted-foreground">
                      Cho phép khách hàng thuê váy này
                    </p>
                  </div>
                  <Switch
                    checked={accessoryData.isRentable}
                    onCheckedChange={(checked) =>
                      handleInputChange("isRentable", checked)
                    }
                  />
                </div>

                {accessoryData.isRentable && (
                  <div className="space-y-2">
                    <Label htmlFor="rentalPrice">Giá thuê (VNĐ) *</Label>
                    <Input
                      id="rentalPrice"
                      type="number"
                      placeholder="0"
                      value={accessoryData.rentalPrice || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "rentalPrice",
                          Number.parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Images */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Hình ảnh *</h3>
                  <div className="flex gap-2">
                    <ImagesUpload
                      imageUrls={imageUrls}
                      setImageUrls={(urls) => setImageUrls(urls)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            <X className="h-4 w-4 mr-2" />
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-rose-600 hover:bg-rose-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang tạo...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Lưu phụ kiện
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
