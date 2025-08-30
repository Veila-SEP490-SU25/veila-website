"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, ShoppingBag } from "lucide-react";
import { IDress } from "@/services/types";
import { useLazyGetDressesQuery } from "@/services/apis";
import { useDebounce } from "@/hooks/use-debounce";
import { Card, CardContent } from "@/components/ui/card";
import { usePaging } from "@/providers/paging.provider";
import { PagingComponent } from "@/components/paging-component";
import { DressCard } from "@/components/dress-card";

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dresses, setDresses] = useState<IDress[]>([]);
  const [getDresses, { isLoading }] = useLazyGetDressesQuery();
  const { pageIndex, pageSize, totalItems, setPaging , resetPaging} = usePaging();

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const fetchDresses = async () => {
    try {
      const { statusCode, message, items, ...pagination } = await getDresses({
        filter: debouncedSearchQuery ? `name:like:${debouncedSearchQuery}` : "",
        page: pageIndex,
        size: pageSize,
        sort: "name:asc",
      }).unwrap();
      if (statusCode === 200) {
        setDresses(items);
        setPaging(
          pagination.pageIndex,
          pagination.pageSize,
          pagination.totalItems,
          pagination.totalPages,
          pagination.hasNextPage,
          pagination.hasPrevPage
        );
      }
    } catch (error) {}
  };

  useEffect(() => {
    resetPaging();
  }, [debouncedSearchQuery]);

  useEffect(() => {
    fetchDresses();
  }, [pageIndex, pageSize, debouncedSearchQuery]);

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
            : `Hiển thị ${dresses.length} trong số ${totalItems} váy cưới`}
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
          {dresses.map((dress) => (
            <DressCard key={dress.id} dress={dress} />
          ))}
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
      {!isLoading && <PagingComponent />}
    </div>
  );
}
