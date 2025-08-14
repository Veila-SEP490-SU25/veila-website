"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Eye, Heart, Search, ShoppingBag, Star } from "lucide-react";
import { IDress, IPaginationResponse } from "@/services/types";
import { useLazyGetDressesQuery } from "@/services/apis";
import { useDebounce } from "@/hooks/use-debounce";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dresses, setDresses] = useState<IDress[]>([]);
  const [getDresses, { isLoading }] = useLazyGetDressesQuery();
  const [paging, setPaging] = useState<IPaginationResponse>({
    hasNextPage: false,
    hasPrevPage: false,
    pageIndex: 0,
    pageSize: 8,
    totalItems: 0,
    totalPages: 0,
  });

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
      pageIndex: 0,
    }));
  };

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const fetchDresses = async () => {
    try {
      const { statusCode, message, items, ...pagination } = await getDresses({
        filter: debouncedSearchQuery
          ? `name:like:${debouncedSearchQuery}`
          : "",
        page: paging.pageIndex,
        size: paging.pageSize,
        sort: "name:asc",
      }).unwrap();
      if (statusCode === 200) {
        setDresses(items);
        setPaging((prev) => ({
          ...prev,
          hasNextPage: pagination.hasNextPage,
          hasPrevPage: pagination.hasPrevPage,
          totalItems: pagination.totalItems,
          totalPages: pagination.totalPages,
        }));
      }
    } catch (error) {}
  };

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

  useEffect(() => {
    fetchDresses();
  }, [paging.pageIndex, paging.pageSize, debouncedSearchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Duyệt Váy Cưới
        </h1>
        <p className="text-gray-600">
          Khám phá chiếc váy cưới hoàn hảo từ bộ sưu tập được tuyển chọn của
          chúng tôi
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm váy, nhà thiết kế, phong cách..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Dress Grid */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-gray-600">
          {isLoading
            ? "Đang tải..."
            : `Hiển thị ${dresses.length} trong số ${paging.totalItems} váy cưới`}
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(12)].map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="h-64 bg-gray-200 animate-pulse" />
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
                    <div className="h-8 bg-gray-200 rounded animate-pulse w-16" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dress Grid */}
      {!isLoading && dresses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {dresses.map((dress) => {
            const availabilityBadge = getAvailabilityBadge(dress);
            const userName = dress.user
              ? dress.user.shop?.name
              : "Unknown User";

            return (
              <Card
                key={dress.id}
                className="group hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="relative">
                  <Image
                    src={dress.images || "/placeholder.svg"}
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
                    <Link href={`/dress/${dress.id}`}>
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
                        <Button
                          size="sm"
                          className="bg-rose-600 hover:bg-rose-700"
                        >
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          Xem
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && dresses.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <ShoppingBag className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không tìm thấy váy cưới nào
          </h3>
          <p className="text-gray-500 mb-4">
            Không có váy cưới nào phù hợp với tiêu chí tìm kiếm của bạn.
          </p>
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

            {/* Page numbers */}
            <div className="hidden md:flex gap-1">
              {Array.from(
                { length: Math.min(5, paging.totalPages) },
                (_, i) => {
                  const pageNum = paging.pageIndex - 2 + i;
                  if (pageNum < 0 || pageNum >= paging.totalPages) return null;

                  return (
                    <Button
                      key={pageNum}
                      variant={
                        pageNum === paging.pageIndex ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      className="w-10"
                    >
                      {pageNum + 1}
                    </Button>
                  );
                }
              )}
            </div>

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
  );
}
