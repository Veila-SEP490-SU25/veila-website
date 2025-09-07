'use client';

import type React from 'react';

import { useEffect, useState } from 'react';
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
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Plus, Loader2, Save } from 'lucide-react';
import { useUpdateDressMutation } from '@/services/apis';
import { IDress, IUpdateDress, type ICreateDress } from '@/services/types';
import { toast } from 'sonner';
import { ImagesUpload } from '@/components/images-upload';

interface UpdateDressDialogProps {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
  dress: IDress;
}

export function UpdateDressDialog({ trigger, onSuccess, dress }: UpdateDressDialogProps) {
  const [open, setOpen] = useState(false);
  const [updateDress, { isLoading }] = useUpdateDressMutation();

  const [dressData, setDressData] = useState<IUpdateDress>({
    id: dress.id,
    categoryId: dress.categoryId,
    name: dress.name,
    description: dress.description || '',
    sellPrice: parseInt(dress.sellPrice.toString()) || 0,
    rentalPrice: parseInt(dress.rentalPrice.toString()) || 0,
    isSellable: dress.isSellable,
    isRentable: dress.isRentable,
    status: dress.status,
    images: dress.images || '',
    bust: dress.bust || 0,
    waist: dress.waist || 0,
    hip: dress.hip || 0,
    material: dress.material || '',
    color: dress.color || '',
    length: dress.length || '',
    neckline: dress.neckline || '',
    sleeve: dress.sleeve || '',
  });

  const [imageUrls, setImageUrls] = useState<string>(dress.images || '');

  const handleInputChange = (field: keyof ICreateDress, value: any) => {
    setDressData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setDressData({
      id: dress.id,
      categoryId: dress.categoryId,
      name: dress.name,
      description: dress.description || '',
      sellPrice: parseInt(dress.sellPrice.toString()) || 0,
      rentalPrice: parseInt(dress.rentalPrice.toString()) || 0,
      isSellable: dress.isSellable,
      isRentable: dress.isRentable,
      status: dress.status,
      images: dress.images || '',
      bust: dress.bust || 0,
      waist: dress.waist || 0,
      hip: dress.hip || 0,
      material: dress.material || '',
      color: dress.color || '',
      length: dress.length || '',
      neckline: dress.neckline || '',
      sleeve: dress.sleeve || '',
    });
    setImageUrls(dress.images || '');
  };

  useEffect(() => {
    setDressData((prev) => ({
      ...prev,
      images: imageUrls,
    }));
  }, [imageUrls]);

  const handleSubmit = async () => {
    try {
      const { statusCode, message } = await updateDress(dressData).unwrap();
      if (statusCode === 201 || statusCode == 200 || statusCode == 204 || statusCode == 202) {
        toast.success('Cập nhật váy thành công!');
        setOpen(false);
        resetForm();
        onSuccess?.();
      } else {
        toast.error(message || 'Có lỗi xảy ra khi cập nhật váy');
      }
    } catch (error) {
      console.error('Error updating dress:', error);
      toast.error('Có lỗi xảy ra khi cập nhật váy');
    }
  };

  const handleCancel = () => {
    setOpen(false);
    resetForm();
  };

  const defaultTrigger = (
    <Button className="bg-rose-600 hover:bg-rose-700">
      <Plus className="h-4 w-4 mr-2" />
      Chỉnh sửa váy
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="min-w-[90vw] md:min-w-5xl max-w-5xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Chỉnh sửa váy</DialogTitle>
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
                    placeholder="Nhập tên váy"
                    value={dressData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả *</Label>
                  <Textarea
                    id="description"
                    placeholder="Nhập mô tả chi tiết về váy"
                    value={dressData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
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
                    <p className="text-sm text-muted-foreground">Cho phép khách hàng mua váy này</p>
                  </div>
                  <Switch
                    checked={dressData.isSellable}
                    onCheckedChange={(checked) => handleInputChange('isSellable', checked)}
                  />
                </div>

                {dressData.isSellable && (
                  <div className="space-y-2">
                    <Label htmlFor="sellPrice">Giá bán (VNĐ) *</Label>
                    <Input
                      id="sellPrice"
                      type="number"
                      placeholder="0"
                      value={dressData.sellPrice || ''}
                      onChange={(e) =>
                        handleInputChange('sellPrice', Number.parseInt(e.target.value) || 0)
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
                    checked={dressData.isRentable}
                    onCheckedChange={(checked) => handleInputChange('isRentable', checked)}
                  />
                </div>

                {dressData.isRentable && (
                  <div className="space-y-2">
                    <Label htmlFor="rentalPrice">Giá thuê (VNĐ) *</Label>
                    <Input
                      id="rentalPrice"
                      type="number"
                      placeholder="0"
                      value={dressData.rentalPrice || ''}
                      onChange={(e) =>
                        handleInputChange('rentalPrice', Number.parseInt(e.target.value) || 0)
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
                    <Label htmlFor="bust">Ngực *</Label>
                    <Input
                      id="bust"
                      type="number"
                      placeholder="0"
                      value={dressData.bust || ''}
                      onChange={(e) =>
                        handleInputChange('bust', Number.parseInt(e.target.value) || 0)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="waist">Eo *</Label>
                    <Input
                      id="waist"
                      type="number"
                      placeholder="0"
                      value={dressData.waist || ''}
                      onChange={(e) =>
                        handleInputChange('waist', Number.parseInt(e.target.value) || 0)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hip">Hông *</Label>
                    <Input
                      id="hip"
                      type="number"
                      placeholder="0"
                      value={dressData.hip || ''}
                      onChange={(e) =>
                        handleInputChange('hip', Number.parseInt(e.target.value) || 0)
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
                    <Label htmlFor="material">Chất liệu *</Label>
                    <Input
                      id="material"
                      placeholder="Ví dụ: Cotton, Lụa, Voan..."
                      value={dressData.material || ''}
                      onChange={(e) => handleInputChange('material', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="color">Màu sắc *</Label>
                    <Input
                      id="color"
                      placeholder="Ví dụ: Đỏ, Xanh, Trắng..."
                      value={dressData.color || ''}
                      onChange={(e) => handleInputChange('color', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="length">Độ dài *</Label>
                    <Input
                      id="length"
                      placeholder="Ví dụ: Ngắn, Dài, Midi..."
                      value={dressData.length || ''}
                      onChange={(e) => handleInputChange('length', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="neckline">Cổ áo *</Label>
                    <Input
                      id="neckline"
                      placeholder="Ví dụ: Cổ tròn, Cổ V, Cổ vuông..."
                      value={dressData.neckline || ''}
                      onChange={(e) => handleInputChange('neckline', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sleeve">Tay áo *</Label>
                    <Input
                      id="sleeve"
                      placeholder="Ví dụ: Tay ngắn, Tay dài, Không tay..."
                      value={dressData.sleeve || ''}
                      onChange={(e) => handleInputChange('sleeve', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Images */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Hình ảnh *</h3>
                <div className="flex gap-2">
                  <ImagesUpload imageUrls={imageUrls} setImageUrls={(urls) => setImageUrls(urls)} />
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
                Lưu thông tin váy
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
