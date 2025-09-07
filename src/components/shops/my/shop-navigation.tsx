'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Calendar, FileText, Home, Package, Settings, ShoppingBag, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'Tổng quan', href: '/shops/my', icon: Home },
  { name: 'Thông tin cửa hàng', href: '/shops/my/information', icon: Settings },
  { name: 'Váy cưới', href: '/shops/my/dresses', icon: ShoppingBag },
  { name: 'Phụ kiện', href: '/shops/my/accessories', icon: Package },
  { name: 'Đơn hàng', href: '/shops/my/orders', icon: Calendar },
  { name: 'Blog', href: '/shops/my/blogs', icon: FileText },
  { name: 'Khách hàng', href: '/shops/my/customers', icon: Users },
];

export const ShopNavigation = () => {
  const pathname = usePathname();

  return (
    <nav className="flex space-x-2 overflow-x-auto pb-2">
      {navigation.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link key={item.name} href={item.href}>
            <Button
              variant={isActive ? 'default' : 'outline'}
              size="sm"
              className={cn('whitespace-nowrap', isActive && 'bg-rose-600 hover:bg-rose-700')}
            >
              <item.icon className="h-4 w-4 mr-2" />
              {item.name}
            </Button>
          </Link>
        );
      })}
    </nav>
  );
};
