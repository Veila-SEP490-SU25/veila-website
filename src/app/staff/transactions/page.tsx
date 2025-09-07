'use client';

import { EmptyCard } from '@/components/empty-card';
import { ErrorCard } from '@/components/error-card';
import { GoBackButton } from '@/components/go-back-button';
import { PagingComponent } from '@/components/paging-component';
import { TransactionCard } from '@/components/staff/transactions/transaction-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageLoading } from '@/components/ui/page-loading';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { isSuccess } from '@/lib/utils';
import { usePaging } from '@/providers/paging.provider';
import { useLazyGetTransactionsQuery } from '@/services/apis';
import { ITransaction } from '@/services/types';
import { RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

export default function StaffTransactionPage() {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const { pageIndex, pageSize, totalItems, resetPaging, setPaging } = usePaging();
  const [trigger, { isLoading }] = useLazyGetTransactionsQuery();
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState<string>('all');

  const fetchTransactions = useCallback(async () => {
    try {
      const { statusCode, message, items, ...paging } = await trigger({
        sort: 'createdAt:desc',
        page: pageIndex,
        size: pageSize,
        filter: filter === 'all' ? '' : `type:eq:${filter}`,
      }).unwrap();
      if (isSuccess(statusCode)) {
        setTransactions(items);
        setPaging(
          paging.pageIndex,
          paging.pageSize,
          paging.totalItems,
          paging.totalPages,
          paging.hasNextPage,
          paging.hasPrevPage,
        );
        setError('');
        setIsError(false);
      } else {
        setIsError(true);
        setError(message);
      }
    } catch (error) {
      console.error(error);
      setIsError(true);
      setError('Có lỗi xảy ra trong quá trình tải dữ liệu khiếu nại');
    }
  }, [filter, pageSize, pageIndex, setPaging, trigger, setError, setIsError]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions, pageSize, pageIndex]);

  useEffect(() => {
    resetPaging();
  }, [resetPaging, filter]);

  return (
    <div className="p-6 space-y-6 max-w-full w-full">
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="space-y-2">
              <CardTitle>Quản lý giao dịch</CardTitle>
              <CardDescription>
                Hiển thị {transactions.length}/{totalItems} giao dịch
              </CardDescription>
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="DEPOSIT">Nạp tiền</SelectItem>
                <SelectItem value="WITHDRAW">Rút tiền</SelectItem>
                <SelectItem value="TRANSFER">Chuyển khoản</SelectItem>
                <SelectItem value="RECEIVE">Nhận tiền</SelectItem>
                <SelectItem value="REFUND">Hoàn tiền</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isError ? (
            <div className="p-6 space-y-6 max-w-full">
              <Card>
                <CardHeader className="items-center justify-center">
                  <CardTitle className="text-red-500">Đã có lỗi xảy ra khi tải dữ liệu</CardTitle>
                  <CardDescription className="w-full items-center justify-center flex gap-2">
                    <GoBackButton />
                    <Button
                      className="flex items-center justify-center gap-2 bg-rose-500 text-white"
                      onClick={fetchTransactions}
                    >
                      <RefreshCw className={`size-4 ${isLoading ? 'animate-spin' : ''}`} />
                      Thử lại
                    </Button>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ErrorCard message={error} />
                </CardContent>
              </Card>
            </div>
          ) : isLoading ? (
            <div className="p-6 space-y-6 max-w-full">
              <PageLoading type="shops" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-6 space-y-6 max-w-full">
              <EmptyCard
                message="Không có giao dịch phù hợp với tìm kiếm của bạn"
                title="Không có giao dịch nào"
              />
            </div>
          ) : (
            <div className="p-6 space-y-6 max-w-full">
              {transactions.map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                  onUpdate={fetchTransactions}
                />
              ))}
              <PagingComponent />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
