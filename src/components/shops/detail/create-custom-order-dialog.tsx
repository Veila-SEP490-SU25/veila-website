"use client";

import type React from "react";

import { useState } from "react";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  useCreateRequestMutation,
  useCreateCustomOrderMutation,
} from "@/services/apis";
import {
  ICreateRequest,
  RequestStatus,
  type ICreateCustomOrder,
} from "@/services/types";
import {
  ChevronLeft,
  ChevronRight,
  User,
  Ruler,
  Settings,
  ShoppingBag,
  CheckCircle,
  Loader2,
  Phone,
  Mail,
  MapPin,
  Store,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LocationInput } from "@/components/location-input";
import { useAuth } from "@/providers/auth.provider";
import { ImagesUpload } from "@/components/images-upload";

interface CreateCustomOrderDialogProps {
  children: React.ReactNode;
  shopId?: string;
}

type Step = "request" | "order" | "confirmation";

interface ValidationErrors {
  [key: string]: string;
}

export function CreateCustomOrderDialog({
  children,
  shopId,
}: CreateCustomOrderDialogProps) {
  const { currentUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>("request");
  const [createdRequest, setCreatedRequest] = useState<any>(null);
  const [createdOrder, setCreatedOrder] = useState<any>(null);

  const [createRequest, { isLoading: isCreatingRequest }] =
    useCreateRequestMutation();
  const [createCustomOrder, { isLoading: isCreatingOrder }] =
    useCreateCustomOrderMutation();

  // Request data state
  const [requestData, setRequestData] = useState<ICreateRequest>({
    title: "",
    description: "",
    images: "",
    height: 165,
    weight: 55,
    bust: 85,
    waist: 65,
    hip: 90,
    armpit: 40,
    bicep: 28,
    neck: 35,
    shoulderWidth: 38,
    sleeveLength: 60,
    backLength: 40,
    lowerWaist: 85,
    waistToFloor: 100,
    material: "",
    color: "",
    length: "",
    neckline: "",
    sleeve: "",
    status: RequestStatus.SUBMIT,
    isPrivate: false,
  });

  // Order data state
  const [orderData, setOrderData] = useState<ICreateCustomOrder>({
    phone: currentUser?.phone || "",
    email: currentUser?.email || "",
    address: "",
    shopId: shopId || "",
    requestId: "",
  });

  // Validation errors
  const [requestErrors, setRequestErrors] = useState<ValidationErrors>({});
  const [orderErrors, setOrderErrors] = useState<ValidationErrors>({});

  // Validation functions
  const validateRequest = (): boolean => {
    const errors: ValidationErrors = {};

    if (!requestData.title.trim()) {
      errors.title = "Tiêu đề là bắt buộc";
    } else if (requestData.title.length < 5) {
      errors.title = "Tiêu đề phải có ít nhất 5 ký tự";
    } else if (requestData.title.length > 100) {
      errors.title = "Tiêu đề không được quá 100 ký tự";
    }

    if (!requestData.description.trim()) {
      errors.description = "Mô tả là bắt buộc";
    } else if (requestData.description.length < 10) {
      errors.description = "Mô tả phải có ít nhất 10 ký tự";
    } else if (requestData.description.length > 1000) {
      errors.description = "Mô tả không được quá 1000 ký tự";
    }

    if (requestData.images.trim()) {
      const urls = requestData.images.split(",").map((url) => url.trim());
      const invalidUrls = urls.filter((url) => {
        try {
          new URL(url);
          return false;
        } catch {
          return true;
        }
      });
      if (invalidUrls.length > 0) {
        errors.images = "Vui lòng nhập URL hình ảnh hợp lệ";
      }
    }

    // Measurement validations
    if (requestData.height < 140 || requestData.height > 200) {
      errors.high = "Chiều cao phải từ 140-200cm";
    }
    if (requestData.weight < 35 || requestData.weight > 120) {
      errors.weight = "Cân nặng phải từ 35-120kg";
    }
    if (requestData.bust < 70 || requestData.bust > 120) {
      errors.bust = "Số đo ngực phải từ 70-120cm";
    }
    if (requestData.waist < 50 || requestData.waist > 100) {
      errors.waist = "Số đo eo phải từ 50-100cm";
    }
    if (requestData.hip < 70 || requestData.hip > 130) {
      errors.hip = "Số đo hông phải từ 70-130cm";
    }

    setRequestErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateOrder = (): boolean => {
    const errors: ValidationErrors = {};

    if (!orderData.phone.trim()) {
      errors.phone = "Số điện thoại là bắt buộc";
    } else if (!/^[0-9+\-\s()]+$/.test(orderData.phone)) {
      errors.phone = "Số điện thoại không hợp lệ";
    } else if (orderData.phone.replace(/[^0-9]/g, "").length < 10) {
      errors.phone = "Số điện thoại phải có ít nhất 10 số";
    }

    if (!orderData.email.trim()) {
      errors.email = "Email là bắt buộc";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(orderData.email)) {
      errors.email = "Email không hợp lệ";
    }

    if (!orderData.address.trim()) {
      errors.address = "Địa chỉ là bắt buộc";
    } else if (orderData.address.length < 10) {
      errors.address = "Địa chỉ phải có ít nhất 10 ký tự";
    } else if (orderData.address.length > 200) {
      errors.address = "Địa chỉ không được quá 200 ký tự";
    }

    if (!orderData.shopId.trim()) {
      errors.shopId = "Vui lòng chọn cửa hàng";
    }

    setOrderErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Update functions
  const updateRequestData = (field: keyof ICreateRequest, value: any) => {
    setRequestData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (requestErrors[field]) {
      setRequestErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const updateOrderData = (field: keyof ICreateCustomOrder, value: string) => {
    setOrderData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (orderErrors[field]) {
      setOrderErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleCreateRequest = async () => {
    if (!validateRequest()) {
      toast.error("Vui lòng kiểm tra lại thông tin đã nhập.");
      return;
    }

    try {
      const { statusCode, message, item } = await createRequest(
        requestData
      ).unwrap();

      if (item) {
        setCreatedRequest(item);
        setCurrentStep("order");
        toast.success("Tạo yêu cầu thành công", {
          description:
            "Yêu cầu thiết kế của bạn đã được tạo. Vui lòng điền thông tin đặt hàng.",
        });
      } else {
        toast.error("Có lỗi xảy ra khi tạo yêu cầu thiết kế.", {
          description: message,
        });
      }
    } catch (error: any) {
      toast.error("Có lỗi xảy ra khi tạo yêu cầu thiết kế.");
    }
  };

  const handleCreateOrder = async () => {
    if (!validateOrder()) {
      toast.error("Vui lòng kiểm tra lại thông tin đã nhập.");
      return;
    }

    if (!createdRequest?.id) {
      toast.error("Không tìm thấy thông tin yêu cầu thiết kế.");
      return;
    }

    try {
      const orderPayload: ICreateCustomOrder = {
        ...orderData,
        requestId: createdRequest.id,
      };

      const { statusCode, message, item } = await createCustomOrder(
        orderPayload
      ).unwrap();

      if (item) {
        setCreatedOrder(item);
        setCurrentStep("confirmation");
        toast.success("Đặt hàng thành công", {
          description: "Đơn hàng tùy chỉnh của bạn đã được tạo thành công.",
        });
      } else {
        toast.error("Có lỗi xảy ra khi tạo đơn hàng.", {
          description: message,
        });
      }
    } catch (error: any) {
      toast.error("Có lỗi xảy ra khi tạo đơn hàng.");
    }
  };

  const resetDialog = () => {
    setCurrentStep("request");
    setCreatedRequest(null);
    setCreatedOrder(null);
    setRequestData({
      title: "",
      description: "",
      images: "",
      height: 165,
      weight: 55,
      bust: 85,
      waist: 65,
      hip: 90,
      armpit: 40,
      bicep: 28,
      neck: 35,
      shoulderWidth: 38,
      sleeveLength: 60,
      backLength: 40,
      lowerWaist: 85,
      waistToFloor: 100,
      material: "",
      color: "",
      length: "",
      neckline: "",
      sleeve: "",
      status: RequestStatus.SUBMIT,
      isPrivate: false,
    });
    setOrderData({
      phone: "",
      email: "",
      address: "",
      shopId: shopId || "",
      requestId: createdRequest?.id || "",
    });
    setRequestErrors({});
    setOrderErrors({});
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(resetDialog, 300);
  };

  const getStepProgress = () => {
    switch (currentStep) {
      case "request":
        return 33;
      case "order":
        return 66;
      case "confirmation":
        return 100;
      default:
        return 0;
    }
  };

  const measurementFields = [
    { key: "high", label: "Chiều cao", icon: "📏", unit: "cm" },
    { key: "weight", label: "Cân nặng", icon: "⚖️", unit: "kg" },
    { key: "bust", label: "Vòng ngực", icon: "👗", unit: "cm" },
    { key: "waist", label: "Vòng eo", icon: "⭕", unit: "cm" },
    { key: "hip", label: "Vòng hông", icon: "🍑", unit: "cm" },
    { key: "armpit", label: "Nách", icon: "💪", unit: "cm" },
    { key: "bicep", label: "Cánh tay", icon: "💪", unit: "cm" },
    { key: "neck", label: "Cổ", icon: "👔", unit: "cm" },
    { key: "shoulderWidth", label: "Rộng vai", icon: "👤", unit: "cm" },
    { key: "sleeveLength", label: "Dài tay áo", icon: "👕", unit: "cm" },
    { key: "backLength", label: "Dài lưng", icon: "🔙", unit: "cm" },
    { key: "lowerWaist", label: "Eo dưới", icon: "⭕", unit: "cm" },
    { key: "waistToFloor", label: "Eo xuống sàn", icon: "📐", unit: "cm" },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="min-w-4xl max-w-4xl max-h-[90vh] p-0">
        <ScrollArea className="max-h-[calc(90vh-4rem)] p-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Tạo đơn hàng tùy chỉnh
            </DialogTitle>
          </DialogHeader>

          {/* Progress Bar */}
          <div className="space-y-2 mb-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span
                className={
                  currentStep === "request" ? "text-primary font-medium" : ""
                }
              >
                1. Yêu cầu thiết kế
              </span>
              <span
                className={
                  currentStep === "order" ? "text-primary font-medium" : ""
                }
              >
                2. Thông tin đặt hàng
              </span>
              <span
                className={
                  currentStep === "confirmation"
                    ? "text-primary font-medium"
                    : ""
                }
              >
                3. Xác nhận
              </span>
            </div>
            <Progress value={getStepProgress()} className="h-2" />
          </div>

          {/* Step 1: Create Request */}
          {currentStep === "request" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Thông tin cơ bản
                  </CardTitle>
                  <CardDescription>
                    Nhập thông tin về yêu cầu thiết kế váy cưới của bạn
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Tiêu đề yêu cầu *</Label>
                    <Input
                      id="title"
                      placeholder="VD: Thiết kế váy cưới phong cách cổ điển"
                      value={requestData.title}
                      onChange={(e) =>
                        updateRequestData("title", e.target.value)
                      }
                    />
                    {requestErrors.title && (
                      <div className="flex items-center gap-1 text-sm text-destructive">
                        <AlertCircle className="h-3 w-3" />
                        {requestErrors.title}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Mô tả chi tiết *</Label>
                    <Textarea
                      id="description"
                      placeholder="Mô tả chi tiết về phong cách, màu sắc, chất liệu mong muốn..."
                      rows={4}
                      value={requestData.description}
                      onChange={(e) =>
                        updateRequestData("description", e.target.value)
                      }
                    />
                    {requestErrors.description && (
                      <div className="flex items-center gap-1 text-sm text-destructive">
                        <AlertCircle className="h-3 w-3" />
                        {requestErrors.description}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="images">Hình ảnh tham khảo</Label>
                    <ImagesUpload
                      imageUrls={requestData.images}
                      setImageUrls={(value) =>
                        updateRequestData("images", value)
                      }
                    />
                    {requestErrors.images && (
                      <div className="flex items-center gap-1 text-sm text-destructive">
                        <AlertCircle className="h-3 w-3" />
                        {requestErrors.images}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isPrivate"
                      checked={requestData.isPrivate}
                      onCheckedChange={(checked) =>
                        updateRequestData("isPrivate", checked)
                      }
                    />
                    <Label htmlFor="isPrivate">Yêu cầu riêng tư</Label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ruler className="h-4 w-4" />
                    Số đo cơ thể
                  </CardTitle>
                  <CardDescription>
                    Nhập chính xác số đo để có thiết kế phù hợp nhất
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {measurementFields.map((field) => (
                      <div key={field.key} className="space-y-2">
                        <Label
                          htmlFor={field.key}
                          className="flex items-center gap-1"
                        >
                          <span>{field.icon}</span>
                          {field.label}
                        </Label>
                        <div className="relative">
                          <Input
                            id={field.key}
                            type="number"
                            step="0.1"
                            value={
                              requestData[
                                field.key as keyof ICreateRequest
                              ] as number
                            }
                            onChange={(e) =>
                              updateRequestData(
                                field.key as keyof ICreateRequest,
                                Number.parseFloat(e.target.value) || 0
                              )
                            }
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                            {field.unit}
                          </span>
                        </div>
                        {requestErrors[field.key] && (
                          <div className="flex items-center gap-1 text-sm text-destructive">
                            <AlertCircle className="h-3 w-3" />
                            {requestErrors[field.key]}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button
                  onClick={handleCreateRequest}
                  disabled={isCreatingRequest}
                >
                  {isCreatingRequest && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Tạo yêu cầu thiết kế
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Create Order */}
          {currentStep === "order" && (
            <div className="space-y-6">
              {/* Request Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Yêu cầu thiết kế đã tạo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Mã yêu cầu:</span>
                      <Badge variant="outline">{createdRequest?.id}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tiêu đề:</span>
                      <span className="font-medium">
                        {createdRequest?.title}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Trạng thái:</span>
                      <Badge>{createdRequest?.status}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Thông tin đặt hàng
                  </CardTitle>
                  <CardDescription>
                    Nhập thông tin liên hệ và giao hàng
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Số điện thoại *
                    </Label>
                    <Input
                      id="phone"
                      placeholder="0123456789"
                      value={orderData.phone}
                      onChange={(e) => updateOrderData("phone", e.target.value)}
                    />
                    {orderErrors.phone && (
                      <div className="flex items-center gap-1 text-sm text-destructive">
                        <AlertCircle className="h-3 w-3" />
                        {orderErrors.phone}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@email.com"
                      value={orderData.email}
                      onChange={(e) => updateOrderData("email", e.target.value)}
                    />
                    {orderErrors.email && (
                      <div className="flex items-center gap-1 text-sm text-destructive">
                        <AlertCircle className="h-3 w-3" />
                        {orderErrors.email}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="address"
                      className="flex items-center gap-2"
                    >
                      <MapPin className="h-4 w-4" />
                      Địa chỉ giao hàng *
                    </Label>
                    <LocationInput
                      location={orderData.address}
                      setLocation={(value) => updateOrderData("address", value)}
                    />
                    {orderErrors.address && (
                      <div className="flex items-center gap-1 text-sm text-destructive">
                        <AlertCircle className="h-3 w-3" />
                        {orderErrors.address}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep("request")}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Quay lại
                </Button>
                <Button onClick={handleCreateOrder} disabled={isCreatingOrder}>
                  {isCreatingOrder && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Tạo đơn hàng
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {currentStep === "confirmation" && (
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    Đặt hàng thành công!
                  </h3>
                  <p className="text-muted-foreground">
                    Đơn hàng tùy chỉnh của bạn đã được tạo thành công
                  </p>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Thông tin đơn hàng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">
                        Mã đơn hàng
                      </Label>
                      <p className="font-medium">{createdOrder?.id}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">
                        Trạng thái
                      </Label>
                      <Badge className="ml-2">{createdOrder?.status}</Badge>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">
                        Loại đơn hàng
                      </Label>
                      <p className="font-medium">{createdOrder?.type}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Ngày tạo</Label>
                      <p className="font-medium">
                        {createdOrder?.createdAt &&
                          new Date(createdOrder.createdAt).toLocaleDateString(
                            "vi-VN"
                          )}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-muted-foreground">
                      Yêu cầu thiết kế
                    </Label>
                    <p className="font-medium">{createdRequest?.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Mã yêu cầu: {createdRequest?.id}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-center">
                <Button onClick={handleClose}>Hoàn thành</Button>
              </div>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
