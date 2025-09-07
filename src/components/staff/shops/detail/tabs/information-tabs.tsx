'use client';

import { ImageGallery } from '@/components/image-gallery';
import { UpdateShopInfoDialog } from '@/components/shops/my/upadte-shop-info-dialog';
import { ActionButton } from '@/components/staff/shops/detail/action-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { TabsContent } from '@/components/ui/tabs';
import { SingleImageUploadDialog } from '@/components/upload-image-dialog';
import { formatDateShort } from '@/lib/order-util';
import { getImages } from '@/lib/products-utils';
import { cn } from '@/lib/utils';
import { useUpdateShopInfoMutation } from '@/services/apis';
import {
  ILicense,
  IMembership,
  IShop,
  IUpdateShopInfo,
  IUser,
  LicenseStatus,
  ShopStatus,
} from '@/services/types';
import {
  Award,
  Calendar,
  Camera,
  CheckCircle,
  Edit,
  Edit2,
  Images,
  Info,
  Mail,
  MapPin,
  Phone,
  Shield,
  ShieldCheck,
  UserRound,
  UserRoundCheck,
} from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface InformationTabsProps {
  shop: IShop;
  onUpdate?: () => void;
}

const getVerificationBadge = (isVerified: boolean) => {
  return isVerified ? (
    <Badge className="bg-blue-100 text-blue-700">
      <ShieldCheck className="h-3 w-3 mr-1" />
      Đã xác minh
    </Badge>
  ) : (
    <Badge className="bg-gray-100 text-gray-700">
      <Shield className="h-3 w-3 mr-1" />
      Chưa xác minh
    </Badge>
  );
};

const getStatusBadge = (status: ShopStatus) => {
  const statusConfig = {
    [ShopStatus.ACTIVE]: {
      label: 'Hoạt động',
      className: 'bg-green-100 text-green-700',
    },
    [ShopStatus.PENDING]: {
      label: 'Chờ duyệt',
      className: 'bg-yellow-100 text-yellow-700',
    },
    [ShopStatus.SUSPENDED]: {
      label: 'Tạm khóa',
      className: 'bg-red-100 text-red-700',
    },
    [ShopStatus.INACTIVE]: {
      label: 'Tạm ngưng',
      className: 'bg-gray-100 text-gray-700',
    },
    [ShopStatus.BANNED]: {
      label: 'Bị cấm',
      className: 'bg-red-200 text-red-800',
    },
  };
  const config = statusConfig[status];
  return <Badge className={config.className}>{config.label}</Badge>;
};

export const InformationTabs = ({ shop, onUpdate }: InformationTabsProps) => {
  const [owner, setOwner] = useState<IUser | null>(null);
  const [license, setLicense] = useState<ILicense | null>(null);
  const [memberships, setMemberships] = useState<IMembership[]>([]);

  const [updateShopInfo, { isLoading: isUpdating }] = useUpdateShopInfoMutation();
  const [info, setInfo] = useState<IUpdateShopInfo>({
    name: shop.name,
    phone: shop.phone,
    email: shop.email,
    address: shop.address,
    coverUrl: shop.coverUrl || '',
    description: shop.description || '',
    logoUrl: shop.logoUrl || '',
  });

  const handleUpdateInfo = useCallback(
    async (info: IUpdateShopInfo) => {
      try {
        const { statusCode, message } = await updateShopInfo(info).unwrap();
        if (statusCode === 200) {
          toast.success('Cập nhật thông tin cửa hàng thành công');
        } else {
          toast.error('Có lỗi xảy ra khi cập nhật thông tin cửa hàng', {
            description: message,
          });
        }
      } catch (error) {
        toast.error('Có lỗi xảy ra khi cập nhật thông tin cửa hàng vui lòng thử lại sau');
        console.error(error);
      }
    },
    [updateShopInfo],
  );

  useEffect(() => {
    if (shop.user) {
      setOwner(shop.user);
    } else {
      setOwner(null);
    }
    if (shop.license) {
      setLicense(shop.license);
    } else {
      setLicense(null);
    }
    if (shop.memberships) {
      setMemberships(shop.memberships);
    } else {
      setMemberships([]);
    }
  }, [shop]);

  return (
    <TabsContent value="info">
      <Card className="w-full pt-0 overflow-hidden">
        <CardHeader className="w-full p-0 relative space-y-6">
          <div className="aspect-[4/1] w-full relative">
            <Image
              src={shop.coverUrl || '/placeholder.svg'}
              alt="Shop Cover"
              width={300}
              height={100}
              className="size-full object-cover"
            />
            <div
              className={cn(
                'w-[calc(1/8*100%)] aspect-square absolute z-10 rounded-full border-4',
                'overflow-hidden bottom-0 left-10 translate-y-1/2',
                `border-white`,
              )}
            >
              <Avatar className="size-full relative">
                <AvatarImage
                  src={shop.logoUrl || ''}
                  alt="Shop Avatar"
                  className="size-full object-cover"
                />
                <AvatarFallback className="size-full text-7xl">
                  {shop.name.charAt(0)}
                </AvatarFallback>

                <SingleImageUploadDialog
                  imageUrl={shop.logoUrl || undefined}
                  onImageChange={(url) => setInfo((prev) => ({ ...prev, logoUrl: url }))}
                  trigger={
                    <Button
                      className="absolute top-1/2 left-1/2 size-full -translate-1/2 text-transparent hover:bg-gray-600/50 hover:text-white"
                      variant="ghost"
                    >
                      <Edit2 className="size-8" />
                    </Button>
                  }
                  handleUpload={() => handleUpdateInfo(info)}
                />
              </Avatar>
            </div>
            <SingleImageUploadDialog
              imageUrl={shop.coverUrl || undefined}
              onImageChange={(url) => setInfo((prev) => ({ ...prev, coverUrl: url }))}
              trigger={
                <Button
                  className="flex items-center gap-2 absolute right-4 top-4"
                  variant="outline"
                >
                  <Camera className="size-4" />
                  Thay đổi ảnh bìa
                </Button>
              }
              handleUpload={() => handleUpdateInfo(info)}
            />
          </div>

          <div className="pl-[calc(2.5rem+(1/8*100%))] flex items-center justify-between pr-6">
            <div className="px-4 flex items-start justify-center flex-col space-x-2 gap-2">
              <CardTitle>{shop.name}</CardTitle>
              <div className="flex items-center gap-2">
                {getVerificationBadge(shop.isVerified)} {getStatusBadge(shop.status)}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <UpdateShopInfoDialog
                shop={shop}
                handleUpdateInfo={handleUpdateInfo}
                setInfo={setInfo}
                isUpdating={isUpdating}
                trigger={
                  <Button
                    className="flex items-center gap-2"
                    variant="outline"
                    disabled={isUpdating}
                  >
                    <Edit className="size-4" />
                    Chỉnh sửa
                  </Button>
                }
              />
              <ActionButton shop={shop} onUpdate={onUpdate} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <CardTitle>Thông tin cơ bản</CardTitle>
            <Separator />
            <div className="grid grid-cols-6">
              <div className="col-span-1 flex items-center gap-2">
                <Info className="size-4 text-rose-500" />
                <Label>Giới thiệu</Label>
              </div>
              <div className="col-span-5">
                <p className="text-sm">{shop.description || 'Chưa có mô tả'}</p>
              </div>
            </div>
            <div className="grid grid-cols-6">
              <div className="col-span-1 flex items-center gap-2">
                <Mail className="size-4 text-rose-500" />
                <Label>Email</Label>
              </div>
              <div className="col-span-5">
                <p className="text-sm">{shop.email || 'Chưa có email'}</p>
              </div>
            </div>
            <div className="grid grid-cols-6">
              <div className="col-span-1 flex items-center gap-2">
                <Phone className="size-4 text-rose-500" />
                <Label>Điện thoại</Label>
              </div>
              <div className="col-span-5">
                <p className="text-sm">{shop.phone || 'Chưa có số điện thoại'}</p>
              </div>
            </div>
            <div className="grid grid-cols-6">
              <div className="col-span-1 flex items-center gap-2">
                <MapPin className="size-4 text-rose-500" />
                <Label>Địa chỉ</Label>
              </div>
              <div className="col-span-5">
                <p className="text-sm">{shop.address || 'Chưa có địa chỉ'}</p>
              </div>
            </div>
            <div className="grid grid-cols-6">
              <div className="col-span-1 flex items-center gap-2">
                <Award className="size-4 text-rose-500" />
                <Label>Điểm uy tín</Label>
              </div>
              <div className="col-span-5">
                <p className="text-sm">{shop.reputation}</p>
              </div>
            </div>
          </div>
          {owner && (
            <div className="space-y-4">
              <CardTitle>Thông tin chủ cửa hàng</CardTitle>
              <Separator />
              <div className="grid grid-cols-6">
                <div className="col-span-1 flex items-center gap-2">
                  <UserRound className="size-4 text-rose-500" />
                  <Label>Họ và tên</Label>
                </div>
                <div className="col-span-5">
                  <p className="text-sm">
                    {owner.firstName} {owner.middleName} {owner.lastName}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-6">
                <div className="col-span-1 flex items-center gap-2">
                  <UserRound className="size-4 text-rose-500" />
                  <Label>Tên người dùng</Label>
                </div>
                <div className="col-span-5">
                  <p className="text-sm">{owner.username || 'Chưa có tên người dùng'}</p>
                </div>
              </div>
              <div className="grid grid-cols-6">
                <div className="col-span-1 flex items-center gap-2">
                  <Mail className="size-4 text-rose-500" />
                  <Label>Email</Label>
                </div>
                <div className="col-span-5">
                  <p className="text-sm">{owner.email || 'Chưa có email'}</p>
                </div>
              </div>
              <div className="grid grid-cols-6">
                <div className="col-span-1 flex items-center gap-2">
                  <Phone className="size-4 text-rose-500" />
                  <Label>Điện thoại</Label>
                </div>
                <div className="col-span-5">
                  <p className="text-sm">{owner.phone || 'Chưa có số điện thoại'}</p>
                </div>
              </div>
              <div className="grid grid-cols-6">
                <div className="col-span-1 flex items-center gap-2">
                  <MapPin className="size-4 text-rose-500" />
                  <Label>Địa chỉ</Label>
                </div>
                <div className="col-span-5">
                  <p className="text-sm">{owner.address || 'Chưa có địa chỉ'}</p>
                </div>
              </div>
            </div>
          )}
          {license && (
            <div className="space-y-4">
              <CardTitle>Thông tin giấy phép kinh doanh</CardTitle>
              <Separator />
              <div className="grid grid-cols-6 items-start">
                <div className="col-span-1 flex items-center gap-2">
                  <Images className="size-4 text-rose-500" />
                  <Label>Hình ảnh giấy phép</Label>
                </div>
                <div className="col-span-5">
                  <ImageGallery
                    images={getImages(license.images)}
                    alt={`Hình ảnh giấy phép ${shop.name}`}
                  />
                </div>
              </div>
              {license.status === LicenseStatus.REJECTED && (
                <div className="grid grid-cols-6">
                  <div className="col-span-1 flex items-center gap-2">
                    <Label>Lý do từ chối</Label>
                  </div>
                  <div className="col-span-5">
                    <p className="text-sm">{license.rejectReason || 'Chưa có lý do'}</p>
                  </div>
                </div>
              )}
            </div>
          )}
          {memberships.length > 0 && (
            <div className="space-y-4">
              <CardTitle>Thông tin gói thành viên</CardTitle>
              <Separator />
              {memberships.map((membership) => (
                <div key={membership.id} className="grid grid-cols-6 items-start">
                  <div className="col-span-1 flex items-center gap-2">
                    <UserRoundCheck className="size-4 text-rose-500" />
                    <Label>Gói thành viên #{membership.id.substring(0, 8)}</Label>
                  </div>
                  <div className="col-span-5 space-y-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4 text-rose-500" />
                      <p className="text-sm">Thời hạn: </p>
                      <p className="text-sm">{formatDateShort(membership.startDate)}</p>
                      <span className="text-sm">-</span>
                      <p className="text-sm">{formatDateShort(membership.endDate)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="size-4 text-rose-500" />
                      <p className="text-sm">Trạng thái: {membership.status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
};
