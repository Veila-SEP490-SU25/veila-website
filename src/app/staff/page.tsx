"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Store,
  FileText,
  MessageSquare,
  Users,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertTriangle,
  Eye,
  Calendar,
} from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

// Mock data for dashboard
const stats = [
  {
    title: "Tổng Cửa Hàng",
    value: "156",
    change: "+12%",
    changeType: "increase" as const,
    icon: Store,
    color: "blue",
  },
  {
    title: "Người Dùng Hoạt Động",
    value: "2,847",
    change: "+8%",
    changeType: "increase" as const,
    icon: Users,
    color: "green",
  },
  {
    title: "Bài Viết Blog",
    value: "89",
    change: "+23%",
    changeType: "increase" as const,
    icon: FileText,
    color: "purple",
  },
  {
    title: "Khiếu Nại Mở",
    value: "12",
    change: "-15%",
    changeType: "decrease" as const,
    icon: MessageSquare,
    color: "red",
  },
]

const recentActivities = [
  {
    id: 1,
    type: "shop_approval",
    title: "Cửa hàng mới được phê duyệt",
    description: "Váy Cưới Hoàng Gia đã được phê duyệt",
    time: "2 phút trước",
    icon: Store,
    color: "green",
  },
  {
    id: 2,
    type: "complaint",
    title: "Khiếu nại mới",
    description: "Khách hàng khiếu nại về chất lượng sản phẩm",
    time: "15 phút trước",
    icon: AlertTriangle,
    color: "red",
  },
  {
    id: 3,
    type: "blog_published",
    title: "Bài viết được xuất bản",
    description: "10 Xu Hướng Váy Cưới 2024 đã được xuất bản",
    time: "1 giờ trước",
    icon: FileText,
    color: "blue",
  },
  {
    id: 4,
    type: "user_registered",
    title: "Người dùng mới đăng ký",
    description: "5 người dùng mới đăng ký trong giờ qua",
    time: "2 giờ trước",
    icon: Users,
    color: "purple",
  },
]

const pendingTasks = [
  {
    id: 1,
    title: "Phê duyệt 3 cửa hàng mới",
    priority: "high",
    dueDate: "Hôm nay",
    type: "shop_approval",
  },
  {
    id: 2,
    title: "Xem xét 5 bài viết blog",
    priority: "medium",
    dueDate: "Ngày mai",
    type: "blog_review",
  },
  {
    id: 3,
    title: "Xử lý 2 khiếu nại khẩn cấp",
    priority: "high",
    dueDate: "Hôm nay",
    type: "complaint_urgent",
  },
  {
    id: 4,
    title: "Cập nhật chính sách hệ thống",
    priority: "low",
    dueDate: "Tuần tới",
    type: "system_update",
  },
]

const topShops = [
  {
    id: 1,
    name: "Cửa hàng thời trang ABC",
    owner: "Nguyễn Thị Lan",
    revenue: 125000000,
    orders: 45,
    rating: 4.8,
  },
  {
    id: 2,
    name: "Thiết Kế Cô Dâu Elite",
    owner: "Lê Thị Hương",
    revenue: 98000000,
    orders: 38,
    rating: 4.6,
  },
  {
    id: 3,
    name: "Váy Cưới Luxury",
    owner: "Trần Văn Minh",
    revenue: 87000000,
    orders: 32,
    rating: 4.7,
  },
]

export default function StaffDashboard() {
  redirect("/staff/shops");
  const getPriorityBadge = (priority: string) => {
    const config = {
      high: { label: "Cao", className: "bg-red-100 text-red-700" },
      medium: { label: "Trung bình", className: "bg-yellow-100 text-yellow-700" },
      low: { label: "Thấp", className: "bg-green-100 text-green-700" },
    }
    const priorityConfig = config[priority as keyof typeof config]
    return <Badge className={priorityConfig.className}>{priorityConfig.label}</Badge>
  }

  const getActivityIcon = (type: string, color: string) => {
    const icons = {
      shop_approval: Store,
      complaint: AlertTriangle,
      blog_published: FileText,
      user_registered: Users,
    }
    const Icon = icons[type as keyof typeof icons] || Clock
    const colorClasses = {
      green: "text-green-600 bg-green-100",
      red: "text-red-600 bg-red-100",
      blue: "text-blue-600 bg-blue-100",
      purple: "text-purple-600 bg-purple-100",
    }
    return (
      <div className={`p-2 rounded-full ${colorClasses[color as keyof typeof colorClasses]}`}>
        <Icon className="h-4 w-4" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tổng Quan Hệ Thống</h1>
        <p className="text-gray-600 mt-2">Chào mừng trở lại! Đây là tình hình tổng quan của hệ thống Veila.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          const colorClasses = {
            blue: "text-blue-600",
            green: "text-green-600",
            purple: "text-purple-600",
            red: "text-red-600",
          }
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      {stat.changeType === "increase" ? (
                        <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          stat.changeType === "increase" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">so với tháng trước</span>
                    </div>
                  </div>
                  <Icon className={`h-8 w-8 ${colorClasses[stat.color as keyof typeof colorClasses]}`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Hoạt Động Gần Đây</CardTitle>
              <CardDescription>Các sự kiện và thay đổi mới nhất trong hệ thống</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50">
                    {getActivityIcon(activity.type, activity.color)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <Button variant="outline" className="w-full bg-transparent">
                  Xem Tất Cả Hoạt Động
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Tasks */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Công Việc Cần Xử Lý</CardTitle>
              <CardDescription>Danh sách các tác vụ đang chờ xử lý</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingTasks.map((task) => (
                  <div key={task.id} className="p-3 border rounded-lg hover:shadow-sm transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{task.title}</h4>
                      {getPriorityBadge(task.priority)}
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      {task.dueDate}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <Button className="w-full bg-rose-600 hover:bg-rose-700">Xem Tất Cả Công Việc</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Top Performing Shops */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Cửa Hàng Hiệu Suất Cao</CardTitle>
              <CardDescription>Top cửa hàng có doanh thu và đánh giá tốt nhất</CardDescription>
            </div>
            <Button asChild variant="outline">
              <Link href="/staff/shops">
                <Eye className="h-4 w-4 mr-2" />
                Xem Tất Cả
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topShops.map((shop, index) => (
              <div key={shop.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-rose-100 text-rose-600 rounded-full font-bold text-sm">
                    #{index + 1}
                  </div>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${shop.name.charAt(0)}`} />
                    <AvatarFallback className="bg-gray-100">{shop.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{shop.name}</h4>
                    <p className="text-sm text-gray-600">Chủ: {shop.owner}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-4 text-sm">
                    <div>
                      <p className="font-medium">{shop.revenue.toLocaleString("vi-VN")}₫</p>
                      <p className="text-gray-500">Doanh thu</p>
                    </div>
                    <div>
                      <p className="font-medium">{shop.orders}</p>
                      <p className="text-gray-500">Đơn hàng</p>
                    </div>
                    <div>
                      <p className="font-medium">{shop.rating}/5.0</p>
                      <p className="text-gray-500">Đánh giá</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Thao Tác Nhanh</CardTitle>
          <CardDescription>Các tác vụ thường dùng để quản lý hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button asChild variant="outline" className="h-20 flex-col bg-transparent">
              <Link href="/staff/shops">
                <Store className="h-6 w-6 mb-2" />
                Quản Lý Cửa Hàng
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col bg-transparent">
              <Link href="/staff/blogs">
                <FileText className="h-6 w-6 mb-2" />
                Quản Lý Blog
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col bg-transparent">
              <Link href="/staff/complaints">
                <MessageSquare className="h-6 w-6 mb-2" />
                Xử Lý Khiếu Nại
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col bg-transparent">
              <Link href="/staff/users">
                <Users className="h-6 w-6 mb-2" />
                Quản Lý Người Dùng
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
