"use client";

import { EmptyCard } from "@/components/empty-card";
import { ErrorCard } from "@/components/error-card";
import { GoBackButton } from "@/components/go-back-button";
import { PagingComponent } from "@/components/paging-component";
import { ComplaintCard } from "@/components/staff/complaints/complaint-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageLoading } from "@/components/ui/page-loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isSuccess } from "@/lib/utils";
import { usePaging } from "@/providers/paging.provider";
import { useLazyGetComplaintsStaffQuery } from "@/services/apis";
import { IComplaint } from "@/services/types";
import { RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function ComplaintsManagement() {
  const [complaints, setComplaints] = useState<IComplaint[]>([]);
  const { pageIndex, pageSize, totalItems, resetPaging, setPaging } =
    usePaging();
  const [trigger, { isLoading }] = useLazyGetComplaintsStaffQuery();
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [filter, setFilter] = useState<string>("all");

  const fetchComplaints = useCallback(async () => {
    try {
      const { statusCode, message, items, ...paging } = await trigger({
        sort: "updatedAt:desc",
        page: pageIndex,
        size: pageSize,
        filter: filter === "all" ? "" : `status:eq:${filter}`,
      }).unwrap();
      if (isSuccess(statusCode)) {
        setComplaints(items);
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
      console.error(error);
      setIsError(true);
      setError("Có lỗi xảy ra trong quá trình tải dữ liệu khiếu nại");
    }
  }, [filter, pageSize, pageIndex, setPaging, trigger, setError, setIsError]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints, pageSize, pageIndex]);

  useEffect(() => {
    resetPaging();
  }, [resetPaging, filter]);

  return (
    <div className="p-6 space-y-6 max-w-full w-full">
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="space-y-2">
              <CardTitle>Quản lý khiếu nại</CardTitle>
              <CardDescription>
                Hiển thị {complaints.length}/{totalItems} khiếu nại
              </CardDescription>
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="IN_PROGRESS">Đang xử lý</SelectItem>
                <SelectItem value="REJECTED">Từ chối</SelectItem>
                <SelectItem value="APPROVED">Đã duyệt</SelectItem>
              </SelectContent>
            </Select>
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
                      onClick={fetchComplaints}
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
          ) : complaints.length === 0 ? (
            <div className="p-6 space-y-6 max-w-full">
              <EmptyCard
                message="Không có khiếu nại phù hợp với tìm kiếm của bạn"
                title="Không có khiếu nại nào"
              />
            </div>
          ) : (
            <div className="p-6 space-y-6 max-w-full">
              {complaints.map((complaint) => (
                <ComplaintCard
                  key={complaint.id}
                  complaint={complaint}
                  onUpdate={fetchComplaints}
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
