"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Ban,
  CheckCircle,
  Phone,
  Calendar,
  ShoppingBag,
  Heart,
  Filter,
} from "lucide-react"

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
]

export default function UsersManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [userTypeFilter, setUserTypeFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState<any>(null)

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "Hoạt động", className: "bg-green-100 text-green-700" },
      suspended: { label: "Tạm khóa", className: "bg-red-100 text-red-700" },
      pending: { label: "Chờ duyệt", className: "bg-yellow-100 text-yellow-700" },
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const getUserTypeBadge = (userType: string) => {
    const typeConfig = {
      customer: { label: "Khách hàng", className: "bg-blue-100 text-blue-700", icon: Heart },
      supplier: { label: "Nhà cung cấp", className: "bg-purple-100 text-purple-700", icon: ShoppingBag },
    }
    const config = typeConfig[userType as keyof typeof typeConfig]
    const Icon = config.icon
    return (
      <Badge className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery)

    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    const matchesUserType = userTypeFilter === "all" || user.userType === userTypeFilter

    return matchesSearch && matchesStatus && matchesUserType
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản Lý Người Dùng</h1>
          <p className="text-gray-600 mt-2">Quản lý tài khoản khách hàng và nhà cung cấp</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Xuất Dữ Liệu
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng Người Dùng</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Khách Hàng</p>
                <p className="text-2xl font-bold text-blue-600">
                  {users.filter((u) => u.userType === "customer").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Nhà Cung Cấp</p>
                <p className="text-2xl font-bold text-purple-600">
                  {users.filter((u) => u.userType === "supplier").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Hoạt Động</p>
                <p className="text-2xl font-bold text-green-600">{users.filter((u) => u.status === "active").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm tên, email, số điện thoại..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="suspended">Tạm khóa</SelectItem>
                <SelectItem value="pending">Chờ duyệt</SelectItem>
              </SelectContent>
            </Select>
            <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Lọc theo loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                <SelectItem value="customer">Khách hàng</SelectItem>
                <SelectItem value="supplier">Nhà cung cấp</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Người Dùng ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar || undefined} />
                      <AvatarFallback className="bg-rose-100 text-rose-600">{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{user.name}</h3>
                      <p className="text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getUserTypeBadge(user.userType)}
                    {getStatusBadge(user.status)}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        {user.status === "active" && (
                          <DropdownMenuItem>
                            <Ban className="h-4 w-4 mr-2" />
                            Tạm khóa
                          </DropdownMenuItem>
                        )}
                        {user.status === "suspended" && (
                          <DropdownMenuItem>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Kích hoạt
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{user.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>Tham gia: {new Date(user.joinDate).toLocaleDateString("vi-VN")}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>Đăng nhập: {new Date(user.lastLogin).toLocaleDateString("vi-VN")}</span>
                  </div>
                  {user.userType === "customer" && (
                    <div className="flex items-center space-x-2">
                      <ShoppingBag className="h-4 w-4 text-gray-400" />
                      <span>{user.totalOrders} đơn hàng</span>
                    </div>
                  )}
                </div>

                {user.userType === "customer" && user.totalSpent > 0 && (
                  <div className="mt-3 text-sm text-gray-600">
                    <strong>Tổng chi tiêu:</strong> {user.totalSpent.toLocaleString("vi-VN")}₫
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Detail Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi Tiết Người Dùng</DialogTitle>
            <DialogDescription>Thông tin chi tiết về {selectedUser?.name}</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedUser.avatar || undefined} />
                  <AvatarFallback className="bg-rose-100 text-rose-600 text-xl">
                    {selectedUser.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    {getUserTypeBadge(selectedUser.userType)}
                    {getStatusBadge(selectedUser.status)}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p className="text-sm text-gray-600">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Số điện thoại</label>
                  <p className="text-sm text-gray-600">{selectedUser.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Ngày tham gia</label>
                  <p className="text-sm text-gray-600">{new Date(selectedUser.joinDate).toLocaleDateString("vi-VN")}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Đăng nhập cuối</label>
                  <p className="text-sm text-gray-600">
                    {new Date(selectedUser.lastLogin).toLocaleDateString("vi-VN")}
                  </p>
                </div>
                {selectedUser.userType === "customer" && (
                  <>
                    <div>
                      <label className="text-sm font-medium">Tổng đơn hàng</label>
                      <p className="text-sm text-gray-600">{selectedUser.totalOrders}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Tổng chi tiêu</label>
                      <p className="text-sm text-gray-600">{selectedUser.totalSpent.toLocaleString("vi-VN")}₫</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedUser(null)}>
              Đóng
            </Button>
            <Button className="bg-rose-600 hover:bg-rose-700">Chỉnh Sửa</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
