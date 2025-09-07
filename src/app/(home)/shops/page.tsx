'use client';

import { useEffect, useState, useCallback } from 'react';
// import { useRouter } from "next/navigation";
// import { Badge } from "@/components/ui/badge";
import { Eye, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { IPaginationResponse, IShop, ShopStatus } from '@/services/types';
import { useLazyGetShopsQuery } from '@/services/apis';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Image } from '@/components/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RequireAuth } from '@/components/auth/require-auth';
// import { ShopCardSkeleton } from "@/components/ui/loading-skeleton";

export default function ShopPage() {
  // const router = useRouter();
  const [statusFilter, _setStatusFilter] = useState<ShopStatus | null>(null);
  const [paging, setPaging] = useState<IPaginationResponse>({
    hasNextPage: false,
    hasPrevPage: false,
    pageIndex: 0,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  });
  const [shops, setShops] = useState<IShop[]>([]);
  // const [stats, setStats] = useState({
  //   total: 0,
  //   active: 0,
  //   pending: 0,
  //   suspended: 0,
  //   verified: 0,
  // });

  const [getShops, { isLoading }] = useLazyGetShopsQuery();

  // const getVerificationBadge = (isVerified: boolean) => {
  //   return isVerified ? (
  //     <Badge className="bg-blue-100 text-blue-700">
  //         <ShieldCheck className="h-3 w-3 mr-1" />
  //         Đã xác minh
  //       </Badge>
  //     ) : (
  //       <Badge className="h-3 w-3 mr-1" />
  //         Chưa xác minh
  //       </Badge>
  //     );
  //   };

  // const getStatusBadge = (status: ShopStatus) => {
  //   const statusConfig = {
  //     [ShopStatus.ACTIVE]: {
  //       label: "Hoạt động",
  //       className: "bg-green-100 text-green-700",
  //     },
  //     [ShopStatus.PENDING]: {
  //       label: "Chờ duyệt",
  //       className: "bg-yellow-100 text-yellow-700",
  //     },
  //     [ShopStatus.SUSPENDED]: {
  //       label: "Tạm khóa",
  //       className: "bg-red-100 text-red-700",
  //     },
  //     [ShopStatus.INACTIVE]: {
  //       label: "Tạm ngưng",
  //       className: "bg-gray-100 text-gray-700",
  //     },
  //     [ShopStatus.BANNED]: {
  //       label: "Bị cấm",
  //       className: "bg-red-200 text-red-800",
  //     },
  //   };
  //   const config = statusConfig[status];
  //   return <Badge className={config.className}>{config.label}</Badge>;
  // };

  const getFilterText = (status: ShopStatus | null) => {
    switch (status) {
      case ShopStatus.ACTIVE:
        return 'status:eq:ACTIVE';
      case ShopStatus.PENDING:
        return 'status:eq:PENDING';
      case ShopStatus.SUSPENDED:
        return 'status:eq:SUSPENDED';
      case ShopStatus.INACTIVE:
        return 'status:eq:INACTIVE';
      case ShopStatus.BANNED:
        return 'status:eq:BANNED';
      default:
        return '';
    }
  };

  const fetchShops = useCallback(async () => {
    const filter = getFilterText(statusFilter);
    try {
      const { statusCode, items, message, ...pagination } = await getShops({
        filter,
        page: paging.pageIndex,
        size: paging.pageSize,
        sort: '',
      }).unwrap();

      if (statusCode === 200) {
        setShops(items);
        setPaging((prev) => ({ ...prev, ...pagination }));
      }
    } catch {
      toast.error('Đã xảy ra lỗi trong quá trình lấy dữ liệu cửa hàng.');
    }
  }, [statusFilter, paging.pageIndex, paging.pageSize, getShops]);

  const handlePageChange = (newPageIndex: number) => {
    setPaging((prev) => ({
      ...prev,
      pageIndex: newPageIndex,
    }));
  };

  const handlePageSizeChange = (newPageSize: string) => {
    const pageSize = Number.parseInt(newPageSize);
    setPaging((prev) => ({
      ...prev,
      pageSize,
      pageIndex: 0, // Reset to first page when changing page size
    }));
  };

  // const handleStatusFilterChange = (value: string) => {
  //   setStatusFilter(value === "all" ? null : (value as ShopStatus));
  //   setPaging((prev) => ({ ...prev, pageIndex: 0 }));
  // };

  useEffect(() => {
    fetchShops();
  }, [statusFilter, paging.pageIndex, paging.pageSize, fetchShops]);

  return (
    <RequireAuth>
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cửa Hàng Váy Cưới</h1>
          <p className="text-gray-600">Khám phá các cửa hàng váy cưới uy tín và chất lượng</p>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col gap-3 md:flex-row md:gap-4 md:justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Hiển thị {shops.length} trong số {paging.totalItems} cửa hàng
            </span>
          </div>
          <div className="flex flex-col gap-3 md:flex-row md:gap-4">
            <Select value={paging.pageSize.toString()} onValueChange={handlePageSizeChange}>
              <SelectTrigger className="w-full md:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 / trang</SelectItem>
                <SelectItem value="20">20 / trang</SelectItem>
                <SelectItem value="50">50 / trang</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="h-48 bg-gray-200 animate-pulse" />
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse -mt-8 relative z-10" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse" />
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded animate-pulse" />
                      <div className="h-3 bg-gray-200 rounded animate-pulse" />
                      <div className="h-3 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="h-8 bg-gray-200 rounded animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Shop Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shops.map((shop) => (
              <Card
                key={shop.id}
                className="group hover:shadow-lg transition-shadow overflow-hidden"
              >
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
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
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
                      <Button variant="outline" size="sm" className="bg-transparent">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && shops.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Không tìm thấy cửa hàng nào.</p>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && paging.totalPages > 1 && (
          <div className="flex items-center justify-between mt-8">
            <div className="text-sm text-gray-600">
              Trang {paging.pageIndex + 1} / {paging.totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!paging.hasPrevPage}
                onClick={() => handlePageChange(paging.pageIndex - 1)}
              >
                Trước
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!paging.hasNextPage}
                onClick={() => handlePageChange(paging.pageIndex + 1)}
              >
                Sau
              </Button>
            </div>
          </div>
        )}
      </div>
    </RequireAuth>
  );
}
