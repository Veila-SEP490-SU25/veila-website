"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Eye,
  ShieldCheck,
  Shield,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import {
  type IPaginationResponse,
  type IShop,
  ShopStatus,
} from "@/services/types";
import { useLazyStaffGetShopsQuery } from "@/services/apis";
import { toast } from "sonner";
import { ShopDetailDialog } from "@/components/staff/shop/shop-detail-dialog";

export default function ShopsManagement() {
  const [statusFilter, setStatusFilter] = useState<ShopStatus | null>(null);
  const [paging, setPaging] = useState<IPaginationResponse>({
    hasNextPage: false,
    hasPrevPage: false,
    pageIndex: 0,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  });
  const [shops, setShops] = useState<IShop[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    suspended: 0,
    verified: 0,
  });

  const [getShops, { isLoading }] = useLazyStaffGetShopsQuery();

  const getVerificationBadge = (isVerified: boolean) => {
    return isVerified ? (
      <Badge className="bg-blue-100 text-blue-700">
        <ShieldCheck className="h-3 w-3 mr-1" />
        Đã xác minh
      </Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-700">
        <Shield className="h-3 w-3 mr-1" />
        Chưa xác minh
      </Badge>
    );
  };

  const getStatusBadge = (status: ShopStatus) => {
    const statusConfig = {
      [ShopStatus.ACTIVE]: {
        label: "Hoạt động",
        className: "bg-green-100 text-green-700",
      },
      [ShopStatus.PENDING]: {
        label: "Chờ duyệt",
        className: "bg-yellow-100 text-yellow-700",
      },
      [ShopStatus.SUSPENDED]: {
        label: "Tạm khóa",
        className: "bg-red-100 text-red-700",
      },
      [ShopStatus.INACTIVE]: {
        label: "Tạm ngưng",
        className: "bg-gray-100 text-gray-700",
      },
      [ShopStatus.BANNED]: {
        label: "Bị cấm",
        className: "bg-red-200 text-red-800",
      },
    };
    const config = statusConfig[status];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

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

  const fetchShops = async () => {
    const filter = getFilterText(statusFilter);
    try {
      const { statusCode, items, message, ...pagination } = await getShops({
        filter,
        page: paging.pageIndex,
        size: paging.pageSize,
        sort: "",
      }).unwrap();

      if (statusCode === 200) {
        setShops(items);
        setPaging((prev) => ({ ...prev, ...pagination }));
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi trong quá trình lấy dữ liệu cửa hàng.");
    }
  };

  const fetchStats = async () => {
    try {
      // Fetch all shops to calculate stats
      const { statusCode, items } = await getShops({
        filter: "",
        page: 0,
        size: 1000, // Large number to get all shops for stats
        sort: "",
      }).unwrap();

      if (statusCode === 200) {
        const total = items.length;
        const active = items.filter(
          (s) => s.status === ShopStatus.ACTIVE
        ).length;
        const pending = items.filter(
          (s) => s.status === ShopStatus.PENDING
        ).length;
        const suspended = items.filter(
          (s) => s.status === ShopStatus.SUSPENDED
        ).length;
        const verified = items.filter((s) => s.isVerified).length;

        setStats({ total, active, pending, suspended, verified });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
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
      pageIndex: 0, // Reset to first page when changing page size
    }));
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value === "all" ? null : (value as ShopStatus));
    setPaging((prev) => ({ ...prev, pageIndex: 0 }));
  };

  useEffect(() => {
    fetchShops();
  }, [statusFilter, paging.pageIndex, paging.pageSize]);

  useEffect(() => {
    fetchStats();
  }, []);

  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);

  return (
    <div className="p-4 space-y-6 max-w-full">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-gray-900">Quản Lý Cửa Hàng</h1>
        <p className="text-gray-600 mt-1 text-sm">
          Quản lý và theo dõi tất cả cửa hàng trong hệ thống
        </p>
      </div>

      {/* Stats - mobile first: stack vertically */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-5 md:gap-6">
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-xs text-gray-600">Tổng Cửa Hàng</p>
              <p className="text-xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-xs text-gray-600">Đang Hoạt Động</p>
              <p className="text-xl font-bold text-green-600">{stats.active}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-xs text-gray-600">Chờ Duyệt</p>
              <p className="text-xl font-bold text-yellow-600">
                {stats.pending}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-xs text-gray-600">Tạm Khóa</p>
              <p className="text-xl font-bold text-red-600">
                {stats.suspended}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-xs text-gray-600">Đã Xác Minh</p>
              <p className="text-xl font-bold text-blue-600">
                {stats.verified}
              </p>
            </div>
          </CardContent>
        </Card>
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
        <Select
          value={paging.pageSize.toString()}
          onValueChange={handlePageSizeChange}
        >
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

      {/* Shops List - mobile first: stack, padding, responsive */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-base md:text-lg">
            Danh Sách Cửa Hàng ({paging.totalItems} kết quả)
            {paging.totalItems > 0 && (
              <span className="text-xs md:text-sm font-normal text-gray-500 ml-2">
                (hiển thị {paging.pageIndex * paging.pageSize + 1}-
                {Math.min(
                  (paging.pageIndex + 1) * paging.pageSize,
                  paging.totalItems
                )}{" "}
                của {paging.totalItems})
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              <span className="mt-2 text-gray-600">Đang tải dữ liệu...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {shops.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    Không tìm thấy cửa hàng nào phù hợp với bộ lọc.
                  </p>
                </div>
              ) : (
                shops.map((shop) => (
                  <div
                    key={shop.id}
                    className="border rounded-lg p-3 md:p-4 hover:shadow-md transition-shadow bg-white"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-2 md:mb-3">
                      <div className="flex items-center gap-3 md:gap-4">
                        <Avatar className="h-10 w-10 md:h-12 md:w-12">
                          <AvatarImage
                            src={
                              shop.logoUrl ||
                              `/placeholder.svg?height=48&width=48&text=${
                                shop.name.charAt(0) || "S"
                              }`
                            }
                          />
                          <AvatarFallback className="bg-rose-100 text-rose-600">
                            {shop.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-base md:text-lg">
                            {shop.name}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            {getVerificationBadge(shop.isVerified)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-2 md:mt-0">
                        {getStatusBadge(shop.status)}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedShopId(shop.id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Xem chi tiết
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Pagination - mobile first: stack, smaller buttons */}
          {paging.totalItems > 0 && !isLoading && (
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mt-6 pt-4 border-t">
              <div className="text-xs md:text-sm text-gray-600">
                Hiển thị {paging.pageIndex * paging.pageSize + 1}-
                {Math.min(
                  (paging.pageIndex + 1) * paging.pageSize,
                  paging.totalItems
                )}{" "}
                của {paging.totalItems} kết quả
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(paging.pageIndex - 1)}
                  disabled={!paging.hasPrevPage || isLoading}
                  className="min-w-[60px]"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Trước
                </Button>
                {/* Page numbers */}
                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: Math.min(5, paging.totalPages) },
                    (_, i) => {
                      let pageNum: number;
                      if (paging.totalPages <= 5) {
                        pageNum = i;
                      } else if (paging.pageIndex < 3) {
                        pageNum = i;
                      } else if (paging.pageIndex >= paging.totalPages - 3) {
                        pageNum = paging.totalPages - 5 + i;
                      } else {
                        pageNum = paging.pageIndex - 2 + i;
                      }
                      return (
                        <Button
                          key={pageNum}
                          variant={
                            pageNum === paging.pageIndex ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                          disabled={isLoading}
                          className="w-8 h-8 p-0"
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
                  onClick={() => handlePageChange(paging.pageIndex + 1)}
                  disabled={!paging.hasNextPage || isLoading}
                  className="min-w-[60px]"
                >
                  Sau
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedShopId && (
        <ShopDetailDialog
          shopId={selectedShopId}
          open={!!selectedShopId}
          setOpen={(open) => {
            if (!open) setSelectedShopId(null);
          }}
          onChange={fetchShops}
        />
      )}
    </div>
  );
}
