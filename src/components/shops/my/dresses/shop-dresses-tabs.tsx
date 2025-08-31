"use client";

import { LoadingItem } from "@/components/loading-item";
import { PagingComponent } from "@/components/paging-component";
import { CreateDressDialog } from "@/components/shops/my/dresses/create-dress-dialog";
import { DeleteDressDialog } from "@/components/shops/my/dresses/delete-dress-dialog";
import { DressDetailDialog } from "@/components/shops/my/dresses/dress-detail-dialog";
import { UpdateDressDialog } from "@/components/shops/my/dresses/update-dress-dialog";
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
  dressStatusColors,
  dressStatusLabels,
  formatPrice,
  getCoverImage,
} from "@/lib/products-utils";
import { usePaging } from "@/providers/paging.provider";
import { useLazyGetMyShopDressesQuery } from "@/services/apis";
import { IDress } from "@/services/types";
import {
  AlertCircleIcon,
  Edit,
  Eye,
  MoreHorizontal,
  Search,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export const ShopDressesTabs = () => {
  const [dresses, setDresses] = useState<IDress[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [trigger, { isLoading }] = useLazyGetMyShopDressesQuery();
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const debouncedSearchTerm = useDebounce<string>(searchTerm, 300);
  const { setPaging, pageSize, pageIndex, resetPaging } = usePaging();

  const fetchDresses = useCallback(async () => {
    try {
      const { statusCode, message, items, ...paging } = await trigger({
        filter: debouncedSearchTerm ? `name:like:${debouncedSearchTerm}` : "",
        sort: `name:desc`,
        page: pageIndex,
        size: pageSize,
      }).unwrap();
      if (statusCode === 200) {
        setDresses(items);
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
    pageIndex,
    pageSize,
    setPaging,
    setIsError,
    setError,
    trigger,
  ]);

  useEffect(() => {
    resetPaging();
    fetchDresses();
  }, [debouncedSearchTerm, fetchDresses, resetPaging]);

  useEffect(() => {
    fetchDresses();
  }, [debouncedSearchTerm, fetchDresses, pageIndex, pageSize]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 items-center justify-between space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm váy..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <CreateDressDialog onSuccess={fetchDresses} />
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
                    <TableHead>Váy</TableHead>
                    <TableHead>Giá bán</TableHead>
                    <TableHead>Giá thuê</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Số đo</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dresses.map((dress) => (
                    <TableRow key={dress.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-12 w-12 rounded-lg">
                            <AvatarImage
                              src={
                                getCoverImage(dress.images) ||
                                "/placeholder.svg"
                              }
                              alt={dress.name}
                            />
                            <AvatarFallback className="rounded-lg">
                              {dress.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{dress.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {dress.color} • {dress.material}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {dress.isSellable && dress.sellPrice ? (
                          <span className="font-medium">
                            {formatPrice(
                              typeof dress.sellPrice === "string"
                                ? parseFloat(dress.sellPrice) || 0
                                : dress.sellPrice || 0
                            )}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">
                            Không bán
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {dress.isRentable && dress.rentalPrice ? (
                          <span className="font-medium">
                            {formatPrice(
                              typeof dress.rentalPrice === "string"
                                ? parseFloat(dress.rentalPrice) || 0
                                : dress.rentalPrice || 0
                            )}
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
                            dressStatusColors[
                              dress.status as keyof typeof dressStatusColors
                            ]
                          }
                        >
                          {
                            dressStatusLabels[
                              dress.status as keyof typeof dressStatusLabels
                            ]
                          }
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {dress.bust && dress.waist && dress.hip ? (
                            <span>
                              {dress.bust}-{dress.waist}-{dress.hip}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">
                              Chưa có
                            </span>
                          )}
                        </div>
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
                              <DressDetailDialog
                                dress={dress}
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
                              <UpdateDressDialog
                                dress={dress}
                                trigger={
                                  <Button
                                    className="flex items-center cursor-pointer w-full justify-start"
                                    variant="ghost"
                                  >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Chỉnh sửa
                                  </Button>
                                }
                                onSuccess={fetchDresses}
                              />
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <DeleteDressDialog
                                dress={dress}
                                onSuccess={fetchDresses}
                                trigger={
                                  <Button
                                    variant="ghost"
                                    className="flex items-center cursor-pointer w-full text-red-600 justify-start"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Xóa
                                  </Button>
                                }
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
