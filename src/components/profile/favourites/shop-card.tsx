import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { IShop } from '@/services/types';
import { Eye, Mail, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface ShopCardProps {
  shop: IShop;
}

export const ShopCard = ({ shop }: ShopCardProps) => {
  return (
    <Card className="group hover:shadow-lg transition-shadow overflow-hidden">
      {/* Cover Image */}
      <div className="relative h-48">
        <Image
          src={shop.coverUrl || '/placeholder.svg'}
          alt={shop.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 flex gap-2">
          <Link href={`/shops/detail/${shop.id}`}>
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Shop Info */}
          <div className="flex items-center gap-3 h-fit justify-start">
            <Avatar className="h-12 w-12 border-2 border-white -mt-8 relative z-10 flex-shrink-0">
              <AvatarImage src={shop.logoUrl || '/placeholder.svg'} />
              <AvatarFallback>{shop.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 h-full flex items-center">
              <Link href={`/shops/detail/${shop.id}`}>
                <h3 className="font-semibold text-lg group-hover:text-rose-600 transition-colors cursor-pointer truncate">
                  {shop.name}
                </h3>
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{shop.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 flex-shrink-0" />
              <span>{shop.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{shop.email}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Link href={`/shops/detail/${shop.id}`} className="flex-1">
              <Button className="w-full bg-rose-600 hover:bg-rose-700" size="sm">
                Xem cửa hàng
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
