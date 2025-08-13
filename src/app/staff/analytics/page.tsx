"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, Users, Store, ShoppingBag, DollarSign, Download } from "lucide-react"
import { useState } from "react"

const analyticsData = {
  overview: {
    totalRevenue: 2450000000,
    revenueChange: 12.5,
    totalOrders: 1247,
    ordersChange: 8.3,
    totalUsers: 2847,
    usersChange: 15.2,
    totalShops: 156,
    shopsChange: 6.7,
  },
  monthlyData: [
    { month: "Jan", revenue: 180000000, orders: 89, users: 234 },
    { month: "Feb", revenue: 220000000, orders: 112, users: 289 },
    { month: "Mar", revenue: 195000000, orders: 98, users: 267 },
    { month: "Apr", revenue: 240000000, orders: 125, users: 312 },
    { month: "May", revenue: 280000000, orders: 145, users: 356 },
    { month: "Jun", revenue: 320000000, orders: 167, users: 398 },
  ],
  topCategories: [
    { name: "Váy Dáng A", orders: 345, revenue: 890000000 },
    { name: "Váy Dáng Cá", orders: 289, revenue: 720000000 },
    { name: "Váy Bồng", orders: 234, revenue: 650000000 },
    { name: "Váy Ôm", orders: 198, revenue: 520000000 },
  ],
  topShops: [
    { name: "Cửa hàng thời trang ABC", orders: 89, revenue: 245000000, rating: 4.8 },
    { name: "Váy Cưới Hoàng Gia", orders: 76, revenue: 198000000, rating: 4.6 },
    { name: "Thiết Kế Cô Dâu Elite", orders: 65, revenue: 167000000, rating: 4.7 },
    { name: "Luxury Bridal", orders: 54, revenue: 145000000, rating: 4.5 },
  ],
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("6months")

  const StatCard = ({ title, value, change, changeType, icon: Icon, color }: any) => {
    const colorClasses = {
      blue: "text-blue-600",
      green: "text-green-600",
      purple: "text-purple-600",
      orange: "text-orange-600",
    }

    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{title}</p>
              <p className="text-3xl font-bold text-gray-900">{value}</p>
              <div className="flex items-center mt-2">
                {changeType === "increase" ? (
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                )}
                <span
                  className={`text-sm font-medium ${changeType === "increase" ? "text-green-600" : "text-red-600"}`}
                >
                  {change > 0 ? "+" : ""}
                  {change}%
                </span>
                <span className="text-sm text-gray-500 ml-1">so với tháng trước</span>
              </div>
            </div>
            <Icon className={`h-8 w-8 ${colorClasses[color as keyof typeof colorClasses]}`} />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Báo Cáo & Phân Tích</h1>
          <p className="text-gray-600 mt-2">Theo dõi hiệu suất và xu hướng của hệ thống</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">7 ngày qua</SelectItem>
              <SelectItem value="30days">30 ngày qua</SelectItem>
              <SelectItem value="3months">3 tháng qua</SelectItem>
              <SelectItem value="6months">6 tháng qua</SelectItem>
              <SelectItem value="1year">1 năm qua</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Xuất Báo Cáo
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng Doanh Thu"
          value={`${(analyticsData.overview.totalRevenue / 1000000000).toFixed(1)}B₫`}
          change={analyticsData.overview.revenueChange}
          changeType="increase"
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Tổng Đơn Hàng"
          value={analyticsData.overview.totalOrders.toLocaleString()}
          change={analyticsData.overview.ordersChange}
          changeType="increase"
          icon={ShoppingBag}
          color="blue"
        />
        <StatCard
          title="Người Dùng"
          value={analyticsData.overview.totalUsers.toLocaleString()}
          change={analyticsData.overview.usersChange}
          changeType="increase"
          icon={Users}
          color="purple"
        />
        <StatCard
          title="Cửa Hàng"
          value={analyticsData.overview.totalShops.toString()}
          change={analyticsData.overview.shopsChange}
          changeType="increase"
          icon={Store}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Doanh Thu Theo Tháng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Biểu đồ doanh thu sẽ hiển thị tại đây</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Chart Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Đơn Hàng Theo Tháng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Biểu đồ đơn hàng sẽ hiển thị tại đây</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Danh Mục Bán Chạy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topCategories.map((category, index) => (
                <div key={category.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-rose-100 text-rose-600 rounded-full font-bold text-sm">
                      #{index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium">{category.name}</h4>
                      <p className="text-sm text-gray-600">{category.orders} đơn hàng</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{(category.revenue / 1000000).toFixed(0)}M₫</p>
                    <p className="text-sm text-gray-500">Doanh thu</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Shops */}
        <Card>
          <CardHeader>
            <CardTitle>Cửa Hàng Hiệu Suất Cao</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topShops.map((shop, index) => (
                <div key={shop.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-bold text-sm">
                      #{index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium">{shop.name}</h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>{shop.orders} đơn</span>
                        <span>•</span>
                        <span>⭐ {shop.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{(shop.revenue / 1000000).toFixed(0)}M₫</p>
                    <p className="text-sm text-gray-500">Doanh thu</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Hiệu Suất Theo Tháng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Tháng</th>
                  <th className="text-right py-3 px-4">Doanh Thu</th>
                  <th className="text-right py-3 px-4">Đơn Hàng</th>
                  <th className="text-right py-3 px-4">Người Dùng Mới</th>
                  <th className="text-right py-3 px-4">Tăng Trưởng</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.monthlyData.map((data, index) => {
                  const prevRevenue = index > 0 ? analyticsData.monthlyData[index - 1].revenue : data.revenue
                  const growth = (((data.revenue - prevRevenue) / prevRevenue) * 100).toFixed(1)
                  return (
                    <tr key={data.month} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{data.month}</td>
                      <td className="py-3 px-4 text-right">{(data.revenue / 1000000).toFixed(0)}M₫</td>
                      <td className="py-3 px-4 text-right">{data.orders}</td>
                      <td className="py-3 px-4 text-right">{data.users}</td>
                      <td className="py-3 px-4 text-right">
                        {index > 0 && (
                          <Badge
                            className={
                              Number.parseFloat(growth) >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }
                          >
                            {Number.parseFloat(growth) >= 0 ? "+" : ""}
                            {growth}%
                          </Badge>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
