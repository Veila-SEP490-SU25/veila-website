"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IShop } from "@/services/types";
import {
  useLazyGetMyShopDressesQuery,
  useLazyGetMyShopAccessoriesQuery,
  useLazyGetMyShopBlogsQuery,
  useLazyGetOrdersQuery,
  useLazyGetShopIncomeQuery,
} from "@/services/apis";
import {
  DollarSign,
  Package,
  ShoppingBag,
  FileText,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface ShopDashboardProps {
  shop: IShop;
}

export const ShopDashboard = ({ shop }: ShopDashboardProps) => {
  const [metrics, setMetrics] = useState({
    dresses: 0,
    accessories: 0,
    blogs: 0,
    orders: 0,
    income: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const [getDresses] = useLazyGetMyShopDressesQuery();
  const [getAccessories] = useLazyGetMyShopAccessoriesQuery();
  const [getBlogs] = useLazyGetMyShopBlogsQuery();
  const [getOrders] = useLazyGetOrdersQuery();
  const [getShopIncome] = useLazyGetShopIncomeQuery();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setIsLoading(true);

        // Fetch dresses
        const dressesResponse = await getDresses({
          page: 0,
          size: 1000,
          filter: "",
          sort: "",
        }).unwrap();
        const dressesCount = dressesResponse.items?.length || 0;

        // Fetch accessories
        const accessoriesResponse = await getAccessories({
          page: 0,
          size: 1000,
          filter: "",
          sort: "",
        }).unwrap();
        const accessoriesCount = accessoriesResponse.items?.length || 0;

        // Fetch blogs
        const blogsResponse = await getBlogs({
          page: 0,
          size: 1000,
          filter: "",
          sort: "",
        }).unwrap();
        const blogsCount = blogsResponse.items?.length || 0;

        // Fetch orders with shop filter
        const ordersResponse = await getOrders({
          page: 0,
          size: 1000,
          filter: `shopId:eq:${shop.id}`,
          sort: "",
        }).unwrap();
        const ordersCount = ordersResponse.items?.length || 0;

        // Fetch shop income
        const incomeResponse = await getShopIncome(shop.id).unwrap();
        const incomeAmount = incomeResponse.item || 0;

        setMetrics({
          dresses: dressesCount,
          accessories: accessoriesCount,
          blogs: blogsCount,
          orders: ordersCount,
          income: incomeAmount,
        });
      } catch (error: any) {
        console.error("Error fetching metrics:", error);

        // Xử lý error message an toàn
        let errorMessage = "Không thể tải dữ liệu dashboard";
        if (error?.data?.message) {
          errorMessage = error.data.message;
        } else if (error?.message) {
          errorMessage = error.message;
        } else if (typeof error === "string") {
          errorMessage = error;
        }

        // Hiển thị toast error với message an toàn
        toast.error(errorMessage);

        // Set metrics mặc định khi có lỗi
        setMetrics({
          dresses: 0,
          accessories: 0,
          blogs: 0,
          orders: 0,
          income: 0,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, [getDresses, getAccessories, getBlogs, getOrders, shop.id, getShopIncome]);

  // Data for charts
  const productData = [
    { name: "Váy cưới", value: metrics.dresses, color: "#ef4444" },
    { name: "Phụ kiện", value: metrics.accessories, color: "#3b82f6" },
  ];

  const metricsData = [
    { name: "Đơn hàng", value: metrics.orders, icon: ShoppingBag },
    { name: "Blog", value: metrics.blogs, icon: FileText },
    {
      name: "Tổng sản phẩm",
      value: metrics.dresses + metrics.accessories,
      icon: Package,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Tổng quan hoạt động kinh doanh của {shop.name}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {/* Key Metrics Cards Skeleton */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Skeleton */}
          <div className="grid gap-6 md:grid-cols-2">
            {[...Array(2)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-[300px] bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detailed Metrics Skeleton */}
          <div className="grid gap-4 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-10 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Key Metrics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatPrice(metrics.income)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Tổng doanh thu hiện tại
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Đơn hàng</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.orders}</div>
                <p className="text-xs text-muted-foreground">
                  Tổng số đơn hàng
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sản phẩm</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics.dresses + metrics.accessories}
                </div>
                <p className="text-xs text-muted-foreground">
                  Tổng số sản phẩm
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Blog</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.blogs}</div>
                <p className="text-xs text-muted-foreground">
                  Số bài viết blog
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Product Distribution Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Phân bố sản phẩm
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={productData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {productData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Metrics Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Thống kê tổng quan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={metricsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Metrics */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Váy cưới</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-rose-600">
                  {metrics.dresses}
                </div>
                <p className="text-sm text-muted-foreground">
                  Sản phẩm váy cưới
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Phụ kiện</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {metrics.accessories}
                </div>
                <p className="text-sm text-muted-foreground">
                  Sản phẩm phụ kiện
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tổng doanh thu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {formatPrice(metrics.income)}
                </div>
                <p className="text-sm text-muted-foreground">
                  Doanh thu hiện tại
                </p>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};
