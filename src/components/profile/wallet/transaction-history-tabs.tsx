"use client";
import { PagingComponent } from "@/components/paging-component";
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
import { ArrowDownLeft, ArrowUpRight, History } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export const TransactionHistoryTabs = () => {
  const [trigger, { isLoading }] = useLazyGetMyTransactionsQuery();
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<
    TransactionStatus | "all"
  >("all");
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const { setPaging, pageSize, pageIndex, totalItems, resetPaging } =
    usePaging();

  const fetchDresses = useCallback(async () => {
    try {
      const { statusCode, message, items, ...paging } = await trigger({
        filter: selectedStatus !== "all" ? `status:${selectedStatus}` : "",
        sort: ``,
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
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi tải dữ liệu sản phẩm của cửa hàng");
    }
  }, [selectedStatus, pageIndex, pageSize, setPaging, setIsError, setError]);

  useEffect(() => {
    resetPaging();
  }, [selectedStatus]);

  useEffect(() => {
    fetchDresses();
  }, [selectedStatus, pageIndex, pageSize]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-blue-600" />
              Lịch Sử Giao Dịch
            </CardTitle>
            <CardDescription>Xem lại lịch sử giao dịch của bạn</CardDescription>
          </div>
          <Select
            value={selectedStatus}
            onValueChange={(value) =>
              setSelectedStatus(value as TransactionStatus | "all")
            }
          >
            <SelectTrigger className="w-max">
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="pending">Đang chờ</SelectItem>
              <SelectItem value="completed">Đã hoàn thành</SelectItem>
              <SelectItem value="failed">Thất bại</SelectItem>
              <SelectItem value="cancelled">Đã hủy</SelectItem>
              <SelectItem value="refunded">Đã hoàn tiền</SelectItem>
              <SelectItem value="disputed">Đang tranh chấp</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div className="flex items-center space-x-4">
              <div
                className={`p-2 rounded-full ${
                  [TransactionType.TRANSFER, TransactionType.WITHDRAW].includes(
                    transaction.type
                  )
                    ? "bg-red-100"
                    : "bg-green-100"
                }`}
              >
                {[TransactionType.TRANSFER, TransactionType.WITHDRAW].includes(
                  transaction.type
                ) ? (
                  <ArrowDownLeft className="h-4 w-4 text-red-600" />
                ) : (
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  Giao dịch: #{transaction.id.substring(0, 8)}
                </p>
                <p className="text-sm text-gray-500">
                  Ngày giao dịch: {formatDateShort(transaction.updatedAt)}
                </p>
                <p className="text-sm text-gray-500">
                  Người gửi: {transaction.from}
                </p>
                <p className="text-sm text-gray-500">
                  Người nhận: {transaction.to}
                </p>
              </div>
            </div>
            <div className="text-right">
              {[TransactionType.TRANSFER, TransactionType.WITHDRAW].includes(
                transaction.type
              ) ? (
                <p className="text-red-600">
                  - {formatPrice(transaction.amount)}
                </p>
              ) : (
                <p className="text-green-600">
                  + {formatPrice(transaction.amount)}
                </p>
              )}
            </div>
          </div>
        ))}
        <PagingComponent />
      </CardContent>
    </Card>
  );
};
