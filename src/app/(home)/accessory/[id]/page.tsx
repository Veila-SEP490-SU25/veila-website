'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Image } from '@/components/image';
import { Star, Heart, ShoppingBag, MapPin, Phone, Mail } from 'lucide-react';
import { useLazyGetAccessoryQuery } from '@/services/apis/accessory.api';
import { IAccessory } from '@/services/types/accessory.type';

export default function AccessoryDetailPage() {
  const params = useParams();
  const accessoryId = params.id as string;

  const [accessory, setAccessory] = useState<IAccessory | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [getAccessory] = useLazyGetAccessoryQuery();

  const fetchAccessory = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getAccessory(accessoryId).unwrap();
      setAccessory(response.item);
    } catch (error) {
      console.error('Error fetching accessory:', error);
    } finally {
      setIsLoading(false);
    }
  }, [accessoryId, getAccessory]);

  useEffect(() => {
    if (accessoryId) {
      fetchAccessory();
    }
  }, [accessoryId, fetchAccessory]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="w-full h-96" />
            <div className="space-y-4">
              <Skeleton className="w-3/4 h-8" />
              <Skeleton className="w-1/2 h-6" />
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-1/3 h-10" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!accessory) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy phụ kiện</h1>
          <p className="text-gray-600">Phụ kiện bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        </div>
      </div>
    );
  }

  const userName =
    accessory.user?.firstName && accessory.user?.lastName
      ? `${accessory.user.firstName} ${accessory.user.lastName}`
      : accessory.user?.username || 'Người dùng';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="relative">
              <Image
                src={accessory.images || '/placeholder.svg'}
                alt={accessory.name}
                className="w-full h-96 object-cover rounded-lg"
                width={600}
                height={400}
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{accessory.name}</h1>
              <p className="text-gray-600 mb-4">by {userName}</p>

              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium ml-1">{accessory.ratingAverage}</span>
                </div>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-600">{accessory.ratingCount} đánh giá</span>
              </div>

              <div className="space-y-2">
                {accessory.isSellable && (
                  <p className="text-2xl font-bold text-gray-900">
                    {accessory.sellPrice.toLocaleString('vi-VN')}₫
                  </p>
                )}
                {accessory.isRentable && (
                  <p className="text-lg text-gray-600">
                    Thuê: {accessory.rentalPrice.toLocaleString('vi-VN')}₫
                  </p>
                )}
              </div>
            </div>

            <Separator />

            {/* Category */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Danh mục</h3>
              <Badge variant="secondary">{accessory.category?.name || 'Chưa phân loại'}</Badge>
            </div>

            {/* Description */}
            {accessory.description && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Mô tả</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">{accessory.description}</p>
                </div>
              </>
            )}

            {/* Shop Info */}
            {accessory.user?.shop && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-4">Thông tin cửa hàng</h3>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Image
                          src={accessory.user.shop.logoUrl || '/placeholder.svg'}
                          alt={accessory.user.shop.name}
                          className="w-12 h-12 rounded-full object-cover"
                          width={48}
                          height={48}
                        />
                        <div>
                          <h4 className="font-semibold">{accessory.user.shop.name}</h4>
                          <p className="text-sm text-gray-600">
                            Uy tín: {accessory.user.shop.reputation}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{accessory.user.shop.address}</span>
                        </div>
                        {accessory.user.shop.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span>{accessory.user.shop.phone}</span>
                          </div>
                        )}
                        {accessory.user.shop.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span>{accessory.user.shop.email}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button className="flex-1 bg-rose-600 hover:bg-rose-700">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Thêm vào giỏ hàng
              </Button>
              <Button variant="outline">
                <Heart className="h-4 w-4 mr-2" />
                Yêu thích
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
