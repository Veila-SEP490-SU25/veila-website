"use client";
import { EmptyCard } from "@/components/empty-card";
import { ErrorCard } from "@/components/error-card";
import { GoBackButton } from "@/components/go-back-button";
import { PagingComponent } from "@/components/paging-component";
import { CreateSubscriptionDialog } from "@/components/staff/subscriptions/create-subscription-dialog";
import { SubscriptionCard } from "@/components/staff/subscriptions/subscription-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageLoading } from "@/components/ui/page-loading";
import { useDebounce } from "@/hooks/use-debounce";
import { isSuccess } from "@/lib/utils";
import { usePaging } from "@/providers/paging.provider";
import { useLazyGetSubscriptionsQuery } from "@/services/apis";
import { ISubscription } from "@/services/types";
import { Plus, RefreshCw, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function StaffSubscriptionPage() {
  const [subscriptions, setSubscriptions] = useState<ISubscription[]>([]);
  const [trigger, { isLoading }] = useLazyGetSubscriptionsQuery();
  const { pageIndex, pageSize, totalItems, resetPaging, setPaging } =
    usePaging();
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string>("");
  const [filter, setFilter] = useState<string>("");
  const debouncedFilter = useDebounce<string>(filter, 300);

  const fetchSubscriptions = useCallback(async () => {
    try {
      const { statusCode, message, items, ...paging } = await trigger({
        sort: "updatedAt:desc",
        page: pageIndex,
        size: pageSize,
        filter: debouncedFilter && `name:like:${debouncedFilter}`,
      }).unwrap();
      if (isSuccess(statusCode)) {
        setSubscriptions(items);
        setPaging(
          paging.pageIndex,
          paging.pageSize,
          paging.totalItems,
          paging.totalPages,
          paging.hasNextPage,
          paging.hasPrevPage
        );
        setError("");
        setIsError(false);
      } else {
        setIsError(true);
        setError(message);
      }
    } catch (error) {
      setIsError(true);
      setError("Có lỗi xảy ra trong quá trình tải dữ liệu khiếu nại");
    }
  }, [filter, pageSize, pageIndex, setPaging, trigger, setError, setIsError]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions, pageSize, pageIndex]);

  useEffect(() => {
    resetPaging();
  }, [resetPaging, filter]);

  return (
    <div className="p-6 space-y-6 max-w-full w-full">
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="space-y-2">
              <CardTitle>Quản lý gói đăng ký</CardTitle>
              <CardDescription>
                Hiển thị {subscriptions.length}/{totalItems} gói đăng ký
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm gói đăng ký..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="pl-8"
                />
              </div>
              <CreateSubscriptionDialog onSuccess={fetchSubscriptions}>
                <Button className="flex items-center gap-2" variant="outline">
                  <Plus className="size-4" />
                  Tạo mới
                </Button>
              </CreateSubscriptionDialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isError ? (
            <div className="p-6 space-y-6 max-w-full">
              <Card>
                <CardHeader className="items-center justify-center">
                  <CardTitle className="text-red-500">
                    Đã có lỗi xảy ra khi tải dữ liệu
                  </CardTitle>
                  <CardDescription className="w-full items-center justify-center flex gap-2">
                    <GoBackButton />
                    <Button
                      className="flex items-center justify-center gap-2 bg-rose-500 text-white"
                      onClick={fetchSubscriptions}
                    >
                      <RefreshCw
                        className={`size-4 ${isLoading ? "animate-spin" : ""}`}
                      />
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
          ) : subscriptions.length === 0 ? (
            <div className="p-6 space-y-6 max-w-full">
              <EmptyCard
                message="Không có gói đăng ký phù hợp với tìm kiếm của bạn"
                title="Không có gói đăng ký nào"
              />
            </div>
          ) : (
            <div className="p-6 max-w-full ">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {subscriptions.map((subscription, index) => (
                  <div className="w-full col-span-1" key={subscription.id}>
                    <SubscriptionCard
                      subscription={subscription}
                      onUpdate={fetchSubscriptions}
                    />
                  </div>
                ))}
              </div>
              <PagingComponent />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
