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
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, DollarSign, Star } from "lucide-react";
import type { IAccessory } from "@/services/types";
import { ImageGallery } from "@/components/image-gallery";
import {
  accessoryStatusColors,
  accessoryStatusLabels,
  formatPrice,
  getImages,
} from "@/lib/utils";

interface AccessoryDetailDialogProps {
  accessory: IAccessory;
  trigger?: React.ReactNode;
}

export function AccessoryDetailDialog({
  accessory,
  trigger,
}: AccessoryDetailDialogProps) {
  const [open, setOpen] = useState(false);

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
          <DialogTitle className="text-2xl font-bold">
            {accessory.name}{" "}
            <div className="flex items-center text-sm text-muted-foreground">
              <Star className="mr-2 text-yellow-300" />
              {accessory.ratingAverage} • {accessory.ratingCount} bài đánh giá
            </div>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Images Section */}
            <div className="space-y-4">
              <ImageGallery
                images={getImages(accessory.images)}
                alt={accessory.name}
              />
            </div>

            {/* Details Section */}
            <div className="space-y-6">
              {/* Status and Category */}
              <div className="flex items-center justify-between">
                <Badge
                  className={
                    accessoryStatusColors[
                      accessory.status as keyof typeof accessoryStatusColors
                    ]
                  }
                >
                  {
                    accessoryStatusLabels[
                      accessory.status as keyof typeof accessoryStatusLabels
                    ]
                  }
                </Badge>
                {accessory.category && (
                  <Badge variant="outline">{accessory.category.name}</Badge>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold mb-2">Mô tả</h3>
                <p className="text-muted-foreground">{accessory.description}</p>
              </div>

              {/* Pricing */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Giá cả
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {accessory.isSellable && accessory.sellPrice && (
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-sm text-muted-foreground">
                          Giá bán
                        </div>
                        <div className="text-xl font-bold text-green-600">
                          {formatPrice(accessory.sellPrice)}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  {accessory.isRentable && accessory.rentalPrice && (
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-sm text-muted-foreground">
                          Giá thuê
                        </div>
                        <div className="text-xl font-bold text-blue-600">
                          {formatPrice(accessory.rentalPrice)}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>

              <Separator />

              {/* Metadata */}
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>
                  Tạo lúc:{" "}
                  {new Date(accessory.createdAt).toLocaleDateString("vi-VN")}
                </div>
                <div>
                  Cập nhật:{" "}
                  {new Date(accessory.updatedAt).toLocaleDateString("vi-VN")}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
