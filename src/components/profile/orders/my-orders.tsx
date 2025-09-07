"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";
import {
  getStatusColor,
  getStatusText,
  getTypeColor,
  getTypeText,
} from "@/lib/order-util";
import { useLazyGetOrdersQuery } from "@/services/apis";
import {
  IOrder,
  IPaginationResponse,
} from "@/services/types";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Mail,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  Package,
  Phone,
  Search,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export const MyOrders = () => {
  const router = useRouter();
  const [getMyOrders, { isLoading }] = useLazyGetOrdersQuery();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [paging, setPaging] = useState<IPaginationResponse>({
    hasNextPage: false,
    hasPrevPage: false,
    pageIndex: 0,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<
    "all" | "today" | "week" | "month" | "custom"
  >("all");
  const [customDateRange, setCustomDateRange] = useState<{
    from: Date | null;
    to: Date | null;
  }>({
    from: null,
    to: null,
  });

  const buildFilterString = useCallback(() => {
    const filters: string[] = [];

    if (debouncedSearchTerm) {
      filters.push(`email:like:${debouncedSearchTerm}`);
    }

    // Status filter
    if (statusFilter !== "all") {
      filters.push(`status:eq:${statusFilter}`);
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      let fromDate: Date | null = null;
      let toDate: Date | null = null;

      switch (dateFilter) {
        case "today":
          fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          toDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + 1
          );
          break;
        case "week":
          fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          toDate = now;
          break;
        case "month":
          fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
          toDate = now;
          break;
        case "custom":
          if (customDateRange.from && customDateRange.to) {
            fromDate = customDateRange.from;
            toDate = customDateRange.to;
          }
          break;
      }

      if (fromDate && toDate) {
        filters.push(`createdAt:gte:${fromDate.toISOString()}`);
        filters.push(`createdAt:lte:${toDate.toISOString()}`);
      }
    }

    return filters.join(",");
  }, [debouncedSearchTerm, statusFilter, dateFilter, customDateRange]);

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

  const fetchOrders = useCallback(async () => {
    try {
      const { statusCode, message, items, ...pagination } = await getMyOrders({
        page: paging.pageIndex,
        size: paging.pageSize,
        filter: buildFilterString(),
        sort: "createdAt:desc", // Sort by creation date, newest first
      }).unwrap();

      if (statusCode === 200) {
        setOrders(items);
        setPaging((prev) => ({
          ...prev,
          hasNextPage: pagination.hasNextPage,
          hasPrevPage: pagination.hasPrevPage,
          totalItems: pagination.totalItems,
          totalPages: pagination.totalPages,
        }));
      } else {
        toast.error("Không thể tải danh sách đơn hàng", {
          description: message,
        });
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Đã xảy ra lỗi khi tải danh sách đơn hàng");
    }
  }, [getMyOrders, paging.pageIndex, paging.pageSize, buildFilterString]);

  useEffect(() => {
    fetchOrders();
  }, [
    paging.pageIndex,
    paging.pageSize,
    debouncedSearchTerm,
    statusFilter,
    fetchOrders,
  ]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading && orders.length === 0) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Quản lý đơn hàng
          </h1>
          <p className="text-muted-foreground">
            Theo dõi và quản lý tất cả đơn hàng của cửa hàng
          </p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm theo email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Select
                value={statusFilter}
                onValueChange={(value: string) => {
                  setStatusFilter(value);
                  setPaging((prev) => ({ ...prev, pageIndex: 0 }));
                }}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="PENDING">Chờ xử lý</SelectItem>
                  <SelectItem value="IN_PROCESS">Đang xử lý</SelectItem>
                  <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
                  <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={dateFilter}
                onValueChange={(
                  value: "all" | "today" | "week" | "month" | "custom"
                ) => {
                  setDateFilter(value);
                  setPaging((prev) => ({ ...prev, pageIndex: 0 })); // Reset to first page
                }}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả thời gian</SelectItem>
                  <SelectItem value="today">Hôm nay</SelectItem>
                  <SelectItem value="week">7 ngày qua</SelectItem>
                  <SelectItem value="month">Tháng này</SelectItem>
                  <SelectItem value="custom">Tùy chọn</SelectItem>
                </SelectContent>
              </Select>

              {dateFilter === "custom" && (
                <div className="flex items-center gap-2">
                  <Input
                    type="date"
                    value={
                      customDateRange.from
                        ? customDateRange.from.toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) => {
                      const date = e.target.value
                        ? new Date(e.target.value)
                        : null;
                      setCustomDateRange((prev) => ({
                        ...prev,
                        from: date,
                      }));
                      setPaging((prev) => ({ ...prev, pageIndex: 0 }));
                    }}
                    className="w-[140px]"
                    placeholder="Từ ngày"
                  />
                  <Input
                    type="date"
                    value={
                      customDateRange.to
                        ? customDateRange.to.toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) => {
                      const date = e.target.value
                        ? new Date(e.target.value)
                        : null;
                      setCustomDateRange((prev) => ({
                        ...prev,
                        to: date,
                      }));
                      setPaging((prev) => ({ ...prev, pageIndex: 0 }));
                    }}
                    className="w-[140px]"
                    placeholder="Đến ngày"
                    min={
                      customDateRange.from
                        ? customDateRange.from.toISOString().split("T")[0]
                        : undefined
                    }
                  />
                </div>
              )}

              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setDateFilter("all");
                  setCustomDateRange({ from: null, to: null });
                  setPaging((prev) => ({ ...prev, pageIndex: 0 }));
                }}
                className="whitespace-nowrap"
              >
                Xóa bộ lọc
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Không có đơn hàng nào
              </h3>
              <p className="text-gray-600">Chưa có đơn hàng nào được tạo</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card
                key={order.id}
                className="hover:shadow-md transition-shadow relative"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-4">
                      {/* Order Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Badge
                              className={getTypeColor(order.type)}
                              variant="outline"
                            >
                              {getTypeText(order.type)}
                            </Badge>
                            <Badge
                              className={getStatusColor(order.status)}
                              variant="outline"
                            >
                              {getStatusText(order.status)}
                            </Badge>
                            <h3 className="font-semibold text-lg">
                              Đơn hàng #{order.id.slice(-8)}
                            </h3>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-rose-600">
                            {formatPrice(order.amount)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={
                                order.customer.avatarUrl || "/placeholder.svg"
                              }
                            />
                            <AvatarFallback>
                              {order.customer.firstName?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {order.customer.firstName}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                <span>{order.phone}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                <span>{order.email}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Order Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-gray-600">Ngày giao hàng</p>
                            <p className="font-medium">
                              {formatDate(order.dueDate)}
                            </p>
                          </div>
                        </div>
                        {order.returnDate && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-gray-600">Ngày trả</p>
                              <p className="font-medium">
                                {formatDate(order.returnDate)}
                              </p>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-2 w-full">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <div className="w-full">
                            <p className="text-gray-600">Địa chỉ giao hàng</p>
                            <p className="font-medium truncate max-w-full">
                              {order.address}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              // Tạo chat với khách hàng
                              router.push(
                                `/chat?userId=${order.customer.id}&userName=${order.customer.firstName}`
                              );
                            }}
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Nhắn tin khách hàng
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/profile/orders/${order.id}`)
                            }
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Xem chi tiết
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {paging.totalPages > 1 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Hiển thị {paging.pageIndex * paging.pageSize + 1} -{" "}
                  {Math.min(
                    (paging.pageIndex + 1) * paging.pageSize,
                    paging.totalItems
                  )}{" "}
                  của {paging.totalItems} đơn hàng
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={paging.pageSize.toString()}
                  onValueChange={handlePageSizeChange}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(paging.pageIndex - 1)}
                    disabled={!paging.hasPrevPage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm px-3 py-1">
                    {paging.pageIndex + 1} / {paging.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(paging.pageIndex + 1)}
                    disabled={!paging.hasNextPage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
