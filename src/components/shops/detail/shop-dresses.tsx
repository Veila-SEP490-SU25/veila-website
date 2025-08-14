"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLazyGetShopDressesQuery } from "@/services/apis";
import { IDress, IPaginationResponse } from "@/services/types";
import { Heart, Eye, Badge, Star, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Props {
  id: string;
}

export const ShopDresses = ({ id }: Props) => {
  const [getDress, { isLoading }] = useLazyGetShopDressesQuery();
  const [dresses, setDresses] = useState<IDress[]>([]);
  const [paging, setPaging] = useState<IPaginationResponse>({
    hasNextPage: false,
    hasPrevPage: false,
    pageIndex: 0,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  });

  const fetchDresses = async () => {
    try {
      const { statusCode, message, items, ...pagination } = await getDress({
        filter: "",
        id,
        page: paging.pageIndex,
        size: paging.pageSize,
        sort: "",
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
  }, [id, paging.pageIndex, paging.pageSize]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:gap-4 md:justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-gray-900">Váy Cưới</h2>
          {!isLoading && (
            <span className="text-sm text-gray-600">
              ({paging.totalItems} sản phẩm)
            </span>
          )}
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:gap-4">
          <Select
            value={paging.pageSize.toString()}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className="w-full md:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">12 / trang</SelectItem>
              <SelectItem value="24">24 / trang</SelectItem>
              <SelectItem value="48">48 / trang</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
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

      {/* Dresses Grid */}
      {!isLoading && dresses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {dresses.map((dress) => {
            const availabilityBadge = getAvailabilityBadge(dress);

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
                          {dress.category?.name}
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
            Chưa có váy cưới nào
          </h3>
          <p className="text-gray-500">
            Cửa hàng này chưa có sản phẩm nào được đăng tải.
          </p>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && paging.totalPages > 1 && (
        <div className="flex items-center justify-between">
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
  );
};
