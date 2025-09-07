'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Loader2, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import type { IShop, IUpdateShopInfo } from '@/services/types';
import { LocationInput } from '@/components/location-input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface UpdateShopInfoDialogProps {
  shop: IShop;
  trigger?: React.ReactNode;
  setInfo: (info: IUpdateShopInfo) => void;
  onSuccess?: () => void;
  handleUpdateInfo: (info: IUpdateShopInfo) => Promise<void>;
  isUpdating?: boolean;
}

export function UpdateShopInfoDialog({
  shop,
  trigger,
  onSuccess,
  handleUpdateInfo,
  setInfo,
  isUpdating = false,
}: UpdateShopInfoDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<IUpdateShopInfo>({
    name: '',
    phone: '',
    email: '',
    address: '',
    description: '',
    logoUrl: '',
    coverUrl: '',
  });
  const [errors, setErrors] = useState<Partial<IUpdateShopInfo>>({});

  // Initialize form data when dialog opens or shop changes
  useEffect(() => {
    if (open && shop) {
      setFormData({
        name: shop.name || '',
        phone: shop.phone || '',
        email: shop.email || '',
        address: shop.address || '',
        description: shop.description || '',
        logoUrl: shop.logoUrl || '',
        coverUrl: shop.coverUrl || '',
      });
      setErrors({});
    }
  }, [open, shop]);

  const validateForm = (): boolean => {
    const newErrors: Partial<IUpdateShopInfo> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Tên cửa hàng là bắt buộc';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Tên cửa hàng phải có ít nhất 2 ký tự';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Số điện thoại là bắt buộc';
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Mô tả là bắt buộc';
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'Mô tả phải có ít nhất 20 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof IUpdateShopInfo, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Vui lòng kiểm tra lại thông tin');
      return;
    }

    console.log('Form data:', formData);
    setInfo(formData);
    try {
      // Use the handleUpdateInfo function passed from parent component
      await handleUpdateInfo(formData);

      // Close dialog and call success callback
      setOpen(false);
      onSuccess?.();
    } catch (error: any) {
      console.error('Update shop info error:', error);
      // Error handling is done in the parent component's handleUpdateInfo
    }
  };

  const handleCancel = () => {
    setOpen(false);
    setErrors({});
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm" disabled={isUpdating}>
      <Edit className="h-4 w-4 mr-2" />
      Chỉnh sửa
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="min-w-4xl max-w-4xl max-h-[90vh] overflow-hidden">
        <ScrollArea className="w-full max-h-[80vh] px-4">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center">
              <Edit className="h-6 w-6 mr-2 text-blue-600" />
              Cập Nhật Thông Tin Cửa Hàng
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Shop Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Tên cửa hàng <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Nhập tên cửa hàng"
                className={errors.name ? 'border-red-500 focus:border-red-500' : ''}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Số điện thoại <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Nhập số điện thoại"
                className={errors.phone ? 'border-red-500 focus:border-red-500' : ''}
              />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Nhập địa chỉ email"
                className={errors.email ? 'border-red-500 focus:border-red-500' : ''}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium">
                Địa chỉ <span className="text-red-500">*</span>
              </Label>
              <LocationInput
                location={formData.address}
                setLocation={(value) => handleInputChange('address', value)}
              />
              {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Mô tả <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Nhập mô tả về cửa hàng"
                rows={4}
                className={errors.description ? 'border-red-500 focus:border-red-500' : ''}
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
              <p className="text-xs text-gray-500">{formData.description.length}/500 ký tự</p>
            </div>

            {/* Current vs New Info Comparison */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <h4 className="font-medium text-gray-700">Thông tin hiện tại:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Tên:</span> {shop.name}
                </div>
                <div>
                  <span className="text-gray-500">SĐT:</span> {shop.phone}
                </div>
                <div>
                  <span className="text-gray-500">Email:</span> {shop.email}
                </div>
                <div className="md:col-span-2">
                  <span className="text-gray-500">Địa chỉ:</span> {shop.address}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={handleCancel} disabled={isUpdating}>
              <X className="h-4 w-4 mr-2" />
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isUpdating}
              className="bg-rose-600 hover:bg-rose-700"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang cập nhật...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Cập nhật
                </>
              )}
            </Button>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
