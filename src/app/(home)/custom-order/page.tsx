"use client";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useCreateRequestMutation } from "@/services/apis/request.api";
import { RequestStatus } from "@/services/types/request.type";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { RequireAuth } from "@/components/auth/require-auth";
import { ArrowLeft, Scissors, Save, Send } from "lucide-react";
import Link from "next/link";

export default function CustomOrderPage() {
  const router = useRouter();
  const [createRequest, { isLoading }] = useCreateRequestMutation();

  const [formData, setFormData] = useState({
    title: "Yêu cầu thiết kế váy cưới",
    description:
      "Tôi muốn thiết kế một chiếc váy cưới theo phong cách cổ điển.",
    images: "",
    height: 170,
    weight: 55,
    bust: 85,
    waist: 60,
    hip: 90,
    armpit: 40,
    bicep: 30,
    neck: 35,
    shoulderWidth: 40,
    sleeveLength: 60,
    backLength: 40,
    lowerWaist: 90,
    waistToFloor: 60,
    material: "Cotton",
    color: "Đỏ",
    length: "Dài",
    neckline: "Cổ tròn",
    sleeve: "Tay ngắn",
    status: RequestStatus.DRAFT,
    isPrivate: false,
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (status: RequestStatus) => {
    try {
      const requestData = {
        ...formData,
        status,
      };

      await createRequest(requestData).unwrap();

      if (status === RequestStatus.SUBMIT) {
        toast.success("Yêu cầu đặt may đã được gửi thành công!");
        router.push("/profile");
      } else {
        toast.success("Bản nháp đã được lưu!");
      }
    } catch {
      toast.error("Có lỗi xảy ra khi tạo yêu cầu đặt may.");
    }
  };

  return (
    <RequireAuth>
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay về trang chủ
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Đặt May Váy Cưới
          </h1>
          <p className="text-gray-600">
            Tạo yêu cầu thiết kế váy cưới riêng theo ý muốn của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scissors className="h-5 w-5" />
                  Thông Tin Cơ Bản
                </CardTitle>
                <CardDescription>
                  Mô tả chi tiết về yêu cầu thiết kế váy cưới của bạn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Tiêu đề yêu cầu *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Nhập tiêu đề yêu cầu"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Mô tả chi tiết *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Mô tả chi tiết về váy cưới bạn muốn thiết kế..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="images">Hình ảnh tham khảo</Label>
                  <Input
                    id="images"
                    value={formData.images}
                    onChange={(e) =>
                      handleInputChange("images", e.target.value)
                    }
                    placeholder="URL hình ảnh tham khảo (phân cách bằng dấu phẩy)"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Measurements */}
            <Card>
              <CardHeader>
                <CardTitle>Số Đo Cơ Thể</CardTitle>
                <CardDescription>
                  Cung cấp số đo chính xác để thiết kế váy phù hợp
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="height">Chiều cao (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={formData.height}
                      onChange={(e) =>
                        handleInputChange("height", Number(e.target.value))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight">Cân nặng (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={formData.weight}
                      onChange={(e) =>
                        handleInputChange("weight", Number(e.target.value))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="bust">Vòng ngực (cm)</Label>
                    <Input
                      id="bust"
                      type="number"
                      value={formData.bust}
                      onChange={(e) =>
                        handleInputChange("bust", Number(e.target.value))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="waist">Vòng eo (cm)</Label>
                    <Input
                      id="waist"
                      type="number"
                      value={formData.waist}
                      onChange={(e) =>
                        handleInputChange("waist", Number(e.target.value))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="hip">Vòng mông (cm)</Label>
                    <Input
                      id="hip"
                      type="number"
                      value={formData.hip}
                      onChange={(e) =>
                        handleInputChange("hip", Number(e.target.value))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="neck">Vòng cổ (cm)</Label>
                    <Input
                      id="neck"
                      type="number"
                      value={formData.neck}
                      onChange={(e) =>
                        handleInputChange("neck", Number(e.target.value))
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Design Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Thiết Kế & Màu Sắc</CardTitle>
                <CardDescription>
                  Chọn phong cách và màu sắc cho váy cưới
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="material">Chất liệu</Label>
                    <Select
                      value={formData.material}
                      onValueChange={(value) =>
                        handleInputChange("material", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cotton">Cotton</SelectItem>
                        <SelectItem value="Silk">Silk</SelectItem>
                        <SelectItem value="Satin">Satin</SelectItem>
                        <SelectItem value="Lace">Lace</SelectItem>
                        <SelectItem value="Tulle">Tulle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="color">Màu sắc</Label>
                    <Select
                      value={formData.color}
                      onValueChange={(value) =>
                        handleInputChange("color", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Trắng">Trắng</SelectItem>
                        <SelectItem value="Đỏ">Đỏ</SelectItem>
                        <SelectItem value="Hồng">Hồng</SelectItem>
                        <SelectItem value="Xanh">Xanh</SelectItem>
                        <SelectItem value="Vàng">Vàng</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="length">Độ dài</Label>
                    <Select
                      value={formData.length}
                      onValueChange={(value) =>
                        handleInputChange("length", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ngắn">Ngắn</SelectItem>
                        <SelectItem value="Dài">Dài</SelectItem>
                        <SelectItem value="Midi">Midi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="neckline">Kiểu cổ</Label>
                    <Select
                      value={formData.neckline}
                      onValueChange={(value) =>
                        handleInputChange("neckline", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cổ tròn">Cổ tròn</SelectItem>
                        <SelectItem value="Cổ V">Cổ V</SelectItem>
                        <SelectItem value="Cổ tim">Cổ tim</SelectItem>
                        <SelectItem value="Cổ vuông">Cổ vuông</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Privacy Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Cài Đặt Riêng Tư</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Label htmlFor="isPrivate">Yêu cầu riêng tư</Label>
                  <Switch
                    id="isPrivate"
                    checked={formData.isPrivate}
                    onCheckedChange={(checked) =>
                      handleInputChange("isPrivate", checked)
                    }
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Khi bật, yêu cầu này sẽ chỉ hiển thị cho bạn
                </p>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Thao Tác</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => handleSubmit(RequestStatus.DRAFT)}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Lưu bản nháp
                </Button>

                <Button
                  onClick={() => handleSubmit(RequestStatus.SUBMIT)}
                  disabled={isLoading}
                  className="w-full bg-rose-600 hover:bg-rose-700"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Gửi yêu cầu
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
