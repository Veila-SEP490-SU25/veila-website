"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  CalendarIcon,
  ShoppingBag,
  User,
  Ruler,
  Package,
  Plus,
  Minus,
  Info,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  type IDress,
  type IAccessory,
  type INewOrder,
  OrderType,
  IDressDetails,
  IAccessoriesDetail,
  ICreateOrder,
} from "@/services/types";
import { useAuth } from "@/providers/auth.provider";
import { LocationInput } from "@/components/location-input";
import { useCreateOrderMutation } from "@/services/apis";
import { Image } from "@/components/image";

interface CreateOrderDialogProps {
  dress?: IDress;
  accessories?: IAccessory[];
  trigger?: React.ReactNode;
}

export function CreateOrderDialog({
  dress,
  accessories = [],
  trigger,
}: CreateOrderDialogProps) {
  const { currentUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data states
  const [orderData, setOrderData] = useState<INewOrder>({
    phone: currentUser?.phone || "",
    email: currentUser?.email || "",
    address: currentUser?.address || "",
    dueDate: new Date(),
    returnDate: new Date(),
    type: dress?.isSellable ? OrderType.SELL : OrderType.RENT,
  });

  const [dressDetails, setDressDetails] = useState<IDressDetails>({
    dressId: dress?.id || "",
    height: 165,
    weight: 50,
    bust: 85,
    waist: 65,
    hip: 90,
    armpit: 10,
    bicep: 10,
    neck: 20,
    shoulderWidth: 40,
    sleeveLength: 40,
    backLength: 60,
    lowerWaist: 50,
    waistToFloor: 60,
  });

  const [accessoriesDetails, setAccessoriesDetails] = useState<
    IAccessoriesDetail[]
  >(
    accessories.map((accessory) => ({
      accessoryId: accessory.id,
      quantity: 1,
    }))
  );

  const measurementFields = [
    { key: "height", label: "Chiều cao", unit: "cm", min: 140, max: 200 },
    { key: "weight", label: "Cân nặng", unit: "kg", min: 35, max: 120 },
    { key: "bust", label: "Vòng ngực", unit: "cm", min: 70, max: 120 },
    { key: "waist", label: "Vòng eo", unit: "cm", min: 55, max: 100 },
    { key: "hip", label: "Vòng hông", unit: "cm", min: 75, max: 130 },
    { key: "armpit", label: "Nách", unit: "cm", min: 5, max: 25 },
    { key: "bicep", label: "Vòng tay", unit: "cm", min: 5, max: 25 },
    { key: "neck", label: "Vòng cổ", unit: "cm", min: 15, max: 35 },
    { key: "shoulderWidth", label: "Rộng vai", unit: "cm", min: 30, max: 55 },
    { key: "sleeveLength", label: "Dài tay áo", unit: "cm", min: 30, max: 70 },
    { key: "backLength", label: "Dài lưng", unit: "cm", min: 40, max: 80 },
    { key: "lowerWaist", label: "Eo dưới", unit: "cm", min: 40, max: 90 },
    {
      key: "waistToFloor",
      label: "Eo xuống sàn",
      unit: "cm",
      min: 50,
      max: 120,
    },
  ];

  const updateAccessoryQuantity = (accessoryId: string, change: number) => {
    setAccessoriesDetails((prev) =>
      prev.map((item) =>
        item.accessoryId === accessoryId
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item
      )
    );
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          orderData.phone &&
          orderData.email &&
          orderData.address &&
          orderData.dueDate
        );
      case 2:
        return dress ? true : false; // Skip measurements if no dress
      case 3:
        return true; // Accessories are optional
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    } else {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const [createOrder, { isLoading: _isLoading }] = useCreateOrderMutation();

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      toast.error("Vui lòng kiểm tra lại thông tin");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload: ICreateOrder = {
        newOrder: {
          phone: orderData.phone,
          email: orderData.email,
          address: orderData.address,
          dueDate: orderData.dueDate,
          returnDate: orderData.returnDate,
          type: orderData.type,
        },
        dressDetails: dressDetails,
        accessoriesDetails: accessoriesDetails.filter(
          (item) => item.quantity > 0
        ),
      };

      const { statusCode, message } = await createOrder(orderPayload).unwrap();
      if (statusCode === 201) {
        toast.success("Tạo đơn hàng thành công");
        setOpen(false);
        setCurrentStep(1);
      } else {
        toast.error("Tạo đơn hàng thất bại", { description: message });
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tạo đơn hàng");
      console.error("Order creation error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateTotal = () => {
    let total = 0;
    if (dress) {
      total += orderData.type === "SELL" ? dress.sellPrice : dress.rentalPrice;
    }
    accessoriesDetails.forEach((item) => {
      const accessory = accessories.find((acc) => acc.id === item.accessoryId);
      if (accessory) {
        const price =
          orderData.type === "SELL"
            ? accessory.sellPrice
            : accessory.rentalPrice;
        total += price * item.quantity;
      }
    });
    return total;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-rose-600 hover:bg-rose-700">
            <ShoppingBag className="h-4 w-4 mr-2" />
            Đặt hàng
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="min-w-4xl max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Tạo đơn hàng mới
          </DialogTitle>
          <DialogDescription>
            Điền thông tin chi tiết để tạo đơn hàng{" "}
            {dress ? "váy cưới" : "phụ kiện"}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {[
            { step: 1, title: "Thông tin", icon: User },
            { step: 2, title: "Số đo", icon: Ruler },
            { step: 3, title: "Phụ kiện", icon: Package },
            { step: 4, title: "Xác nhận", icon: CheckCircle },
          ].map(({ step, title, icon: Icon }) => (
            <div key={step} className="flex items-center">
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors",
                  currentStep >= step
                    ? "bg-rose-600 border-rose-600 text-white"
                    : "border-gray-300 text-gray-400"
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span
                className={cn(
                  "ml-2 text-sm font-medium",
                  currentStep >= step ? "text-rose-600" : "text-gray-400"
                )}
              >
                {title}
              </span>
              {step < 4 && <div className="w-12 h-px bg-gray-300 mx-4" />}
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Thông tin khách hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        Số điện thoại <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="phone"
                        placeholder="0123456789"
                        value={orderData.phone}
                        onChange={(e) =>
                          setOrderData((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="customer@example.com"
                        value={orderData.email}
                        onChange={(e) =>
                          setOrderData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">
                      Địa chỉ <span className="text-red-500">*</span>
                    </Label>
                    <LocationInput
                      location={orderData.address}
                      setLocation={(location) =>
                        setOrderData((prev) => ({
                          ...prev,
                          address: location,
                        }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Loại đơn hàng & Thời gian</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Loại đơn hàng</Label>
                    <Select
                      value={orderData.type}
                      onValueChange={(value: OrderType) =>
                        setOrderData((prev) => ({ ...prev, type: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {dress?.isSellable && (
                          <SelectItem value="SELL">Mua</SelectItem>
                        )}
                        {dress?.isRentable && (
                          <SelectItem value="RENT">Thuê</SelectItem>
                        )}
                        {!dress && (
                          <>
                            <SelectItem value="SELL">Mua</SelectItem>
                            <SelectItem value="RENT">Thuê</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>
                        Ngày cần hàng <span className="text-red-500">*</span>
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !orderData.dueDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {orderData.dueDate
                              ? format(orderData.dueDate, "dd/MM/yyyy", {
                                  locale: vi,
                                })
                              : "Chọn ngày"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={orderData.dueDate}
                            onSelect={(date) =>
                              setOrderData((prev) => ({
                                ...prev,
                                dueDate: date ?? prev.dueDate,
                              }))
                            }
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {orderData.type === "RENT" && (
                      <div className="space-y-2">
                        <Label>Ngày trả hàng</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !orderData.returnDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {orderData.returnDate
                                ? format(orderData.returnDate, "dd/MM/yyyy", {
                                    locale: vi,
                                  })
                                : "Chọn ngày"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={orderData.returnDate}
                              onSelect={(date) =>
                                setOrderData((prev) => ({
                                  ...prev,
                                  returnDate: date ?? prev.returnDate,
                                }))
                              }
                              disabled={(date) =>
                                date < (orderData.dueDate || new Date())
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 2: Dress Measurements */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {dress ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Ruler className="h-5 w-5" />
                      Số đo cơ thể
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-amber-600">
                      <Info className="h-4 w-4" />
                      Vui lòng cung cấp số đo chính xác để đảm bảo váy vừa vặn
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {measurementFields.map(
                        ({ key, label, unit, min, max }) => (
                          <div key={key} className="space-y-2">
                            <Label htmlFor={key}>
                              {label} ({unit})
                            </Label>
                            <Input
                              id={key}
                              type="number"
                              min={min}
                              max={max}
                              value={dressDetails[key as keyof IDressDetails]}
                              onChange={(e) =>
                                setDressDetails((prev) => ({
                                  ...prev,
                                  [key]: Number(e.target.value),
                                }))
                              }
                              className="text-center"
                            />
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <Info className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Không có váy cưới
                    </h3>
                    <p className="text-gray-600">
                      Bước này sẽ được bỏ qua vì không có váy cưới trong đơn
                      hàng.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Step 3: Accessories */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Phụ kiện (
                    {
                      accessoriesDetails.filter((item) => item.quantity > 0)
                        .length
                    }
                    )
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {accessories.length > 0 ? (
                    <div className="space-y-4">
                      {accessories.map((accessory) => {
                        const detail = accessoriesDetails.find(
                          (item) => item.accessoryId === accessory.id
                        );
                        const quantity = detail?.quantity || 0;
                        const price =
                          orderData.type === "SELL"
                            ? accessory.sellPrice
                            : accessory.rentalPrice;

                        return (
                          <div
                            key={accessory.id}
                            className="flex items-center gap-4 p-4 border rounded-lg"
                          >
                            <Image
                              src={
                                accessory.images?.split(",")[0] ||
                                "/placeholder.svg"
                              }
                              alt={accessory.name}
                              className="w-16 h-16 object-cover rounded-md"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium">{accessory.name}</h4>
                              <p className="text-sm text-gray-600">
                                {accessory.category?.name}
                              </p>
                              <p className="text-lg font-bold text-rose-600">
                                {formatPrice(price)}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                  updateAccessoryQuantity(accessory.id, -1)
                                }
                                disabled={quantity <= 0}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-12 text-center font-medium">
                                {quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                  updateAccessoryQuantity(accessory.id, 1)
                                }
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Không có phụ kiện
                      </h3>
                      <p className="text-gray-600">
                        Không có phụ kiện nào được chọn cho đơn hàng này.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 4: Order Summary */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Xác nhận đơn hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Customer Info */}
                  <div>
                    <h4 className="font-medium mb-2">Thông tin khách hàng</h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Điện thoại:</span>{" "}
                        {orderData.phone}
                      </p>
                      <p>
                        <span className="font-medium">Email:</span>{" "}
                        {orderData.email}
                      </p>
                      <p>
                        <span className="font-medium">Địa chỉ:</span>{" "}
                        {orderData.address}
                      </p>
                      <p>
                        <span className="font-medium">Loại:</span>{" "}
                        <Badge
                          variant={
                            orderData.type === "SELL" ? "default" : "secondary"
                          }
                        >
                          {orderData.type === "SELL" ? "Mua" : "Thuê"}
                        </Badge>
                      </p>
                      <p>
                        <span className="font-medium">Ngày cần hàng:</span>{" "}
                        {orderData.dueDate
                          ? format(orderData.dueDate, "dd/MM/yyyy", {
                              locale: vi,
                            })
                          : "Chưa chọn"}
                      </p>
                      {orderData.returnDate && (
                        <p>
                          <span className="font-medium">Ngày trả hàng:</span>{" "}
                          {format(orderData.returnDate, "dd/MM/yyyy", {
                            locale: vi,
                          })}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Sản phẩm đặt hàng</h4>
                    <div className="space-y-3">
                      {dress && (
                        <div className="flex items-center gap-4 p-4 border rounded-lg">
                          <Image
                            src={
                              dress.images?.split(",")[0] || "/placeholder.svg"
                            }
                            alt={dress.name}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                          <div className="flex-1">
                            <h5 className="font-medium">{dress.name}</h5>
                            <p className="text-sm text-gray-600">
                              {dress.category?.name}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-rose-600">
                              {formatPrice(
                                orderData.type === "SELL"
                                  ? dress.sellPrice
                                  : dress.rentalPrice
                              )}
                            </p>
                          </div>
                        </div>
                      )}

                      {accessoriesDetails
                        .filter((item) => item.quantity > 0)
                        .map((item) => {
                          const accessory = accessories.find(
                            (acc) => acc.id === item.accessoryId
                          );
                          if (!accessory) return null;

                          const price =
                            orderData.type === "SELL"
                              ? accessory.sellPrice
                              : accessory.rentalPrice;

                          return (
                            <div
                              key={item.accessoryId}
                              className="flex items-center gap-4 p-4 border rounded-lg"
                            >
                              <Image
                                src={
                                  accessory.images?.split(",")[0] ||
                                  "/placeholder.svg"
                                }
                                alt={accessory.name}
                                className="w-16 h-16 object-cover rounded-md"
                              />
                              <div className="flex-1">
                                <h5 className="font-medium">
                                  {accessory.name}
                                </h5>
                                <p className="text-sm text-gray-600">
                                  {accessory.category?.name} × {item.quantity}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-rose-600">
                                  {formatPrice(price * item.quantity)}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  <Separator />

                  {/* Total */}
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Tổng cộng:</span>
                    <span className="text-rose-600">
                      {formatPrice(calculateTotal())}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <div className="flex gap-2">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={isSubmitting}
              >
                Quay lại
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            {currentStep < 4 ? (
              <Button
                onClick={handleNext}
                className="bg-rose-600 hover:bg-rose-700"
              >
                Tiếp tục
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-rose-600 hover:bg-rose-700"
              >
                {isSubmitting ? "Đang xử lý..." : "Tạo đơn hàng"}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
