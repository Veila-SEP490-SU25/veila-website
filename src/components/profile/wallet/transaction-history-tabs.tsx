"use client";
import { PagingComponent } from "@/components/paging-component";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDateShort } from "@/lib/order-util";
import { formatPrice } from "@/lib/products-utils";
import { usePaging } from "@/providers/paging.provider";
import { useLazyGetMyTransactionsQuery } from "@/services/apis";
import {
  ITransaction,
  TransactionStatus,
  TransactionType,
} from "@/services/types";
import {
  ArrowDownLeft,
  ArrowUpRight,
  History,
  Search,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const getTransactionTypeLabel = (type: TransactionType): string => {
  switch (type) {
    case TransactionType.DEPOSIT:
      return "Nạp tiền";
    case TransactionType.WITHDRAW:
      return "Rút tiền";
    case TransactionType.TRANSFER:
      return "Chuyển tiền";
    case TransactionType.RECEIVE:
      return "Nhận tiền";
    case TransactionType.REFUND:
      return "Hoàn tiền (Trừ)";
    default:
      return type;
  }
};

const getTransactionStatusLabel = (status: TransactionStatus): string => {
  switch (status) {
    case TransactionStatus.PENDING:
      return "Đang chờ";
    case TransactionStatus.COMPLETED:
      return "Đã hoàn thành";
    case TransactionStatus.FAILED:
      return "Thất bại";
    case TransactionStatus.CANCELLED:
      return "Đã hủy";
    case TransactionStatus.REFUNDED:
      return "Đã hoàn tiền (Trừ)";
    case TransactionStatus.DISPUTED:
      return "Đang tranh chấp";
    default:
      return status;
  }
};

const getStatusBadgeColor = (status: TransactionStatus): string => {
  switch (status) {
    case TransactionStatus.PENDING:
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case TransactionStatus.COMPLETED:
      return "bg-green-100 text-green-800 border-green-200";
    case TransactionStatus.FAILED:
      return "bg-red-100 text-red-800 border-red-200";
    case TransactionStatus.CANCELLED:
      return "bg-gray-100 text-gray-800 border-gray-200";
    case TransactionStatus.REFUNDED:
      return "bg-red-100 text-red-800 border-red-200";
    case TransactionStatus.DISPUTED:
      return "bg-orange-100 text-orange-800 border-orange-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const TransactionHistoryTabs = () => {
  const [trigger, { isLoading }] = useLazyGetMyTransactionsQuery();
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<
    TransactionStatus | "all"
  >("all");
  const [selectedType, setSelectedType] = useState<TransactionType | "all">(
    "all"
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [, setIsError] = useState<boolean>(false);
  const [, setError] = useState<string>("");

  const { setPaging, pageSize, pageIndex, resetPaging } = usePaging();

  const fetchDresses = useCallback(async () => {
    try {
      const filters = [];

      if (selectedStatus !== "all") {
        filters.push(`status:eq:${selectedStatus}`);
      }

      // Filter by type
      if (selectedType !== "all") {
        filters.push(`type:eq:${selectedType}`);
      }

      // Search by transaction ID or note
      if (searchTerm.trim()) {
        filters.push(`id:like:${searchTerm.trim()}`);
      }

      const { statusCode, message, items, ...paging } = await trigger({
        filter: filters.join(","),
        sort: `updatedAt:${sortOrder}`,
        page: pageIndex,
        size: pageSize,
      }).unwrap();
      if (statusCode === 200) {
        setTransactions(items);
        setPaging(
          paging.pageIndex,
          paging.pageSize,
          paging.totalItems,
          paging.totalPages,
          paging.hasNextPage,
          paging.hasPrevPage
        );
      } else {
        setIsError(true);
        setError(message);
      }
    } catch {
      toast.error("Đã xảy ra lỗi khi tải dữ liệu giao dịch");
    }
  }, [
    selectedStatus,
    selectedType,
    searchTerm,
    sortOrder,
    pageIndex,
    pageSize,
    setPaging,
    trigger,
  ]);

  useEffect(() => {
    resetPaging();
  }, [selectedStatus, selectedType, searchTerm, sortOrder, resetPaging]);

  useEffect(() => {
    fetchDresses();
  }, [fetchDresses]);

  return (
    <Card>
      <CardHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-blue-600" />
                Lịch Sử Giao Dịch
              </CardTitle>
              <CardDescription>
                Xem lại lịch sử giao dịch của bạn
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setSortOrder(sortOrder === "desc" ? "asc" : "desc")
              }
              className="flex items-center gap-2"
            >
              {sortOrder === "desc" ? (
                <SortDesc className="h-4 w-4" />
              ) : (
                <SortAsc className="h-4 w-4" />
              )}
              {sortOrder === "desc" ? "Mới nhất" : "Cũ nhất"}
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo mã giao dịch..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select
              value={selectedStatus}
              onValueChange={(value) =>
                setSelectedStatus(value as TransactionStatus | "all")
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="pending">Đang chờ</SelectItem>
                <SelectItem value="completed">Đã hoàn thành</SelectItem>
                <SelectItem value="failed">Thất bại</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
                <SelectItem value="refunded">Đã hoàn tiền</SelectItem>
                <SelectItem value="disputed">Đang tranh chấp</SelectItem>
              </SelectContent>
            </Select>

            {/* Type Filter */}
            <Select
              value={selectedType}
              onValueChange={(value) =>
                setSelectedType(value as TransactionType | "all")
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Loại giao dịch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                <SelectItem value="DEPOSIT">Nạp tiền</SelectItem>
                <SelectItem value="WITHDRAW">Rút tiền</SelectItem>
                <SelectItem value="TRANSFER">Chuyển tiền</SelectItem>
                <SelectItem value="RECEIVE">Nhận tiền</SelectItem>
                <SelectItem value="REFUND">Hoàn tiền</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Đang tải...</span>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8">
            <History className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Không tìm thấy giao dịch nào</p>
            <p className="text-sm text-gray-400">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </p>
          </div>
        ) : (
          transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`p-2 rounded-full ${
                    [
                      TransactionType.TRANSFER,
                      TransactionType.WITHDRAW,
                      TransactionType.REFUND,
                    ].includes(transaction.type) ||
                    transaction.status === TransactionStatus.REFUNDED
                      ? "bg-red-100"
                      : "bg-green-100"
                  }`}
                >
                  {[
                    TransactionType.TRANSFER,
                    TransactionType.WITHDRAW,
                    TransactionType.REFUND,
                  ].includes(transaction.type) ||
                  transaction.status === TransactionStatus.REFUNDED ? (
                    <ArrowDownLeft className="h-4 w-4 text-red-600" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-medium text-gray-900">
                      Giao dịch: #{transaction.id.substring(0, 8)}
                    </p>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusBadgeColor(
                        transaction.status
                      )}`}
                    >
                      {getTransactionStatusLabel(transaction.status)}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">
                      Thời gian giao dịch:{" "}
                      {formatDateShort(transaction.updatedAt)} -{" "}
                      {new Date(transaction.updatedAt).toLocaleTimeString(
                        "vi-VN",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        }
                      )}
                    </p>
                    <p className="text-sm text-gray-500">
                      Loại giao dịch:{" "}
                      {getTransactionTypeLabel(transaction.type)}
                      {(transaction.type === TransactionType.REFUND ||
                        transaction.status === TransactionStatus.REFUNDED) && (
                        <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                          Trừ tiền
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-500">
                      Người gửi: {transaction.from}
                    </p>
                    <p className="text-sm text-gray-500">
                      Người nhận: {transaction.to}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-gray-100 space-y-1">
                    <p className="text-xs text-gray-400">
                      Số dư khả dụng:{" "}
                      <span className="font-medium text-gray-600">
                        {formatPrice(transaction.availableBalanceSnapshot)}
                      </span>
                    </p>
                    <p className="text-xs text-gray-400">
                      Số dư bị khóa:{" "}
                      <span className="font-medium text-gray-600">
                        {formatPrice(transaction.lockedBalanceSnapshot)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-right flex flex-col items-end gap-2">
                {[
                  TransactionType.TRANSFER,
                  TransactionType.WITHDRAW,
                  TransactionType.REFUND,
                ].includes(transaction.type) ||
                transaction.status === TransactionStatus.REFUNDED ? (
                  <div className="text-right">
                    <p className="text-2xl font-bold text-red-600">
                      - {formatPrice(transaction.amount)}
                    </p>
                    <p className="text-xs text-red-500 font-medium">Tiền ra</p>
                  </div>
                ) : (
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      + {formatPrice(transaction.amount)}
                    </p>
                    <p className="text-xs text-green-500 font-medium">
                      Tiền vào
                    </p>
                  </div>
                )}

                {transaction.note && (
                  <div className="text-xs text-gray-400 max-w-32 text-right">
                    <p className="truncate">{transaction.note}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {!isLoading && transactions.length > 0 && <PagingComponent />}
      </CardContent>
    </Card>
  );
};
