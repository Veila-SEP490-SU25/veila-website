"use client";

import { ErrorCard } from "@/components/error-card";
import { GoBackButton } from "@/components/go-back-button";
import { LoadingItem } from "@/components/loading-item";
import { PagingComponent } from "@/components/paging-component";
import { OrderCard } from "@/components/staff/orders/order-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { TabsContent } from "@/components/ui/tabs";
import { formatPrice } from "@/lib/products-utils";
import { usePaging } from "@/providers/paging.provider";
import { useLazyGetOrderOfShopQuery } from "@/services/apis";
import { IOrder, IShop } from "@/services/types";
import {
  AlertCircleIcon,
  FileText,
  Package,
  RefreshCw,
  Scissors,
  Shirt,
  ShoppingBag,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "react-day-picker";

interface OrdersTabsProps {
  shop: IShop;
  onUpdate?: () => void;
}

interface IStats {
  totalOrders: number;
  totalSales: number;
  totalRentals: number;
  totalOrdersValue: number;
  totalSalesValue: number;
  totalRentalsValue: number;
  totalCustom: number;
  totalCustomValue: number;
}

export const OrdersTabs = ({ shop, onUpdate }: OrdersTabsProps) => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [trigger, { isLoading }] = useLazyGetOrderOfShopQuery();
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [filter, setFilter] = useState<string>("all");
  const [stats, setStats] = useState<IStats>({
    totalOrders: 0,
    totalOrdersValue: 0,
    totalSales: 0,
    totalSalesValue: 0,
    totalRentals: 0,
    totalRentalsValue: 0,
    totalCustom: 0,
    totalCustomValue: 0,
  });

  const { setPaging, pageSize, pageIndex, totalItems, resetPaging } =
    usePaging();

  const fetchOrders = useCallback(async () => {
    try {
      const { statusCode, message, items, ...paging } = await trigger({
        shopId: shop.id,
        filter: filter === "all" ? "" : `type:eq:${filter}`,
        sort: `updatedAt:desc`,
        page: pageIndex,
        size: pageSize,
      }).unwrap();
      if (statusCode === 200) {
        setOrders(items);
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
      setError("Đã xảy ra lỗi khi tải dữ liệu sản phẩm của cửa hàng");
    }
  }, [pageIndex, pageSize, setPaging, setIsError, setError, filter]);

  useEffect(() => {
    resetPaging();
    fetchOrders();
  }, [filter]);

  useEffect(() => {
    fetchOrders();
  }, [pageIndex, pageSize, filter]);

  const fetchStats = async () => {
    const allOrders = await trigger({
      shopId: shop.id,
      filter: ``,
      sort: `updatedAt:desc`,
      page: pageIndex,
      size: pageSize,
    }).unwrap();

    const sellResponse = await trigger({
      shopId: shop.id,
      filter: `type:eq:SELL`,
      sort: `updatedAt:desc`,
      page: pageIndex,
      size: pageSize,
    }).unwrap();

    const rentalResponse = await trigger({
      shopId: shop.id,
      filter: `type:eq:RENT`,
      sort: `updatedAt:desc`,
      page: pageIndex,
      size: pageSize,
    }).unwrap();

    const customResponse = await trigger({
      shopId: shop.id,
      filter: `type:eq:CUSTOM`,
      sort: `updatedAt:desc`,
      page: pageIndex,
      size: pageSize,
    }).unwrap();

    setStats({
      totalOrders: allOrders.totalItems,
      totalOrdersValue: allOrders.items
        .map((o) => Number(o.amount))
        .reduce((a, b) => a + b, 0),
      totalSales: sellResponse.totalItems,
      totalSalesValue: sellResponse.items
        .map((o) => Number(o.amount))
        .reduce((a, b) => a + b, 0),
      totalRentals: rentalResponse.totalItems,
      totalRentalsValue: rentalResponse.items
        .map((o) => Number(o.amount))
        .reduce((a, b) => a + b, 0),
      totalCustom: customResponse.totalItems,
      totalCustomValue: customResponse.items
        .map((o) => Number(o.amount))
        .reduce((a, b) => a + b, 0),
    });
  };

  useEffect(() => {
    fetchStats();
  }, [shop]);

  if (isError) {
    return (
      <TabsContent value="orders">
        <Card>
          <CardHeader className="items-center justify-center">
            <CardTitle className="text-red-500">
              Đã có lỗi xảy ra khi tải dữ liệu
            </CardTitle>
            <CardDescription className="flex items-center justify-center gap-4">
              <GoBackButton />
              <Button
                className="flex items-center justify-center gap-2 bg-rose-500 text-white"
                onClick={fetchOrders}
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
    <TabsContent value="orders">
      <Card>
        <CardHeader className="space-y-4">
          <div className="w-full grid grid-cols-4 gap-2">
            <Card className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 p-0 pt-1">
              <div className="bg-white p-4 rounded-t-lg space-y-2">
                <CardTitle className="text-center w-full flex items-center justify-center gap-2">
                  Tất cả đơn hàng
                  <FileText className="size-6 text-emerald-600" />
                </CardTitle>
                <div className="flex items-center justify-between w-full">
                  <CardDescription className="text-sm">
                    Số lượng đơn
                  </CardDescription>
                  <p className="font-bold text-4xl text-emerald-500">
                    {stats.totalOrders}
                  </p>
                </div>
                <div className="flex items-center justify-between w-full">
                  <CardDescription className="text-sm">Giá trị</CardDescription>
                  <p className="font-bold text-lg text-emerald-500">
                    {formatPrice(stats.totalOrdersValue)}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 p-0 pt-1">
              <div className="bg-white p-4 rounded-t-lg space-y-2">
                <CardTitle className="text-center w-full flex items-center justify-center gap-2">
                  Đơn mua
                  <ShoppingBag className="size-6 text-cyan-500" />
                </CardTitle>
                <div className="flex items-center justify-between w-full">
                  <CardDescription className="text-sm">
                    Số lượng đơn
                  </CardDescription>
                  <p className="font-bold text-4xl text-cyan-500">
                    {stats.totalSales}
                  </p>
                </div>
                <div className="flex items-center justify-between w-full">
                  <CardDescription className="text-sm">Giá trị</CardDescription>
                  <p className="font-bold text-lg text-cyan-500">
                    {formatPrice(stats.totalSalesValue)}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 p-0 pt-1">
              <div className="bg-white p-4 rounded-t-lg space-y-2">
                <CardTitle className="text-center w-full flex items-center justify-center gap-2">
                  Đơn thuê
                  <Shirt className="size-6 text-amber-500" />
                </CardTitle>
                <div className="flex items-center justify-between w-full">
                  <CardDescription className="text-sm">
                    Số lượng đơn
                  </CardDescription>
                  <p className="font-bold text-4xl text-amber-500">
                    {stats.totalRentals}
                  </p>
                </div>
                <div className="flex items-center justify-between w-full">
                  <CardDescription className="text-sm">Giá trị</CardDescription>
                  <p className="font-bold text-lg text-amber-500">
                    {formatPrice(stats.totalRentalsValue)}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="w-full bg-gradient-to-r from-rose-500 to-pink-500 p-0 pt-1">
              <div className="bg-white p-4 rounded-t-lg space-y-2">
                <CardTitle className="text-center w-full flex items-center justify-center gap-2">
                  Đơn đặt may
                  <Scissors className="size-6 text-rose-500" />
                </CardTitle>
                <div className="flex items-center justify-between w-full">
                  <CardDescription className="text-sm">
                    Số lượng đơn
                  </CardDescription>
                  <p className="font-bold text-4xl text-rose-500">
                    {stats.totalCustom}
                  </p>
                </div>
                <div className="flex items-center justify-between w-full">
                  <CardDescription className="text-sm">Giá trị</CardDescription>
                  <p className="font-bold text-lg text-rose-500">
                    {formatPrice(stats.totalCustomValue)}
                  </p>
                </div>
              </div>
            </Card>
          </div>
          <div className="flex gap-4 items-center justify-between">
            <CardDescription>
              Hiển thị {orders.length}/{totalItems} đơn hàng
            </CardDescription>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn bộ lọc" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="SELL">Đơn mua</SelectItem>
                <SelectItem value="RENT">Đơn thuê</SelectItem>
                <SelectItem value="CUSTOM">Đơn đặt may</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Không có đơn hàng nào
                </h3>
                <p className="text-gray-600">Chưa có đơn hàng nào được tạo</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
              <PagingComponent />
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
};
