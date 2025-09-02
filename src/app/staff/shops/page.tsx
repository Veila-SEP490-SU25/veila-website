"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
} from "lucide-react";
import {
  type IShop,
  ShopStatus,
} from "@/services/types";
import { useLazyGetShopsQuery } from "@/services/apis";
import { toast } from "sonner";
import { usePaging } from "@/providers/paging.provider";
import { isSuccess } from "@/lib/utils";
import { PagingComponent } from "@/components/paging-component";
import { ErrorCard } from "@/components/error-card";
import { LoadingItem } from "@/components/loading-item";
import { ShopList } from "@/components/staff/shops/shop-list";

export default function ShopsManagement() {
  const [statusFilter, setStatusFilter] = useState<ShopStatus | null>(null);
  const [shops, setShops] = useState<IShop[]>([]);
  const [getShops, { isLoading }] = useLazyGetShopsQuery();
  const { pageIndex, pageSize, totalItems, setPaging, resetPaging } =
    usePaging();
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const getFilterText = (status: ShopStatus | null) => {
    switch (status) {
      case ShopStatus.ACTIVE:
        return "status:eq:ACTIVE";
      case ShopStatus.PENDING:
        return "status:eq:PENDING";
      case ShopStatus.SUSPENDED:
        return "status:eq:SUSPENDED";
      case ShopStatus.INACTIVE:
        return "status:eq:INACTIVE";
      case ShopStatus.BANNED:
        return "status:eq:BANNED";
      default:
        return "";
    }
  };

  const fetchShops = useCallback(async () => {
    const filter = getFilterText(statusFilter);
    try {
      const { statusCode, items, message, ...pagination } = await getShops({
        filter,
        page: pageIndex,
        size: pageSize,
        sort: "updatedAt:desc",
      }).unwrap();
      if (isSuccess(statusCode)) {
        setShops(items);
        setPaging(
          pagination.pageIndex,
          pagination.pageSize,
          pagination.totalItems,
          pagination.totalPages,
          pagination.hasNextPage,
          pagination.hasPrevPage
        );
      } else {
        setIsError(true);
        setError(message);
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi trong quá trình lấy dữ liệu cửa hàng.");
      setIsError(true);
      setError("Đã xảy ra lỗi trong quá trình lấy dữ liệu cửa hàng.");
    }
  }, [statusFilter, pageIndex, pageSize, setPaging, setShops]);

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value === "all" ? null : (value as ShopStatus));
  };

  useEffect(() => {
    fetchShops();
  }, [statusFilter, pageIndex, pageSize]);

  useEffect(() => {
    resetPaging();
  }, []);

  return (
    <div className="p-4 space-y-6 max-w-full">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-gray-900">Quản Lý Cửa Hàng</h1>
        <p className="text-gray-600 mt-1 text-sm">
          Quản lý và theo dõi tất cả cửa hàng trong hệ thống
        </p>
      </div>

      {/* Filters - mobile first: stack vertically, full width */}
      <div className="flex flex-col gap-3 md:flex-row md:gap-4 md:justify-end">
        <Select
          value={statusFilter || "all"}
          onValueChange={handleStatusFilterChange}
        >
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value={ShopStatus.ACTIVE}>Hoạt động</SelectItem>
            <SelectItem value={ShopStatus.PENDING}>Chờ duyệt</SelectItem>
            <SelectItem value={ShopStatus.SUSPENDED}>Tạm khóa</SelectItem>
            <SelectItem value={ShopStatus.INACTIVE}>Tạm ngưng</SelectItem>
            <SelectItem value={ShopStatus.BANNED}>Bị cấm</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Shops List - mobile first: stack, padding, responsive */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-base md:text-lg">
            Danh Sách Cửa Hàng ({totalItems} kết quả)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              <LoadingItem />
            </div>
          ) : isError ? (
            <ErrorCard message={error} />
          ) : (
            <ShopList shops={shops} onUpdate={fetchShops} />
          )}

          <PagingComponent />
        </CardContent>
      </Card>
    </div>
  );
}
