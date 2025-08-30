"use client";

import { LoadingItem } from "@/components/loading-item";
import { PagingComponent } from "@/components/paging-component";
import { AccessoryDetailDialog } from "@/components/shops/my/accessories/accessory-detail-dialog";
import { CreateAccessoryDialog } from "@/components/shops/my/accessories/create-accessosy-dialog";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
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
import { useLazyGetMyShopAccessoriesQuery } from "@/services/apis";
import { IAccessory } from "@/services/types";
import {
  AlertCircleIcon,
  Edit,
  Eye,
  MoreHorizontal,
  Package,
  Plus,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export const ShopAccessoriesTabs = () => {
  const [accessories, setAccessories] = useState<IAccessory[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [trigger, { isLoading }] = useLazyGetMyShopAccessoriesQuery();
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const debouncedSearchTerm = useDebounce<string>(searchTerm, 300);
  const { setPaging, pageSize, pageIndex, totalItems, resetPaging } =
    usePaging();

  const fetchAccessories = useCallback(async () => {
    try {
      const { statusCode, message, items, ...paging } = await trigger({
        filter: debouncedSearchTerm ? `name:like:${debouncedSearchTerm}` : "",
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
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi tải dữ liệu sản phẩm của cửa hàng");
    }
  }, [
    debouncedSearchTerm,
    pageIndex,
    pageSize,
    setPaging,
    setIsError,
    setError,
  ]);

  useEffect(() => {
    resetPaging();
    fetchAccessories();
  }, [debouncedSearchTerm]);

  useEffect(() => {
    fetchAccessories();
  }, [debouncedSearchTerm, pageIndex, pageSize]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 items-center justify-between space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm phụ kiện..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
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
                            <DropdownMenuItem>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Xóa
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
