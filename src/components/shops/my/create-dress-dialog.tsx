"use client";

import type React from "react";

import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Plus, Loader2, Save } from "lucide-react";
import Image from "next/image";
import {
  useCreateDressMutation,
  useLazyGetMyShopCategoriesQuery,
} from "@/services/apis";
import { DressStatus, type ICreateDress } from "@/services/types";
import { toast } from "sonner";

interface CreateDressDialogProps {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function CreateDressDialog({
  trigger,
  onSuccess,
}: CreateDressDialogProps) {
  const [open, setOpen] = useState(false);
  const [createDress, { isLoading }] = useCreateDressMutation();
  const [getCategories, { data: categoriesResponse }] =
    useLazyGetMyShopCategoriesQuery();

  const [dressData, setDressData] = useState<ICreateDress>({
    categoryId: "",
    name: "",
    description: "",
    sellPrice: 0,
    rentalPrice: 0,
    isSellable: true,
    isRentable: true,
    status: DressStatus.AVAILABLE,
    images: "",
    bust: 0,
    waist: 0,
    hip: 0,
    material: "",
    color: "",
    length: "",
    neckline: "",
    sleeve: "",
  });

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");

  const categories = categoriesResponse?.items || [];

  useEffect(() => {
    if (open) {
      getCategories({ page: 0, size: 100, filter: "", sort: "" });
    }
  }, [open, getCategories]);

  const handleInputChange = (field: keyof ICreateDress, value: any) => {
    setDressData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addImageUrl = () => {
    if (newImageUrl.trim() && !imageUrls.includes(newImageUrl.trim())) {
      const updatedUrls = [...imageUrls, newImageUrl.trim()];
      setImageUrls(updatedUrls);
      setDressData((prev) => ({
        ...prev,
        images: updatedUrls.join(","),
      }));
      setNewImageUrl("");
    }
  };

  const removeImageUrl = (urlToRemove: string) => {
    const updatedUrls = imageUrls.filter((url) => url !== urlToRemove);
    setImageUrls(updatedUrls);
    setDressData((prev) => ({
      ...prev,
      images: updatedUrls.join(","),
    }));
  };

  const resetForm = () => {
    setDressData({
      categoryId: "",
      name: "",
      description: "",
      sellPrice: 0,
      rentalPrice: 0,
      isSellable: true,
      isRentable: true,
      status: DressStatus.AVAILABLE,
      images: "",
      bust: 0,
      waist: 0,
      hip: 0,
      material: "",
      color: "",
      length: "",
      neckline: "",
      sleeve: "",
    });
    setImageUrls([]);
    setNewImageUrl("");
  };

  const handleSubmit = async () => {
    try {
      // Basic validation
      if (!dressData.categoryId || !dressData.name || !dressData.description) {
        toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
        return;
      }

      if (dressData.isSellable && dressData.sellPrice <= 0) {
        toast.error("Giá bán phải lớn hơn 0");
        return;
      }

      if (dressData.isRentable && dressData.rentalPrice <= 0) {
        toast.error("Giá thuê phải lớn hơn 0");
        return;
      }

      await createDress(dressData).unwrap();
      toast.success("Tạo váy thành công!");
      setOpen(false);
      resetForm();
      onSuccess?.();
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tạo váy");
      console.error("Error creating dress:", error);
    }
  };

  const handleCancel = () => {
    setOpen(false);
    resetForm();
  };

  const defaultTrigger = (
    <Button className="bg-rose-600 hover:bg-rose-700">
      <Plus className="h-4 w-4 mr-2" />
      Thêm váy mới
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Tạo váy mới</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[75vh] pr-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Thông tin cơ bản</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Danh mục *</Label>
                    <Select
                      value={dressData.categoryId}
                      onValueChange={(value) =>
                        handleInputChange("categoryId", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Tên váy *</Label>
                  <Input
                    id="name"
                    placeholder="Nhập tên váy"
                    value={dressData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả *</Label>
                  <Textarea
                    id="description"
                    placeholder="Nhập mô tả chi tiết về váy"
                    value={dressData.description}
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
                    <Label>Có thể bán</Label>
                    <p className="text-sm text-muted-foreground">
                      Cho phép khách hàng mua váy này
                    </p>
                  </div>
                  <Switch
                    checked={dressData.isSellable}
                    onCheckedChange={(checked) =>
                      handleInputChange("isSellable", checked)
                    }
                  />
                </div>

                {dressData.isSellable && (
                  <div className="space-y-2">
                    <Label htmlFor="sellPrice">Giá bán (VNĐ)</Label>
                    <Input
                      id="sellPrice"
                      type="number"
                      placeholder="0"
                      value={dressData.sellPrice || ""}
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
                    <Label>Có thể thuê</Label>
                    <p className="text-sm text-muted-foreground">
                      Cho phép khách hàng thuê váy này
                    </p>
                  </div>
                  <Switch
                    checked={dressData.isRentable}
                    onCheckedChange={(checked) =>
                      handleInputChange("isRentable", checked)
                    }
                  />
                </div>

                {dressData.isRentable && (
                  <div className="space-y-2">
                    <Label htmlFor="rentalPrice">Giá thuê (VNĐ)</Label>
                    <Input
                      id="rentalPrice"
                      type="number"
                      placeholder="0"
                      value={dressData.rentalPrice || ""}
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

              {/* Measurements */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Số đo (cm)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bust">Ngực</Label>
                    <Input
                      id="bust"
                      type="number"
                      placeholder="0"
                      value={dressData.bust || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "bust",
                          Number.parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="waist">Eo</Label>
                    <Input
                      id="waist"
                      type="number"
                      placeholder="0"
                      value={dressData.waist || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "waist",
                          Number.parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hip">Hông</Label>
                    <Input
                      id="hip"
                      type="number"
                      placeholder="0"
                      value={dressData.hip || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "hip",
                          Number.parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Chi tiết</h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="material">Chất liệu</Label>
                    <Input
                      id="material"
                      placeholder="Ví dụ: Cotton, Lụa, Voan..."
                      value={dressData.material || ""}
                      onChange={(e) =>
                        handleInputChange("material", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="color">Màu sắc</Label>
                    <Input
                      id="color"
                      placeholder="Ví dụ: Đỏ, Xanh, Trắng..."
                      value={dressData.color || ""}
                      onChange={(e) =>
                        handleInputChange("color", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="length">Độ dài</Label>
                    <Input
                      id="length"
                      placeholder="Ví dụ: Ngắn, Dài, Midi..."
                      value={dressData.length || ""}
                      onChange={(e) =>
                        handleInputChange("length", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="neckline">Cổ áo</Label>
                    <Input
                      id="neckline"
                      placeholder="Ví dụ: Cổ tròn, Cổ V, Cổ vuông..."
                      value={dressData.neckline || ""}
                      onChange={(e) =>
                        handleInputChange("neckline", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sleeve">Tay áo</Label>
                    <Input
                      id="sleeve"
                      placeholder="Ví dụ: Tay ngắn, Tay dài, Không tay..."
                      value={dressData.sleeve || ""}
                      onChange={(e) =>
                        handleInputChange("sleeve", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Images */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Hình ảnh</h3>
                <div className="flex gap-2">
                  <Input
                    placeholder="Nhập URL hình ảnh"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addImageUrl()}
                  />
                  <Button
                    type="button"
                    size="icon"
                    onClick={addImageUrl}
                    disabled={!newImageUrl.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {imageUrls.length > 0 && (
                  <div className="space-y-2">
                    <Label>Hình ảnh đã thêm:</Label>
                    <div className="space-y-2">
                      {imageUrls.map((url, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 border rounded"
                        >
                          <Image
                            src={url || "/placeholder.svg"}
                            alt={`Preview ${index + 1}`}
                            width={48}
                            height={48}
                            className="w-12 h-12 object-cover rounded"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder-icon.png";
                            }}
                          />
                          <div className="flex-1 text-sm truncate">{url}</div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeImageUrl(url)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Chi tiết</h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="material">Chất liệu</Label>
                    <Input
                      id="material"
                      placeholder="Ví dụ: Cotton, Lụa, Voan..."
                      value={dressData.material}
                      onChange={(e) =>
                        handleInputChange("material", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="color">Màu sắc</Label>
                    <Input
                      id="color"
                      placeholder="Ví dụ: Đỏ, Xanh, Trắng..."
                      value={dressData.color}
                      onChange={(e) =>
                        handleInputChange("color", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="length">Độ dài</Label>
                    <Input
                      id="length"
                      placeholder="Ví dụ: Ngắn, Dài, Midi..."
                      value={dressData.length}
                      onChange={(e) =>
                        handleInputChange("length", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="neckline">Cổ áo</Label>
                    <Input
                      id="neckline"
                      placeholder="Ví dụ: Cổ tròn, Cổ V, Cổ vuông..."
                      value={dressData.neckline}
                      onChange={(e) =>
                        handleInputChange("neckline", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sleeve">Tay áo</Label>
                    <Input
                      id="sleeve"
                      placeholder="Ví dụ: Tay ngắn, Tay dài, Không tay..."
                      value={dressData.sleeve}
                      onChange={(e) =>
                        handleInputChange("sleeve", e.target.value)
                      }
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
                Tạo váy
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
