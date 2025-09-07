import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IShop } from '@/services/types';
import {
  useLazyGetMyShopDressesQuery,
  useLazyGetMyShopAccessoriesQuery,
  useLazyGetMyShopBlogsQuery,
  useLazyGetOrdersQuery,
  useLazyGetShopIncomeQuery,
} from '@/services/apis';
import { DollarSign, Mail, MapPin, Package, Phone, ShoppingBag, FileText } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface ShopOverViewProps {
  shop: IShop;
}

export const ShopOverview = ({ shop }: ShopOverViewProps) => {
  const [metrics, setMetrics] = useState({
    dresses: 0,
    accessories: 0,
    blogs: 0,
    orders: 0,
    income: 0,
  });

  const [getDresses] = useLazyGetMyShopDressesQuery();
  const [getAccessories] = useLazyGetMyShopAccessoriesQuery();
  const [getBlogs] = useLazyGetMyShopBlogsQuery();
  const [getOrders] = useLazyGetOrdersQuery();
  const [getShopIncome] = useLazyGetShopIncomeQuery();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const dressesResponse = await getDresses({
          page: 0,
          size: 1000,
          filter: '',
          sort: '',
        }).unwrap();
        const dressesCount = dressesResponse.items?.length || 0;

        const accessoriesResponse = await getAccessories({
          page: 0,
          size: 1000,
          filter: '',
          sort: '',
        }).unwrap();
        const accessoriesCount = accessoriesResponse.items?.length || 0;

        const blogsResponse = await getBlogs({
          page: 0,
          size: 1000,
          filter: '',
          sort: '',
        }).unwrap();
        const blogsCount = blogsResponse.items?.length || 0;

        const ordersResponse = await getOrders({
          page: 0,
          size: 1000,
          filter: '',
          sort: '',
        }).unwrap();
        const ordersCount = ordersResponse.items?.length || 0;

        // Fetch shop income
        const incomeResponse = await getShopIncome(shop.id).unwrap();
        const incomeAmount = incomeResponse.item || 0;

        setMetrics({
          dresses: dressesCount,
          accessories: accessoriesCount,
          blogs: blogsCount,
          orders: ordersCount,
          income: incomeAmount,
        });
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };

    fetchMetrics();
  }, [getDresses, getAccessories, getBlogs, getOrders, shop.id, getShopIncome]);

  return (
    <>
      <Card className="pt-0">
        <div className="relative h-48 md:h-64 overflow-hidden rounded-t-lg">
          <Image
            src={shop.coverUrl || '/placeholder.svg'}
            alt="Shop Cover"
            width={500}
            height={300}
            className="w-full h-auto object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute top-4 right-4">
            <Badge className="bg-green-600">Đang hoạt động</Badge>
          </div>
        </div>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <Avatar className="h-24 w-24 border-4 border-white shadow-lg -mt-16 relative z-10">
                <AvatarImage src={shop.logoUrl || '/placeholder.svg'} />
                <AvatarFallback className="text-2xl">{shop.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{shop.name}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="truncate">{shop.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{shop.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="truncate">{shop.email}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doanh thu tháng</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(metrics.income)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng sản phẩm</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.dresses + metrics.accessories}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đơn hàng</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.orders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Váy cưới</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.dresses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Phụ kiện</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.accessories}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blog</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.blogs}</div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
