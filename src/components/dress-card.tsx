import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IDress } from "@/services/types";
import { Eye, Heart, ShoppingBag, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface DressProps {
  dress: IDress;
}

export const DressCard = ({ dress }: DressProps) => {
  const getAvailabilityBadge = (dress: IDress) => {
    if (dress.isSellable && dress.isRentable) {
      return { text: "Bán & Thuê", className: "bg-purple-600" };
    } else if (dress.isSellable) {
      return { text: "Bán", className: "bg-green-600" };
    } else if (dress.isRentable) {
      return { text: "Cho Thuê", className: "bg-blue-600" };
    }
    return { text: "Không có sẵn", className: "bg-gray-600" };
  };

  const availabilityBadge = getAvailabilityBadge(dress);
  const userName = dress.user ? dress.user.shop?.name : "Unknown User";
  const coverImage = dress.images?.split(",")[0] || "/placeholder.svg";

  return (
    <Card className="group hover:shadow-lg transition-shadow overflow-hidden">
      <div className="relative">
        <Image
          src={coverImage}
          alt={dress.name}
          width={300}
          height={400}
          className="w-full h-64 object-cover"
        />
        <div className="absolute top-4 right-4 space-y-2">
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
          >
            <Heart className="h-4 w-4" />
          </Button>
          <Link href={`/dress/${dress.id}`}>
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="absolute top-4 left-4">
          <Badge
            className={`${availabilityBadge.className} text-white hover:${availabilityBadge.className}`}
          >
            {availabilityBadge.text}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <Link href={`/dress/${dress.id}`} className="cursor-pointer">
            <h3 className="font-semibold text-lg group-hover:text-rose-600 transition-colors cursor-pointer line-clamp-2">
              {dress.name}
            </h3>
          </Link>

          {/* Designer Info */}
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage
                src={dress.user?.shop?.logoUrl || "/placeholder.svg"}
              />
              <AvatarFallback className="text-xs">
                {(userName || "Shop").charAt(0)}
              </AvatarFallback>
            </Avatar>
            <p className="text-sm text-gray-600">by {userName}</p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium ml-1">
                {dress.ratingAverage}
              </span>
            </div>
            <span className="text-gray-400">•</span>
            <span className="text-sm text-gray-600">
              {dress.ratingCount} đánh giá
            </span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="space-y-1">
              {dress.isSellable && (
                <p className="text-lg font-bold text-gray-900">
                  {dress.sellPrice.toLocaleString("vi-VN")}₫
                </p>
              )}
              {dress.isRentable && (
                <p className="text-sm text-gray-600">
                  Thuê: {dress.rentalPrice.toLocaleString("vi-VN")}₫
                </p>
              )}
              <p className="text-xs text-gray-600">
                {dress.category?.name || "Chưa phân loại"}
              </p>
            </div>
            <Link href={`/dress/${dress.id}`}>
              <Button size="sm" className="bg-rose-600 hover:bg-rose-700">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Xem
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
