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
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, Trash2, DollarSign, Ruler, Palette, Shirt } from 'lucide-react';
import type { IDress } from '@/services/types';
import { dressStatusColors, dressStatusLabels, formatPrice, getImages } from '@/lib/products-utils';
import { ImageGallery } from '@/components/image-gallery';
import { ConfirmDialog } from '@/components/confirm-dialog.tsx';
import { useDeleteDressMutation } from '@/services/apis';
import { toast } from 'sonner';

interface DeleteDressDialogProps {
  dress: IDress;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function DeleteDressDialog({ dress, trigger, onSuccess }: DeleteDressDialogProps) {
  const [open, setOpen] = useState(false);
  const [dressImages, setDressImages] = useState<string[]>(getImages(dress.images));
  useEffect(() => {
    setDressImages(getImages(dress.images));
  }, [dress]);

  const [deleteDress, { isLoading }] = useDeleteDressMutation();

  const handleDelete = async () => {
    try {
      const { statusCode, message } = await deleteDress(dress.id).unwrap();
      if (statusCode === 204) {
        toast.success(message);
        onSuccess?.();
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra khi xóa sản phẩm');
    }
  };

  const defaultTrigger = (
    <Button variant="ghost" size="sm">
      <Eye className="h-4 w-4" />
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="min-w-[90vw] md:min-w-5xl max-w-5xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{dress.name}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Images Section */}
            <div className="space-y-4 w-full h-auto">
              <ImageGallery images={dressImages} alt={dress.name} />
            </div>

            {/* Details Section */}
            <div className="space-y-6">
              {/* Status and Category */}
              <div className="flex items-center justify-between">
                <Badge
                  className={dressStatusColors[dress.status as keyof typeof dressStatusColors]}
                >
                  {dressStatusLabels[dress.status as keyof typeof dressStatusLabels]}
                </Badge>
                {dress.category && <Badge variant="outline">{dress.category.name}</Badge>}
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold mb-2">Mô tả</h3>
                <p className="text-muted-foreground">{dress.description}</p>
              </div>

              {/* Pricing */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Giá cả
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dress.isSellable && dress.sellPrice && (
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-sm text-muted-foreground">Giá bán</div>
                        <div className="text-xl font-bold text-green-600">
                          {formatPrice(
                            typeof dress.sellPrice === 'string'
                              ? parseFloat(dress.sellPrice) || 0
                              : dress.sellPrice || 0,
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  {dress.isRentable && dress.rentalPrice && (
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-sm text-muted-foreground">Giá thuê</div>
                        <div className="text-xl font-bold text-blue-600">
                          {formatPrice(
                            typeof dress.rentalPrice === 'string'
                              ? parseFloat(dress.rentalPrice) || 0
                              : dress.rentalPrice || 0,
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>

              {/* Measurements */}
              {(dress.bust || dress.waist || dress.hip) && (
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center">
                    <Ruler className="h-4 w-4 mr-2" />
                    Số đo (cm)
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {dress.bust && (
                      <div className="text-center">
                        <div className="text-2xl font-bold">{dress.bust}</div>
                        <div className="text-sm text-muted-foreground">Ngực</div>
                      </div>
                    )}
                    {dress.waist && (
                      <div className="text-center">
                        <div className="text-2xl font-bold">{dress.waist}</div>
                        <div className="text-sm text-muted-foreground">Eo</div>
                      </div>
                    )}
                    {dress.hip && (
                      <div className="text-center">
                        <div className="text-2xl font-bold">{dress.hip}</div>
                        <div className="text-sm text-muted-foreground">Hông</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <Separator />

              {/* Details */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center">
                  <Shirt className="h-4 w-4 mr-2" />
                  Chi tiết
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dress.material && (
                    <div>
                      <div className="text-sm text-muted-foreground">Chất liệu</div>
                      <div className="font-medium">{dress.material}</div>
                    </div>
                  )}
                  {dress.color && (
                    <div>
                      <div className="text-sm text-muted-foreground">Màu sắc</div>
                      <div className="font-medium flex items-center">
                        <Palette className="h-4 w-4 mr-2" />
                        {dress.color}
                      </div>
                    </div>
                  )}
                  {dress.length && (
                    <div>
                      <div className="text-sm text-muted-foreground">Độ dài</div>
                      <div className="font-medium">{dress.length}</div>
                    </div>
                  )}
                  {dress.neckline && (
                    <div>
                      <div className="text-sm text-muted-foreground">Cổ áo</div>
                      <div className="font-medium">{dress.neckline}</div>
                    </div>
                  )}
                  {dress.sleeve && (
                    <div>
                      <div className="text-sm text-muted-foreground">Tay áo</div>
                      <div className="font-medium">{dress.sleeve}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Metadata */}
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>Tạo lúc: {new Date(dress.createdAt).toLocaleDateString('vi-VN')}</div>
                <div>Cập nhật: {new Date(dress.updatedAt).toLocaleDateString('vi-VN')}</div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Đóng
          </Button>
          <ConfirmDialog
            title="Xác nhận xóa"
            description={`Bạn có chắc chắn muốn xóa ${dress.name}?`}
            onConfirm={() => {
              handleDelete();
              setOpen(false);
            }}
          >
            <Button variant="destructive" disabled={isLoading}>
              <Trash2 className="h-4 w-4 mr-2" />
              {isLoading ? 'Đang xóa...' : 'Xóa'}
            </Button>
          </ConfirmDialog>
        </div>
      </DialogContent>
    </Dialog>
  );
}
