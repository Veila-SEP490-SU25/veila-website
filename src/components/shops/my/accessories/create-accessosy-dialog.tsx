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
import { X, Plus, Loader2, Save } from "lucide-react";
import { useCreateAccessoryMutation } from "@/services/apis";
import { AccessoryStatus, ICreateAccessory } from "@/services/types";
import { toast } from "sonner";
import { ImagesUpload } from "@/components/images-upload";

interface CreateAccessoryDialogProps {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function CreateAccessoryDialog({
  trigger,
  onSuccess,
}: CreateAccessoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [createAccessory, { isLoading }] = useCreateAccessoryMutation();

  const [accessoryData, setAccessoryData] = useState<ICreateAccessory>({
    categoryId: null,
    name: "",
    description: "",
    sellPrice: 0,
    rentalPrice: 0,
    isSellable: true,
    isRentable: true,
    status: AccessoryStatus.AVAILABLE,
    images: "",
  });

  const [imageUrls, setImageUrls] = useState<string>("");

  const handleInputChange = (field: keyof ICreateAccessory, value: any) => {
    setAccessoryData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setAccessoryData({
      categoryId: null,
      name: "",
      description: "",
      sellPrice: 0,
      rentalPrice: 0,
      isSellable: true,
      isRentable: true,
      status: AccessoryStatus.AVAILABLE,
      images: "",
    });
    setImageUrls("");
  };

  const handleSubmit = async () => {
    try {
      const { statusCode, message } = await createAccessory(
        accessoryData
      ).unwrap();
      if (statusCode === 201 || statusCode == 200) {
        toast.success("Tạo phụ kiện thành công!");
        setOpen(false);
        resetForm();
        onSuccess?.();
      } else {
        toast.error(message || "Có lỗi xảy ra khi tạo phụ kiện");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tạo phụ kiện");
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
      <Plus className="h-4 w-4 mr-2" />
      Thêm váy mới
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="min-w-[90vw] md:min-w-5xl max-w-5xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Tạo phụ kiện mới
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
                  <Label htmlFor="name">Tên phụ kiện *</Label>
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
                      Cho phép khách hàng mua phụ kiện này
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
                      Cho phép khách hàng thuê phụ kiện này
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
                Tạo phụ kiện
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
