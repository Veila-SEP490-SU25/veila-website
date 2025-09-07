'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
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
} from 'lucide-react';
import { toast } from 'sonner';
import {
  type IDress,
  type IAccessory,
  type INewOrder,
  OrderType,
  IDressDetails,
  IAccessoriesDetail,
  ICreateOrder,
} from '@/services/types';
import { useAuth } from '@/providers/auth.provider';
import { LocationInput } from '@/components/location-input';
import { useCreateOrderMutation, useLazyGetShopAccessoriesQuery } from '@/services/apis';
import { Image } from '@/components/image';
import { useRouter } from 'next/navigation';

interface CreateOrderDialogProps {
  dress?: IDress;
  accessories?: IAccessory[];
  trigger?: React.ReactNode;
}

export function CreateOrderDialog({
  dress,
  accessories: _accessories,
  trigger,
}: CreateOrderDialogProps) {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get shop accessories
  const [getShopAccessories, { data: shopAccessoriesData, isLoading: isLoadingAccessories }] =
    useLazyGetShopAccessoriesQuery();
  const [shopAccessories, setShopAccessories] = useState<IAccessory[]>([]);

  // Form data states
  const [orderData, setOrderData] = useState<INewOrder>({
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    address: currentUser?.address || '',
    dueDate: new Date(),
    returnDate: new Date(),
    type: dress?.isSellable ? OrderType.SELL : OrderType.RENT,
  });

  const [dressDetails, setDressDetails] = useState<IDressDetails>({
    dressId: dress?.id || '',
    height: 165,
    weight: 55,
    bust: 85,
    waist: 65,
    hip: 90,
    armpit: 15,
    bicep: 15,
    neck: 25,
    shoulderWidth: 35,
    sleeveLength: 50,
    backLength: 45,
    lowerWaist: 15,
    waistToFloor: 100,
  });

  const [accessoriesDetails, setAccessoriesDetails] = useState<IAccessoriesDetail[]>([]);

  // Fetch shop accessories when dress changes
  useEffect(() => {
    if (dress?.user?.shop?.id) {
      getShopAccessories({
        id: dress.user.shop.id,
        page: 0,
        size: 100, // Get all accessories
        sort: '',
        filter: '',
      });
    }
  }, [dress?.user?.shop?.id, getShopAccessories]);

  // Update shop accessories when data changes
  useEffect(() => {
    if (shopAccessoriesData?.items) {
      setShopAccessories(shopAccessoriesData.items);
      // Initialize accessories details with all available accessories
      setAccessoriesDetails(
        shopAccessoriesData.items.map((accessory) => ({
          accessoryId: accessory.id,
          quantity: 0, // Start with 0 quantity
        })),
      );
    }
  }, [shopAccessoriesData]);

  const measurementFields = [
    { key: 'height', label: 'Chiều cao', unit: 'cm', min: 130, max: 200 },
    { key: 'weight', label: 'Cân nặng', unit: 'kg', min: 30, max: 100 },
    { key: 'bust', label: 'Vòng ngực', unit: 'cm', min: 50, max: 150 },
    { key: 'waist', label: 'Vòng eo', unit: 'cm', min: 40, max: 100 },
    { key: 'hip', label: 'Vòng hông', unit: 'cm', min: 40, max: 150 },
    { key: 'armpit', label: 'Nách', unit: 'cm', min: 10, max: 40 },
    { key: 'bicep', label: 'Vòng tay', unit: 'cm', min: 10, max: 40 },
    { key: 'neck', label: 'Vòng cổ', unit: 'cm', min: 20, max: 50 },
    { key: 'shoulderWidth', label: 'Rộng vai', unit: 'cm', min: 20, max: 50 },
    { key: 'sleeveLength', label: 'Dài tay áo', unit: 'cm', min: 0, max: 100 },
    { key: 'backLength', label: 'Dài lưng', unit: 'cm', min: 30, max: 60 },
    { key: 'lowerWaist', label: 'Eo dưới', unit: 'cm', min: 5, max: 30 },
    {
      key: 'waistToFloor',
      label: 'Eo xuống sàn',
      unit: 'cm',
      min: 0,
      max: 200,
    },
  ];

  const updateAccessoryQuantity = (accessoryId: string, change: number) => {
    setAccessoriesDetails((prev) =>
      prev.map((item) =>
        item.accessoryId === accessoryId
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item,
      ),
    );
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!orderData.phone || !orderData.email || !orderData.address || !orderData.dueDate) {
          toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
          return false;
        }

        // Validate due date (minimum 3 days from today)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const minDueDate = new Date(today);
        minDueDate.setDate(today.getDate() + 3);

        if (orderData.dueDate < minDueDate) {
          toast.error('Ngày cần hàng phải cách ngày hiện tại ít nhất 3 ngày');
          return false;
        }

        // Validate return date for rental orders (maximum 7 days from due date)
        if (orderData.type === 'RENT' && orderData.returnDate) {
          const maxReturnDate = new Date(orderData.dueDate);
          maxReturnDate.setDate(orderData.dueDate.getDate() + 7);

          if (orderData.returnDate > maxReturnDate) {
            toast.error('Ngày trả hàng không được quá 7 ngày kể từ ngày thuê');
            return false;
          }
        }

        return true;
      case 2:
        if (!dress) return true; // Skip measurements if no dress

        // Validate all measurements are within range
        for (const field of measurementFields) {
          const value = dressDetails[field.key as keyof IDressDetails];
          if (typeof value === 'number' && (value < field.min || value > field.max)) {
            toast.error(`${field.label} phải từ ${field.min}-${field.max}${field.unit}`);
            return false;
          }
        }
        return true;
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
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const [createOrder, { isLoading: _isLoading }] = useCreateOrderMutation();

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      toast.error('Vui lòng kiểm tra lại thông tin');
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
        accessoriesDetails: accessoriesDetails.filter((item) => item.quantity > 0),
      };

      const { statusCode, message, item } = await createOrder(orderPayload).unwrap();
      if (statusCode === 201) {
        toast.success('Tạo đơn hàng thành công');
        setOpen(false);
        setCurrentStep(1);

        // Chuyển hướng đến trang chi tiết đơn hàng
        if (item?.id) {
          router.push(`/profile/orders/${item.id}`);
        }
      } else {
        toast.error('Tạo đơn hàng thất bại', { description: message });
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tạo đơn hàng');
      console.error('Order creation error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateTotal = () => {
    let total = 0;

    if (dress) {
      if (orderData.type === 'SELL') {
        // Đơn mua: chỉ tính giá mua
        const sellPrice =
          typeof dress.sellPrice === 'string'
            ? parseFloat(dress.sellPrice) || 0
            : dress.sellPrice || 0;
        total += sellPrice;
      } else if (orderData.type === 'RENT') {
        // Đơn thuê: tính tiền thuê × số ngày + tiền cọc (giá mua)
        const rentalPrice =
          typeof dress.rentalPrice === 'string'
            ? parseFloat(dress.rentalPrice) || 0
            : dress.rentalPrice || 0;
        const sellPrice =
          typeof dress.sellPrice === 'string'
            ? parseFloat(dress.sellPrice) || 0
            : dress.sellPrice || 0;

        // Tính số ngày thuê
        const rentalDays =
          orderData.returnDate && orderData.dueDate
            ? Math.ceil(
                (orderData.returnDate.getTime() - orderData.dueDate.getTime()) /
                  (1000 * 60 * 60 * 24),
              )
            : 1;

        total += rentalPrice * rentalDays + sellPrice; // Tiền thuê + tiền cọc
      }
    }

    // Tính tiền phụ kiện
    accessoriesDetails.forEach((item) => {
      const accessory = shopAccessories.find((acc) => acc.id === item.accessoryId);
      if (accessory) {
        const price = orderData.type === 'SELL' ? accessory.sellPrice : accessory.rentalPrice;
        const numericPrice = typeof price === 'string' ? parseFloat(price) || 0 : price || 0;

        if (orderData.type === 'SELL') {
          // Đơn mua: tiền phụ kiện × số lượng
          total += numericPrice * item.quantity;
        } else if (orderData.type === 'RENT') {
          // Đơn thuê: tiền phụ kiện × số lượng × số ngày thuê
          const rentalDays =
            orderData.returnDate && orderData.dueDate
              ? Math.ceil(
                  (orderData.returnDate.getTime() - orderData.dueDate.getTime()) /
                    (1000 * 60 * 60 * 24),
                )
              : 1;
          total += numericPrice * item.quantity * rentalDays;
        }
      }
    });

    return total;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
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
            Điền thông tin chi tiết để tạo đơn hàng {dress ? 'váy cưới' : 'phụ kiện'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between mb-6">
          {[
            { step: 1, title: 'Thông tin', icon: User },
            { step: 2, title: 'Số đo', icon: Ruler },
            { step: 3, title: 'Phụ kiện', icon: Package },
            { step: 4, title: 'Xác nhận', icon: CheckCircle },
          ].map(({ step, title, icon: Icon }) => (
            <div key={step} className="flex items-center">
              <div
                className={cn(
                  'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors',
                  currentStep >= step
                    ? 'bg-rose-600 border-rose-600 text-white'
                    : 'border-gray-300 text-gray-400',
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span
                className={cn(
                  'ml-2 text-sm font-medium',
                  currentStep >= step ? 'text-rose-600' : 'text-gray-400',
                )}
              >
                {title}
              </span>
              {step < 4 && <div className="w-12 h-px bg-gray-300 mx-4" />}
            </div>
          ))}
        </div>

        <div className="space-y-6">
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
                        {dress?.isSellable && <SelectItem value="SELL">Mua</SelectItem>}
                        {dress?.isRentable && <SelectItem value="RENT">Thuê</SelectItem>}
                        {!dress && (
                          <>
                            <SelectItem value="SELL">Mua</SelectItem>
                            <SelectItem value="RENT">Thuê</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>

                    {/* Thông báo cho đơn thuê */}
                    {orderData.type === 'RENT' && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div className="text-sm text-blue-800">
                            <p className="font-medium mb-1">Thông tin thuê váy:</p>
                            <ul className="space-y-1 text-blue-700">
                              <li>• Tiền thuê = Giá thuê × Số ngày thuê</li>
                              <li>• Tiền cọc = Giá mua (để đảm bảo váy)</li>
                              <li>• Tổng tiền = Tiền thuê + Tiền cọc + Tiền phụ kiện</li>
                              <li>• Tiền cọc sẽ được hoàn lại sau khi trả váy</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>
                        Ngày cần hàng <span className="text-red-500">*</span>
                      </Label>
                      <p className="text-xs text-amber-600">
                        ⚠️ Ngày cần hàng phải cách ngày hiện tại ít nhất 3 ngày
                      </p>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !orderData.dueDate && 'text-muted-foreground',
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {orderData.dueDate
                              ? format(orderData.dueDate, 'dd/MM/yyyy', {
                                  locale: vi,
                                })
                              : 'Chọn ngày'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={orderData.dueDate || undefined}
                            onSelect={(date) =>
                              setOrderData((prev) => ({
                                ...prev,
                                dueDate: date ?? prev.dueDate,
                              }))
                            }
                            disabled={(date) => {
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              const minDueDate = new Date(today);
                              minDueDate.setDate(today.getDate() + 3);
                              return date < minDueDate;
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {orderData.type === 'RENT' && (
                      <div className="space-y-2">
                        <Label>Ngày trả hàng</Label>
                        <p className="text-xs text-amber-600">
                          ⚠️ Ngày trả hàng không được quá 7 ngày kể từ ngày thuê
                        </p>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full justify-start text-left font-normal',
                                !orderData.returnDate && 'text-muted-foreground',
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {orderData.returnDate
                                ? format(orderData.returnDate, 'dd/MM/yyyy', {
                                    locale: vi,
                                  })
                                : 'Chọn ngày'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={orderData.returnDate || undefined}
                              onSelect={(date) =>
                                setOrderData((prev) => ({
                                  ...prev,
                                  returnDate: date ?? prev.returnDate,
                                }))
                              }
                              disabled={(date) => {
                                if (!orderData.dueDate) return true;
                                const maxReturnDate = new Date(orderData.dueDate);
                                maxReturnDate.setDate(orderData.dueDate.getDate() + 7);
                                return date < orderData.dueDate || date > maxReturnDate;
                              }}
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
                      {measurementFields.map(({ key, label, unit, min, max }) => {
                        const value = dressDetails[key as keyof IDressDetails];
                        const isValid = typeof value === 'number' && value >= min && value <= max;

                        return (
                          <div key={key} className="space-y-2">
                            <Label htmlFor={key}>
                              {label} ({unit}){' '}
                              <span className="text-xs text-gray-500">
                                ({min}-{max})
                              </span>
                            </Label>
                            <Input
                              id={key}
                              type="number"
                              min={min}
                              max={max}
                              value={value}
                              onChange={(e) => {
                                const newValue = Number(e.target.value);
                                if (newValue >= min && newValue <= max) {
                                  setDressDetails((prev) => ({
                                    ...prev,
                                    [key]: newValue,
                                  }));
                                }
                              }}
                              onBlur={(e) => {
                                const newValue = Number(e.target.value);
                                if (newValue < min) {
                                  setDressDetails((prev) => ({
                                    ...prev,
                                    [key]: min,
                                  }));
                                } else if (newValue > max) {
                                  setDressDetails((prev) => ({
                                    ...prev,
                                    [key]: max,
                                  }));
                                }
                              }}
                              className={cn(
                                'text-center',
                                !isValid && 'border-red-300 focus:border-red-500',
                              )}
                            />
                            {!isValid && (
                              <p className="text-xs text-red-500">
                                {label} phải từ {min}-{max}
                                {unit}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <Info className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Không có váy cưới</h3>
                    <p className="text-gray-600">
                      Bước này sẽ được bỏ qua vì không có váy cưới trong đơn hàng.
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
                    Phụ kiện của shop (
                    {accessoriesDetails.filter((item) => item.quantity > 0).length})
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Chọn phụ kiện bạn muốn mua/thuê cùng với váy
                  </p>
                </CardHeader>
                <CardContent>
                  {isLoadingAccessories ? (
                    <div className="text-center py-8">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-rose-600 border-t-transparent mx-auto mb-4"></div>
                      <p className="text-gray-600">Đang tải phụ kiện...</p>
                    </div>
                  ) : shopAccessories.length > 0 ? (
                    <div className="space-y-4">
                      {shopAccessories.map((accessory) => {
                        const detail = accessoriesDetails.find(
                          (item) => item.accessoryId === accessory.id,
                        );
                        const quantity = detail?.quantity || 0;
                        const price =
                          orderData.type === 'SELL' ? accessory.sellPrice : accessory.rentalPrice;

                        return (
                          <div
                            key={accessory.id}
                            className="flex items-center gap-4 p-4 border rounded-lg hover:border-rose-300 transition-colors"
                          >
                            <Image
                              src={accessory.images?.split(',')[0] || '/placeholder.svg'}
                              alt={accessory.name}
                              className="w-16 h-16 object-cover rounded-md"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium">{accessory.name}</h4>
                              <p className="text-sm text-gray-600">{accessory.category?.name}</p>
                              <p className="text-lg font-bold text-rose-600">
                                {formatPrice(price)}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => updateAccessoryQuantity(accessory.id, -1)}
                                disabled={quantity <= 0}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-12 text-center font-medium">{quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => updateAccessoryQuantity(accessory.id, 1)}
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
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Không có phụ kiện</h3>
                      <p className="text-gray-600">Shop này chưa có phụ kiện nào để bán/thuê.</p>
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
                        <span className="font-medium">Điện thoại:</span> {orderData.phone}
                      </p>
                      <p>
                        <span className="font-medium">Email:</span> {orderData.email}
                      </p>
                      <p>
                        <span className="font-medium">Địa chỉ:</span> {orderData.address}
                      </p>
                      <p>
                        <span className="font-medium">Loại:</span>{' '}
                        <Badge variant={orderData.type === 'SELL' ? 'default' : 'secondary'}>
                          {orderData.type === 'SELL' ? 'Mua' : 'Thuê'}
                        </Badge>
                      </p>
                      <p>
                        <span className="font-medium">Ngày cần hàng:</span>{' '}
                        {orderData.dueDate
                          ? format(orderData.dueDate, 'dd/MM/yyyy', {
                              locale: vi,
                            })
                          : 'Chưa chọn'}
                      </p>
                      {orderData.returnDate && (
                        <p>
                          <span className="font-medium">Ngày trả hàng:</span>{' '}
                          {format(orderData.returnDate, 'dd/MM/yyyy', {
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
                        <div className="space-y-3">
                          {/* Thông tin váy */}
                          <div className="flex items-center gap-4 p-4 border rounded-lg">
                            <Image
                              src={dress.images?.split(',')[0] || '/placeholder.svg'}
                              alt={dress.name}
                              className="w-16 h-16 object-cover rounded-md"
                            />
                            <div className="flex-1">
                              <h5 className="font-medium">{dress.name}</h5>
                              <p className="text-sm text-gray-600">{dress.category?.name}</p>
                            </div>
                            <div className="text-right">
                              {orderData.type === 'SELL' ? (
                                <p className="font-bold text-rose-600">
                                  {formatPrice(
                                    typeof dress.sellPrice === 'string'
                                      ? parseFloat(dress.sellPrice) || 0
                                      : dress.sellPrice || 0,
                                  )}
                                </p>
                              ) : (
                                <div className="space-y-1">
                                  <p className="text-sm text-gray-600">
                                    Giá thuê:{' '}
                                    {formatPrice(
                                      typeof dress.rentalPrice === 'string'
                                        ? parseFloat(dress.rentalPrice) || 0
                                        : dress.rentalPrice || 0,
                                    )}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Tiền cọc:{' '}
                                    {formatPrice(
                                      typeof dress.sellPrice === 'string'
                                        ? parseFloat(dress.sellPrice) || 0
                                        : dress.sellPrice || 0,
                                    )}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Chi tiết tính toán cho đơn thuê */}
                          {orderData.type === 'RENT' &&
                            orderData.returnDate &&
                            orderData.dueDate && (
                              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <h6 className="font-medium text-blue-800 mb-2">
                                  Chi tiết tính toán:
                                </h6>
                                <div className="space-y-1 text-sm text-blue-700">
                                  {(() => {
                                    const rentalPrice =
                                      typeof dress.rentalPrice === 'string'
                                        ? parseFloat(dress.rentalPrice) || 0
                                        : dress.rentalPrice || 0;
                                    const sellPrice =
                                      typeof dress.sellPrice === 'string'
                                        ? parseFloat(dress.sellPrice) || 0
                                        : dress.sellPrice || 0;
                                    const rentalDays = Math.ceil(
                                      (orderData.returnDate.getTime() -
                                        orderData.dueDate.getTime()) /
                                        (1000 * 60 * 60 * 24),
                                    );

                                    return (
                                      <>
                                        <p>• Số ngày thuê: {rentalDays} ngày</p>
                                        <p>
                                          • Tiền thuê: {formatPrice(rentalPrice)} × {rentalDays} ={' '}
                                          {formatPrice(rentalPrice * rentalDays)}
                                        </p>
                                        <p>• Tiền cọc: {formatPrice(sellPrice)}</p>
                                        <p className="font-medium">
                                          • Tổng váy:{' '}
                                          {formatPrice(rentalPrice * rentalDays + sellPrice)}
                                        </p>
                                        {(() => {
                                          const accessoriesTotal = accessoriesDetails
                                            .filter((item) => item.quantity > 0)
                                            .reduce((acc, item) => {
                                              const accessory = shopAccessories.find(
                                                (acc) => acc.id === item.accessoryId,
                                              );
                                              if (accessory) {
                                                const price =
                                                  typeof accessory.rentalPrice === 'string'
                                                    ? parseFloat(accessory.rentalPrice) || 0
                                                    : accessory.rentalPrice || 0;
                                                return acc + price * item.quantity * rentalDays;
                                              }
                                              return acc;
                                            }, 0);

                                          if (accessoriesTotal > 0) {
                                            return (
                                              <>
                                                <p>
                                                  • Tiền phụ kiện: {formatPrice(accessoriesTotal)}
                                                </p>
                                                <p className="font-medium text-blue-800">
                                                  • Tổng cộng:{' '}
                                                  {formatPrice(
                                                    rentalPrice * rentalDays +
                                                      sellPrice +
                                                      accessoriesTotal,
                                                  )}
                                                </p>
                                              </>
                                            );
                                          }
                                          return null;
                                        })()}
                                      </>
                                    );
                                  })()}
                                </div>
                              </div>
                            )}
                        </div>
                      )}

                      {accessoriesDetails
                        .filter((item) => item.quantity > 0)
                        .map((item) => {
                          const accessory = shopAccessories.find(
                            (acc) => acc.id === item.accessoryId,
                          );
                          if (!accessory) return null;

                          const price =
                            orderData.type === 'SELL' ? accessory.sellPrice : accessory.rentalPrice;

                          return (
                            <div
                              key={item.accessoryId}
                              className="flex items-center gap-4 p-4 border rounded-lg"
                            >
                              <Image
                                src={accessory.images?.split(',')[0] || '/placeholder.svg'}
                                alt={accessory.name}
                                className="w-16 h-16 object-cover rounded-md"
                              />
                              <div className="flex-1">
                                <h5 className="font-medium">{accessory.name}</h5>
                                <p className="text-sm text-gray-600">
                                  {accessory.category?.name} × {item.quantity}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-rose-600">
                                  {formatPrice(
                                    (typeof price === 'string'
                                      ? parseFloat(price) || 0
                                      : price || 0) * item.quantity,
                                  )}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Tổng cộng:</span>
                    <span className="text-rose-600">{formatPrice(calculateTotal())}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <div className="flex gap-2">
            {currentStep > 1 && (
              <Button variant="outline" onClick={handlePrevious} disabled={isSubmitting}>
                Quay lại
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            {currentStep < 4 ? (
              <Button onClick={handleNext} className="bg-rose-600 hover:bg-rose-700">
                Tiếp tục
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-rose-600 hover:bg-rose-700"
              >
                {isSubmitting ? 'Đang xử lý...' : 'Tạo đơn hàng'}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
