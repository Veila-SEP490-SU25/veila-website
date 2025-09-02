"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateServiceMutation,
  useGetShopServicesQuery,
} from "@/services/apis/service.api";
import { Star, Plus, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

interface ShopServicesProps {
  id: string;
}

export const ShopServices = ({ id }: ShopServicesProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const {
    data: servicesResponse,
    isLoading,
    refetch,
  } = useGetShopServicesQuery(id);
  const [createService, { isLoading: isCreating }] = useCreateServiceMutation();

  const handleCreateService = async () => {
    try {
      if (!formData.name || !formData.description) {
        toast.error("Vui lòng điền đầy đủ thông tin");
        return;
      }

      // Tự động set status là AVAILABLE
      const serviceData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        status: "AVAILABLE" as const,
      };

      console.log("Creating service with data:", serviceData); // Debug log

      await createService(serviceData).unwrap();

      toast.success("Tạo dịch vụ thành công!");
      setIsCreateDialogOpen(false);
      setFormData({
        name: "",
        description: "",
      });
      refetch();
    } catch (error: any) {
      // Xử lý error message an toàn
      let errorMessage = "Không thể tạo dịch vụ";
      if (error?.data?.message) {
        errorMessage =
          typeof error.data.message === "string"
            ? error.data.message
            : "Không thể tạo dịch vụ";
      }

      toast.error(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Xử lý response data - API trả về items array
  let services: any[] = [];
  if (servicesResponse?.items && Array.isArray(servicesResponse.items)) {
    services = servicesResponse.items;
  }

  return (
    <div className="space-y-6">
      {/* Header - chỉ hiển thị nút tạo dịch vụ khi chưa có service */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Dịch vụ</h2>
        {services.length === 0 && (
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-rose-600 hover:bg-rose-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Tạo dịch vụ mới
          </Button>
        )}
      </div>

      {/* Hiển thị dịch vụ */}
      {services.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ImageIcon className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Chưa có dịch vụ nào
            </h3>
            <p className="text-gray-500 text-center mb-4">
              Bạn chưa có dịch vụ nào. Hãy tạo dịch vụ đầu tiên để khách hàng có
              thể đặt hàng.
            </p>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-rose-600 hover:bg-rose-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tạo dịch vụ đầu tiên
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.id} className="overflow-hidden">
              <div className="relative h-48 bg-gray-100">
                {service.images ? (
                  <Image
                    src={service.images}
                    alt={service.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      service.status === "AVAILABLE"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {service.status === "AVAILABLE" ? "Có sẵn" : "Không có sẵn"}
                  </span>
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{service.name}</CardTitle>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-gray-600">
                    {parseFloat(service.ratingAverage).toFixed(1)}
                  </span>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog tạo dịch vụ - luôn có sẵn nhưng chỉ mở khi cần */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tạo dịch vụ mới</DialogTitle>
            <DialogDescription>
              Thêm dịch vụ mới cho cửa hàng của bạn
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Tên dịch vụ *</Label>
              <Input
                id="name"
                placeholder="Nhập tên dịch vụ"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="description">Mô tả *</Label>
              <Textarea
                id="description"
                placeholder="Mô tả chi tiết về dịch vụ"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleCreateService}
                disabled={isCreating}
                className="flex-1 bg-rose-600 hover:bg-rose-700"
              >
                {isCreating ? "Đang tạo..." : "Tạo dịch vụ"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Hủy
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
