import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  formatPrice,
  getCoverImage,
  parseNumber,
  formatRating,
} from "@/lib/products-utils";
import { IDress } from "@/services/types";
import { Eye, ShoppingBag, Star, MapPin, Clock } from "lucide-react";
import Link from "next/link";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";

interface DressProps {
  dress: IDress;
}

export const DressCard = ({ dress }: DressProps) => {
  const getAvailabilityBadge = (dress: IDress) => {
    if (dress.isSellable && dress.isRentable) {
      return {
        text: "Bán & Thuê",
        className: "bg-gradient-to-r from-purple-600 to-pink-600",
      };
    } else if (dress.isSellable) {
      return {
        text: "Bán",
        className: "bg-gradient-to-r from-green-600 to-emerald-600",
      };
    } else if (dress.isRentable) {
      return {
        text: "Cho Thuê",
        className: "bg-gradient-to-r from-blue-600 to-cyan-600",
      };
    }
    return {
      text: "Không có sẵn",
      className: "bg-gradient-to-r from-gray-600 to-gray-700",
    };
  };

  const availabilityBadge = getAvailabilityBadge(dress);
  const userName =
    dress.user?.shop?.name ||
    `${dress.user?.firstName || ""} ${dress.user?.lastName || ""}`.trim() ||
    "Unknown";
  const shopLocation = dress.user?.shop?.address || "Chưa có địa chỉ";

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden bg-white border-0 shadow-md hover:shadow-2xl">
      <div className="relative aspect-[3/4] overflow-hidden">
        <ImageWithFallback
          src={getCoverImage(dress.images)}
          alt={dress.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          placeholderText="Veila Dress"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute top-4 right-4 space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <Link href={`/dress/${dress.id}`}>
            <Button
              size="sm"
              variant="secondary"
              className="h-10 w-10 p-0 bg-white/95 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Eye className="h-5 w-5 text-gray-700" />
            </Button>
          </Link>
        </div>

        {/* Availability Badge */}
        <div className="absolute top-4 left-4">
          <Badge
            className={`${availabilityBadge.className} text-white font-semibold px-3 py-1 shadow-lg`}
          >
            {availabilityBadge.text}
          </Badge>
        </div>

        {/* Bottom Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="text-white">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4" />
              <span className="text-sm font-medium">{shopLocation}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Cập nhật gần đây</span>
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Title */}
          <Link href={`/dress/${dress.id}`} className="cursor-pointer">
            <h3 className="font-bold text-xl group-hover:text-rose-600 transition-colors cursor-pointer line-clamp-2 leading-tight">
              {dress.name}
            </h3>
          </Link>

          {/* Designer Info */}
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 ring-2 ring-rose-100">
              <AvatarImage
                src={
                  dress.user?.shop?.logoUrl ||
                  dress.user?.avatarUrl ||
                  "/placeholder.svg"
                }
              />
              <AvatarFallback className="text-sm font-semibold bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700">
                {userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold text-gray-900">{userName}</p>
              <p className="text-xs text-gray-500">
                {dress.user?.shop?.description || "Nhà thiết kế"}
              </p>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-bold ml-1 text-gray-900">
                {formatRating(dress.ratingAverage)}
              </span>
            </div>
            <span className="text-gray-400">•</span>
            <span className="text-sm text-gray-600">
              {dress.ratingCount || 0} đánh giá
            </span>
          </div>

          {/* Dress Details */}
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
            {dress.material && (
              <div className="flex items-center gap-1">
                <span className="font-medium">Chất liệu:</span>
                <span>{dress.material}</span>
              </div>
            )}
            {dress.color && (
              <div className="flex items-center gap-1">
                <span className="font-medium">Màu sắc:</span>
                <span>{dress.color}</span>
              </div>
            )}
            {dress.length && (
              <div className="flex items-center gap-1">
                <span className="font-medium">Độ dài:</span>
                <span>{dress.length}</span>
              </div>
            )}
            {dress.neckline && (
              <div className="flex items-center gap-1">
                <span className="font-medium">Cổ áo:</span>
                <span>{dress.neckline}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="space-y-1">
              {dress.isSellable && (
                <p className="text-xl font-bold text-gray-900">
                  {formatPrice(parseNumber(dress.sellPrice))}
                </p>
              )}
              {dress.isRentable && dress.isSellable && (
                <p className="text-sm text-gray-600">
                  Thuê: {formatPrice(parseNumber(dress.rentalPrice))}
                </p>
              )}
              {dress.isRentable && !dress.isSellable && (
                <p className="text-lg font-bold text-gray-900">
                  Thuê: {formatPrice(parseNumber(dress.rentalPrice))}
                </p>
              )}
            </div>
            <Link href={`/dress/${dress.id}`}>
              <Button
                size="sm"
                className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-semibold px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Xem chi tiết
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
