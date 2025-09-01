"use client";

import { ErrorCard } from "@/components/error-card";
import { GoBackButton } from "@/components/go-back-button";
import { LoadingItem } from "@/components/loading-item";
import { PagingComponent } from "@/components/paging-component";
import { AccessoryDetailDialog } from "@/components/shops/my/accessories/accessory-detail-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TabsContent } from "@/components/ui/tabs";
import { useDebounce } from "@/hooks/use-debounce";
import {
  accessoryStatusColors,
  accessoryStatusLabels,
  formatPrice,
  getCoverImage,
} from "@/lib/products-utils";
import { usePaging } from "@/providers/paging.provider";
import { useLazyGetShopAccessoriesQuery } from "@/services/apis";
import { IAccessory, IShop } from "@/services/types";
import { Eye, RefreshCw, Search, Star } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface AccessoriesTabsProps {
  shop: IShop;
  onUpdate?: () => void;
}

export const AccessoriesTabs = ({ shop, onUpdate }: AccessoriesTabsProps) => {
  const [accessories, setAccessories] = useState<IAccessory[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [trigger, { isLoading }] = useLazyGetShopAccessoriesQuery();
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const debouncedSearchTerm = useDebounce<string>(searchTerm, 300);
  const { setPaging, pageSize, pageIndex, totalItems, resetPaging } =
    usePaging();

  const fetchAccessories = useCallback(async () => {
    try {
      const { statusCode, message, items, ...paging } = await trigger({
        id: shop.id,
        filter: debouncedSearchTerm ? `name:like:${debouncedSearchTerm}` : "",
        sort: `updatedAt:desc`,
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
        setError("");
        setIsError(false);
      } else {
        setIsError(true);
        setError(message);
      }
    } catch (error) {
      console.error(error);
      setIsError(true);
      setError("Đã xảy ra lỗi khi tải dữ liệu phụ kiện của cửa hàng");
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

  if (isError) {
    return (
      <TabsContent value="accessories">
        <Card>
          <CardHeader className="items-center justify-center">
            <CardTitle className="text-red-500">
              Đã có lỗi xảy ra khi tải dữ liệu
            </CardTitle>
            <CardDescription className="flex items-center justify-center gap-4">
              <GoBackButton />
              <Button
                className="flex items-center justify-center gap-2 bg-rose-500 text-white"
                onClick={fetchAccessories}
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
      </TabsContent>
    );
  }

  if (isLoading) {
    return (
      <TabsContent value="dresses">
        <LoadingItem />
      </TabsContent>
    );
  }

  return (
    <TabsContent value="accessories">
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
              <CardDescription>
                Hiển thị {accessories.length}/{totalItems} phụ kiện
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
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
                            {accessory.ratingAverage} • {accessory.ratingCount}{" "}
                            bài đánh giá
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
                        <span className="text-muted-foreground">Không bán</span>
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
                    <TableCell className="text-right flex items-center justify-end">
                      <AccessoryDetailDialog
                        accessory={accessory}
                        trigger={
                          <Button
                            className="flex items-center cursor-pointer justify-center"
                            variant="outline"
                            size="icon"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <PagingComponent />
        </CardContent>
      </Card>
    </TabsContent>
  );
};
