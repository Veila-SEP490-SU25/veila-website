"use client";

import { LoadingItem } from "@/components/loading-item";
import { PagingComponent } from "@/components/paging-component";
import { AccessoryDetailDialog } from "@/components/shops/my/accessories/accessory-detail-dialog";
import { CreateAccessoryDialog } from "@/components/shops/my/accessories/create-accessosy-dialog";
import { DeleteAccessoryDialog } from "@/components/shops/my/accessories/delete-accessory-dialog";
import { UpdateAccessoryDialog } from "@/components/shops/my/accessories/update-accesssory-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDebounce } from "@/hooks/use-debounce";
import {
  accessoryStatusColors,
  accessoryStatusLabels,
  formatPrice,
  getCoverImage,
} from "@/lib/products-utils";
import { usePaging } from "@/providers/paging.provider";
import {
  useLazyGetMyShopAccessoriesQuery,
  useUpdateAccessoryMutation,
} from "@/services/apis";
import { IAccessory, AccessoryStatus } from "@/services/types";
import {
  AlertCircleIcon,
  Edit,
  Eye,
  MoreHorizontal,
  Plus,
  Search,
  Star,
  Trash2,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export const ShopAccessoriesTabs = () => {
  const [accessories, setAccessories] = useState<IAccessory[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [getAccessories, { isLoading }] = useLazyGetMyShopAccessoriesQuery();
  const [updateAccessory, { isLoading: isUpdating }] =
    useUpdateAccessoryMutation();
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [updateTrigger, setUpdateTrigger] = useState<number>(0);

  const debouncedSearchTerm = useDebounce<string>(searchTerm, 300);
  const { setPaging, pageSize, pageIndex, resetPaging } = usePaging();

  const fetchAccessories = useCallback(async () => {
    try {
      let filter = "";
      if (debouncedSearchTerm) {
        filter += `name:like:${debouncedSearchTerm}`;
      }
      if (statusFilter !== "ALL") {
        if (filter) filter += ",";
        filter += `status:eq:${statusFilter}`;
      }

      const { statusCode, message, items, ...paging } = await getAccessories({
        filter: filter,
        sort: `name:desc`,
        page: pageIndex,
        size: pageSize,
      }).unwrap();
      if (statusCode === 200) {
        setAccessories(items);
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
      toast.error("Đã xảy ra lỗi khi tải dữ liệu sản phẩm của cửa hàng");
    }
  }, [
    debouncedSearchTerm,
    statusFilter,
    pageIndex,
    pageSize,
    setPaging,
    setIsError,
    setError,
    getAccessories,
  ]);

  useEffect(() => {
    if (debouncedSearchTerm !== searchTerm) {
      resetPaging();
    }
  }, [debouncedSearchTerm, searchTerm, resetPaging]);

  useEffect(() => {
    fetchAccessories();
  }, [
    debouncedSearchTerm,
    statusFilter,
    pageSize,
    pageIndex,
    fetchAccessories,
  ]);

  const handleStatusUpdate = useCallback(
    async (accessoryId: string, newStatus: string, accessory: IAccessory) => {
      try {
        const { statusCode, message } = await updateAccessory({
          id: accessoryId,
          categoryId: accessory.categoryId || "", // Ensure it's a string
          name: accessory.name,
          description: accessory.description || "",
          sellPrice:
            typeof accessory.sellPrice === "string"
              ? parseFloat(accessory.sellPrice) || 0
              : accessory.sellPrice,
          rentalPrice:
            typeof accessory.rentalPrice === "string"
              ? parseFloat(accessory.rentalPrice) || 0
              : accessory.rentalPrice,
          isSellable: accessory.isSellable,
          isRentable: accessory.isRentable,
          status: newStatus as AccessoryStatus,
          images: accessory.images || "",
        }).unwrap();
        if (statusCode === 200) {
          setAccessories((prevAccessories) => {
            const updatedAccessories = prevAccessories.map((a) =>
              a.id === accessoryId
                ? { ...a, status: newStatus as AccessoryStatus }
                : a
            );
            console.log("🔄 Updating accessory status:", {
              accessoryId,
              newStatus,
              updatedAccessories,
            });
            return updatedAccessories;
          });
          setUpdateTrigger((prev) => prev + 1);
          toast.success("Cập nhật trạng thái phụ kiện thành công!");
        } else {
          toast.error(message || "Có lỗi xảy ra khi cập nhật trạng thái");
        }
      } catch {
        toast.error("Đã xảy ra lỗi khi cập nhật trạng thái phụ kiện");
      }
    },
    [updateAccessory]
  );

  // Debug: Log khi accessories state thay đổi
  useEffect(() => {
    console.log("🔄 Accessories state updated:", accessories);
  }, [accessories]);

  // Debug: Log khi updateTrigger thay đổi
  useEffect(() => {
    console.log("🔄 Update trigger changed:", updateTrigger);
  }, [updateTrigger]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 items-center justify-between space-x-2">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm phụ kiện..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                  <SelectItem value="AVAILABLE">Có sẵn</SelectItem>
                  <SelectItem value="UNAVAILABLE">Không có sẵn</SelectItem>
                  <SelectItem value="OUT_OF_STOCK">Hết hàng</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <CreateAccessoryDialog
              trigger={
                <Button className="bg-rose-600 hover:bg-rose-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm phụ kiện mới
                </Button>
              }
              onSuccess={fetchAccessories}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <LoadingItem />
        ) : isError ? (
          <Alert variant={"destructive"} className="mb-4 h-full">
            <AlertCircleIcon />
            <AlertTitle>
              Đã có lỗi xảy ra trong quá trình lấy dữ liệu
            </AlertTitle>
            <AlertDescription>
              <p>Chi tiết lỗi:</p>
              <ul className="list-inside list-disc text-sm">
                <li>{error}</li>
              </ul>
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Phụ kiện</TableHead>
                    <TableHead>Giá bán</TableHead>
                    <TableHead>Giá thuê</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accessories.map((accessory) => (
                    <TableRow key={accessory.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-12 w-12 rounded-lg">
                            <AvatarImage
                              src={
                                getCoverImage(accessory.images) ||
                                "/placeholder.svg"
                              }
                              alt={accessory.name}
                            />
                            <AvatarFallback className="rounded-lg">
                              {accessory.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{accessory.name}</div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Star className="mr-2 text-yellow-300" />
                              {accessory.ratingAverage} •{" "}
                              {accessory.ratingCount} bài đánh giá
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {accessory.isSellable && accessory.sellPrice ? (
                          <span className="font-medium">
                            {formatPrice(accessory.sellPrice)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">
                            Không bán
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {accessory.isRentable && accessory.rentalPrice ? (
                          <span className="font-medium">
                            {formatPrice(accessory.rentalPrice)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">
                            Không cho thuê
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            accessoryStatusColors[
                              accessory.status as keyof typeof accessoryStatusColors
                            ]
                          }
                        >
                          {
                            accessoryStatusLabels[
                              accessory.status as keyof typeof accessoryStatusLabels
                            ]
                          }
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <AccessoryDetailDialog
                                accessory={accessory}
                                trigger={
                                  <Button
                                    className="flex items-center cursor-pointer w-full justify-start"
                                    variant="ghost"
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    Xem chi tiết
                                  </Button>
                                }
                              />
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <UpdateAccessoryDialog
                                accessory={accessory}
                                trigger={
                                  <Button
                                    className="flex items-center cursor-pointer w-full justify-start"
                                    variant="ghost"
                                  >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Chỉnh sửa
                                  </Button>
                                }
                                onSuccess={fetchAccessories}
                              />
                            </DropdownMenuItem>

                            {/* Status Update Options */}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusUpdate(
                                  accessory.id,
                                  AccessoryStatus.AVAILABLE,
                                  accessory
                                )
                              }
                              className="text-green-600"
                              disabled={isUpdating}
                            >
                              {isUpdating ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <CheckCircle className="h-4 w-4 mr-2" />
                              )}
                              Đặt trạng thái: Có sẵn
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusUpdate(
                                  accessory.id,
                                  AccessoryStatus.UNAVAILABLE,
                                  accessory
                                )
                              }
                              className="text-orange-600"
                              disabled={isUpdating}
                            >
                              {isUpdating ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <XCircle className="h-4 w-4 mr-2" />
                              )}
                              Đặt trạng thái: Không có sẵn
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusUpdate(
                                  accessory.id,
                                  AccessoryStatus.OUT_OF_STOCK,
                                  accessory
                                )
                              }
                              className="text-red-600"
                              disabled={isUpdating}
                            >
                              {isUpdating ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <XCircle className="h-4 w-4 mr-2" />
                              )}
                              Đặt trạng thái: Hết hàng
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <DeleteAccessoryDialog
                                accessory={accessory}
                                trigger={
                                  <Button
                                    className="flex items-center cursor-pointer w-full justify-start text-red-600"
                                    variant="ghost"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Xóa
                                  </Button>
                                }
                                onSuccess={fetchAccessories}
                              />
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <PagingComponent />
          </>
        )}
      </CardContent>
    </Card>
  );
};
