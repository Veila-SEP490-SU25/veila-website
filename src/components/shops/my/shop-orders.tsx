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
import { useLazyGetOrdersQuery } from "@/services/apis";
import {
  IOrder,
  IPaginationResponse,
  OrderStatus,
  OrderType,
} from "@/services/types";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit,
  Eye,
  Mail,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  Package,
  Phone,
  Search,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

export const MyShopOrders = () => {
  const router = useRouter();
  const [getMyShopOrders, { isLoading }] = useLazyGetOrdersQuery();
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
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const debouncedSearchTerm = useDebounce<string>(searchTerm, 300);

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

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setTypeFilter("all");
    setDateFilter("all");
    setPaging((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const fetchOrders = useCallback(async () => {
    try {
      // Tạo filter string từ các filter
      let filterString = debouncedSearchTerm;

      if (statusFilter !== "all") {
        filterString += filterString
          ? `&status:${statusFilter}`
          : `status:${statusFilter}`;
      }

      if (typeFilter !== "all") {
        filterString += filterString
          ? `&type:${typeFilter}`
          : `type:${typeFilter}`;
      }

      if (dateFilter !== "all") {
        const today = new Date();
        const startDate = new Date();

        switch (dateFilter) {
          case "today":
            startDate.setHours(0, 0, 0, 0);
            break;
          case "week":
            startDate.setDate(today.getDate() - 7);
            break;
          case "month":
            startDate.setMonth(today.getMonth() - 1);
            break;
          case "custom":
            // Có thể thêm custom date range sau
            break;
        }

        if (dateFilter !== "custom") {
          filterString += filterString
            ? `&createdAt:${startDate.toISOString()}`
            : `createdAt:${startDate.toISOString()}`;
        }
      }

      const response = await getMyShopOrders({
        page: paging.pageIndex,
        size: paging.pageSize,
        filter: filterString,
        sort: "createdAt:desc", // Sắp xếp theo thời gian tạo mới nhất
      }).unwrap();

      if (response.statusCode === 200) {
        setOrders(response.items || []);
        setPaging({
          pageIndex: paging.pageIndex,
          pageSize: paging.pageSize,
          totalItems: response.totalItems || 0,
          totalPages: response.totalPages || 0,
          hasNextPage: response.hasNextPage || false,
          hasPrevPage: response.hasPrevPage || false,
        });
      } else {
        toast.error("Không thể tải danh sách đơn hàng", {
          description: response.message,
        });
      }
    } catch {
      toast.error("Đã xảy ra lỗi khi tải danh sách đơn hàng");
    }
  }, [
    getMyShopOrders,
    paging.pageIndex,
    paging.pageSize,
    debouncedSearchTerm,
    setPaging,
  ]);

  useEffect(() => {
    fetchOrders();
  }, [
    debouncedSearchTerm,
    statusFilter,
    typeFilter,
    dateFilter,
    paging.pageSize,
    paging.pageIndex,
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

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return <Badge className="bg-yellow-600">Chờ xử lý</Badge>;
      case "IN_PROCESS":
        return <Badge className="bg-blue-600">Đang xử lý</Badge>;
      case "COMPLETED":
        return <Badge className="bg-green-600">Hoàn thành</Badge>;
      case "CANCELLED":
        return <Badge className="bg-red-600">Đã hủy</Badge>;
      default:
        return <Badge variant="secondary">Không xác định</Badge>;
    }
  };

  const getTypeBadge = (type: OrderType) => {
    switch (type) {
      case "SELL":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            Bán
          </Badge>
        );
      case "RENT":
        return (
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            Thuê
          </Badge>
        );
      case "CUSTOM":
        return (
          <Badge
            variant="outline"
            className="text-purple-600 border-purple-600"
          >
            Đặt may
          </Badge>
        );
      default:
        return <Badge variant="outline">Khác</Badge>;
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "IN_PROCESS":
        return <AlertCircle className="h-4 w-4 text-blue-600" />;
      case "COMPLETED":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "CANCELLED":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  if (isLoading && orders.length === 0) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-5 bg-gray-200 rounded w-1/2"></div>
        </div>

        {/* Search and Filters Skeleton */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-10 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Skeleton */}
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Order Header Skeleton */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-6 bg-gray-200 rounded w-32"></div>
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                    </div>
                    <div className="text-right">
                      <div className="h-8 bg-gray-200 rounded w-24 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>

                  {/* Customer Info Skeleton */}
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-3 bg-gray-200 rounded w-32"></div>
                    </div>
                  </div>

                  {/* Order Details Skeleton */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="flex items-center gap-2">
                        <div className="h-4 w-4 bg-gray-200 rounded"></div>
                        <div className="space-y-1">
                          <div className="h-3 bg-gray-200 rounded w-20"></div>
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Tìm kiếm theo email, tên khách hàng..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                  />
                  {isLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-rose-600"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Trạng thái
                </label>
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tất cả trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="PENDING">Chờ xử lý</SelectItem>
                    <SelectItem value="IN_PROCESS">Đang xử lý</SelectItem>
                    <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
                    <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Type Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Loại đơn hàng
                </label>
                <Select
                  value={typeFilter}
                  onValueChange={setTypeFilter}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tất cả loại" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả loại</SelectItem>
                    <SelectItem value="SELL">Bán</SelectItem>
                    <SelectItem value="RENT">Thuê</SelectItem>
                    <SelectItem value="CUSTOM">Đặt may</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Thời gian
                </label>
                <Select
                  value={dateFilter}
                  onValueChange={setDateFilter}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tất cả thời gian" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả thời gian</SelectItem>
                    <SelectItem value="today">Hôm nay</SelectItem>
                    <SelectItem value="week">7 ngày qua</SelectItem>
                    <SelectItem value="month">30 ngày qua</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Reset Button */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  &nbsp;
                </label>
                <Button
                  variant="outline"
                  onClick={resetFilters}
                  disabled={isLoading}
                  className="w-full"
                >
                  Đặt lại
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Filters Info */}
      {(statusFilter !== "all" ||
        typeFilter !== "all" ||
        dateFilter !== "all" ||
        searchTerm) && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <span className="font-medium">Bộ lọc đang áp dụng:</span>
                {statusFilter !== "all" && (
                  <Badge
                    variant="outline"
                    className="text-blue-700 border-blue-300"
                  >
                    Trạng thái: {getStatusBadge(statusFilter as OrderStatus)}
                  </Badge>
                )}
                {typeFilter !== "all" && (
                  <Badge
                    variant="outline"
                    className="text-blue-700 border-blue-300"
                  >
                    Loại: {getTypeBadge(typeFilter as OrderType)}
                  </Badge>
                )}
                {dateFilter !== "all" && (
                  <Badge
                    variant="outline"
                    className="text-blue-700 border-blue-300"
                  >
                    Thời gian:{" "}
                    {dateFilter === "today"
                      ? "Hôm nay"
                      : dateFilter === "week"
                      ? "7 ngày qua"
                      : "30 ngày qua"}
                  </Badge>
                )}
                {searchTerm && (
                  <Badge
                    variant="outline"
                    className="text-blue-700 border-blue-300"
                  >
                    Tìm kiếm: "{searchTerm}"
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="text-blue-700 hover:text-blue-800"
              >
                Xóa tất cả
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Orders List */}
      <div className="space-y-4">
        {orders.length === 0 && !isLoading ? (
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
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-4">
                      {/* Order Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(order.status)}
                            <h3 className="font-semibold text-lg">
                              Đơn hàng #{order.id.slice(-8)}
                            </h3>
                          </div>
                          {getStatusBadge(order.status)}
                          {getTypeBadge(order.type)}
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
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-gray-600">Ngày giao hàng</p>
                            <p className="font-medium">
                              {formatDate(order.dueDate)}
                            </p>
                          </div>
                        </div>
                        {order.returnDate && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-gray-600">Ngày trả</p>
                              <p className="font-medium">
                                {formatDate(order.returnDate)}
                              </p>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-gray-600">Địa chỉ giao hàng</p>
                            <p className="font-medium truncate">
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
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isLoading}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem disabled={isLoading}>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Nhắn tin khách hàng
                          </DropdownMenuItem>
                          <DropdownMenuItem disabled={isLoading}>
                            <Edit className="h-4 w-4 mr-2" />
                            Cập nhật trạng thái
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/shops/my/orders/${order.id}`)
                            }
                            disabled={isLoading}
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
                  disabled={isLoading}
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
                    disabled={!paging.hasPrevPage || isLoading}
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
                    disabled={!paging.hasNextPage || isLoading}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  {isLoading && (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-rose-600"></div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
