"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, RefreshCw, Plus } from "lucide-react";
import { useLazyGetUsersQuery } from "@/services/apis";
import { usePaging } from "@/providers/paging.provider";
import { isSuccess } from "@/lib/utils";
import { IUser } from "@/services/types";
import { useDebounce } from "@/hooks/use-debounce";
import { GoBackButton } from "@/components/go-back-button";
import { ErrorCard } from "@/components/error-card";
import { PageLoading } from "@/components/ui/page-loading";
import { EmptyCard } from "@/components/empty-card";
import { PagingComponent } from "@/components/paging-component";
import { UserCard } from "@/components/staff/users/user-card";
import { CreateUserDialog } from "@/components/staff/users/create-user-dialog";

const users = [
  {
    id: 1,
    name: "Nguyễn Thị Lan",
    email: "lan@gmail.com",
    phone: "+84901234567",
    userType: "customer",
    status: "active",
    joinDate: "2024-01-15",
    lastLogin: "2024-01-25",
    totalOrders: 3,
    totalSpent: 15000000,
    avatar: null,
  },
  {
    id: 2,
    name: "Trần Văn Minh",
    email: "minh@gmail.com",
    phone: "+84987654321",
    userType: "supplier",
    status: "active",
    joinDate: "2023-12-10",
    lastLogin: "2024-01-24",
    totalOrders: 0,
    totalSpent: 0,
    avatar: null,
  },
  {
    id: 3,
    name: "Lê Thị Hương",
    email: "huong@gmail.com",
    phone: "+84912345678",
    userType: "customer",
    status: "suspended",
    joinDate: "2024-01-20",
    lastLogin: "2024-01-22",
    totalOrders: 1,
    totalSpent: 2500000,
    avatar: null,
  },
  {
    id: 4,
    name: "Phạm Văn Nam",
    email: "nam@gmail.com",
    phone: "+84923456789",
    userType: "customer",
    status: "active",
    joinDate: "2024-01-18",
    lastLogin: "2024-01-25",
    totalOrders: 5,
    totalSpent: 25000000,
    avatar: null,
  },
  {
    id: 5,
    name: "Võ Thị Mai",
    email: "mai@gmail.com",
    phone: "+84934567890",
    userType: "supplier",
    status: "pending",
    joinDate: "2024-01-22",
    lastLogin: "2024-01-23",
    totalOrders: 0,
    totalSpent: 0,
    avatar: null,
  },
];

export default function UsersManagement() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [trigger, { isLoading }] = useLazyGetUsersQuery();
  const { pageIndex, pageSize, totalItems, resetPaging, setPaging } =
    usePaging();
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string>("");
  const [filter, setFilter] = useState<string>("");
  const debouncedFilter = useDebounce<string>(filter, 500);

  const fetchUsers = useCallback(async () => {
    try {
      const { statusCode, message, items, ...paging } = await trigger({
        sort: "updatedAt:desc",
        page: pageIndex,
        size: pageSize,
        filter: debouncedFilter && `email:like:${debouncedFilter}`,
      }).unwrap();
      if (isSuccess(statusCode)) {
        setUsers(items);
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
  }, [
    debouncedFilter,
    pageSize,
    pageIndex,
    setPaging,
    trigger,
    setError,
    setIsError,
  ]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers, pageSize, pageIndex]);

  useEffect(() => {
    resetPaging();
  }, [resetPaging, debouncedFilter]);

  return (
    <div className="p-6 space-y-6 max-w-full w-full">
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="space-y-2">
              <CardTitle>Quản lý người dùng</CardTitle>
              <CardDescription>
                Hiển thị {users.length}/{totalItems} người dùng
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm email..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="pl-8 w-full"
                />
              </div>
              <CreateUserDialog onUpdate={fetchUsers}>
                <Button className="flex items-center gap-2" variant="outline">
                  <Plus className="size-4" />
                  Thêm người dùng
                </Button>
              </CreateUserDialog>
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
                      onClick={fetchUsers}
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
          ) : users.length === 0 ? (
            <div className="p-6 space-y-6 max-w-full">
              <EmptyCard
                message="Không có người dùng phù hợp với tìm kiếm của bạn"
                title="Không có người dùng nào"
              />
            </div>
          ) : (
            <div className="max-w-full ">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {users.map((user) => (
                  <div className="w-full col-span-1" key={user.id}>
                    <UserCard user={user} onUpdate={fetchUsers} />
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
