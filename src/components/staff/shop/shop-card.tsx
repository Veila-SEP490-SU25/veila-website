"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IShop, ShopStatus } from "@/services/types";
import {
  Ban,
  Check,
  Eye,
  Lock,
  LockOpen,
  Mail,
  MapPin,
  Phone,
  Shield,
  ShieldCheck,
  ShieldCheckIcon,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ShopCardProps {
  shop: IShop;
  onUpdate?: () => void;
}

export const ShopCard = ({ shop, onUpdate }: ShopCardProps) => {
  const router = useRouter();

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
        label: "Hoạt động",
        className: "bg-green-100 text-green-700",
      },
      [ShopStatus.PENDING]: {
        label: "Chờ duyệt",
        className: "bg-yellow-100 text-yellow-700",
      },
      [ShopStatus.SUSPENDED]: {
        label: "Tạm khóa",
        className: "bg-red-100 text-red-700",
      },
      [ShopStatus.INACTIVE]: {
        label: "Tạm ngưng",
        className: "bg-gray-100 text-gray-700",
      },
      [ShopStatus.BANNED]: {
        label: "Bị cấm",
        className: "bg-red-200 text-red-800",
      },
    };
    const config = statusConfig[status];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <Card className="pt-0 overflow-hidden">
      <div className="relative h-36 overflow-hidden">
        <Image
          src={shop.coverUrl || "/placeholder.svg"}
          alt="Shop Cover"
          width={500}
          height={300}
          className="w-full h-auto object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-4 right-4">
          {getStatusBadge(shop.status)}
        </div>
      </div>
      <CardContent>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Avatar className="size-10">
              <AvatarImage
                src={shop.logoUrl || "/placeholder.svg"}
                alt={shop.name}
              />
              <AvatarFallback className="bg-rose-100 text-rose-600">
                {shop.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
              <div>
                <h3 className="font-semibold text-lg">{shop.name}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  {shop.isVerified && (
                    <div className="flex items-center space-x-1">
                      <ShieldCheckIcon className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm text-gray-600">
                        {shop.reputation}
                      </span>
                    </div>
                  )}
                  {getVerificationBadge(shop.isVerified)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="size-4 text-rose-500" />
                <span className="text-sm text-gray-600">{shop.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="size-4 text-rose-500" />
                <span className="text-sm text-gray-600">{shop.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-rose-500" />
                <span className="text-sm text-gray-600">{shop.address}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 w-max gap-2">
            <Button
              variant="outline"
              className="flex items-center justify-start gap-2"
              onClick={() => {
                router.push(`/staff/shops/${shop.id}`);
              }}
            >
              <Eye className="size-4" />
              Xem chi tiết
            </Button>
            {shop.status === ShopStatus.PENDING && (
              <Button
                className="flex items-center justify-start gap-2"
                variant="outline"
              >
                <Check className="size-4" />
                Phê duyệt
              </Button>
            )}
            {shop.status === ShopStatus.SUSPENDED ? (
              <Button
                className="flex items-center justify-start gap-2"
                variant="outline"
              >
                <LockOpen className="size-4" />
                Mở khoá
              </Button>
            ) : (
              shop.status !== ShopStatus.PENDING && (
                <Button
                  className="flex items-center justify-start gap-2"
                  variant="outline"
                >
                  <Lock className="size-4" />
                  Tạm khoá
                </Button>
              )
            )}
            {shop.status !== ShopStatus.BANNED && (
              <Button
                className="flex items-center justify-start gap-2 border-rose-500 bg-rose-500/10 text-rose-500"
                variant="outline"
              >
                <Ban className="size-4 text-rose-500" />
                Tạm khoá
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
