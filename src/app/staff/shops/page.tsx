"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
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
  CheckCircle,
  Ban,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  TrendingUp,
  Filter,
} from "lucide-react"

// Mock data - same as before
const shops = [
  {
    id: 1,
    name: "Cửa hàng thời trang ABC",
    owner: "Nguyễn Thị Lan",
    email: "shopABC@gmail.com",
    phone: "+84901234567",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    status: "active",
    verificationStatus: "verified",
    joinDate: "2024-01-15",
    totalOrders: 45,
    rating: 4.8,
    revenue: 125000000,
  },
  {
    id: 2,
    name: "Váy Cưới Hoàng Gia",
    owner: "Trần Văn Minh",
    email: "hoanggia@gmail.com",
    phone: "+84987654321",
    address: "456 Đường XYZ, Quận 3, TP.HCM",
    status: "pending",
    verificationStatus: "pending",
    joinDate: "2024-02-20",
    totalOrders: 0,
    rating: 0,
    revenue: 0,
  },
  {
    id: 3,
    name: "Thiết Kế Cô Dâu Elite",
    owner: "Lê Thị Hương",
    email: "elite@gmail.com",
    phone: "+84912345678",
    address: "789 Đường DEF, Quận 7, TP.HCM",
    status: "suspended",
    verificationStatus: "verified",
    joinDate: "2023-11-10",
    totalOrders: 23,
    rating: 4.2,
    revenue: 67000000,
  },
]

export default function ShopsManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedShop, setSelectedShop] = useState<any>(null)

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "Hoạt động", className: "bg-green-100 text-green-700" },
      pending: { label: "Chờ duyệt", className: "bg-yellow-100 text-yellow-700" },
      suspended: { label: "Tạm khóa", className: "bg-red-100 text-red-700" },
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const filteredShops = shops.filter((shop) => {
    const matchesSearch =
      shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || shop.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản Lý Cửa Hàng</h1>
          <p className="text-gray-600 mt-2">Quản lý và theo dõi tất cả cửa hàng trong hệ thống</p>
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
                <p className="text-sm text-gray-600">Tổng Cửa Hàng</p>
                <p className="text-2xl font-bold text-gray-900">{shops.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đang Hoạt Động</p>
                <p className="text-2xl font-bold text-green-600">{shops.filter((s) => s.status === "active").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Chờ Duyệt</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {shops.filter((s) => s.status === "pending").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tạm Khóa</p>
                <p className="text-2xl font-bold text-red-600">
                  {shops.filter((s) => s.status === "suspended").length}
                </p>
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
                placeholder="Tìm kiếm cửa hàng, chủ sở hữu, email..."
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
                <SelectItem value="pending">Chờ duyệt</SelectItem>
                <SelectItem value="suspended">Tạm khóa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Shops List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Cửa Hàng ({filteredShops.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredShops.map((shop) => (
              <div key={shop.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`/placeholder-icon.png?height=48&width=48&text=${shop.name.charAt(0)}`} />
                      <AvatarFallback className="bg-rose-100 text-rose-600">{shop.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{shop.name}</h3>
                      <p className="text-gray-600">Chủ sở hữu: {shop.owner}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(shop.status)}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedShop(shop)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        {shop.status === "pending" && (
                          <DropdownMenuItem>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Phê duyệt
                          </DropdownMenuItem>
                        )}
                        {shop.status === "active" && (
                          <DropdownMenuItem>
                            <Ban className="h-4 w-4 mr-2" />
                            Tạm khóa
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{shop.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{shop.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>Tham gia: {new Date(shop.joinDate).toLocaleDateString("vi-VN")}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-gray-400" />
                    <span>{shop.totalOrders} đơn hàng</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{shop.address}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Shop Detail Dialog */}
      <Dialog open={!!selectedShop} onOpenChange={() => setSelectedShop(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi Tiết Cửa Hàng</DialogTitle>
            <DialogDescription>Thông tin chi tiết về cửa hàng {selectedShop?.name}</DialogDescription>
          </DialogHeader>
          {selectedShop && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Tên cửa hàng</Label>
                  <p className="text-sm text-gray-600">{selectedShop.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Chủ sở hữu</Label>
                  <p className="text-sm text-gray-600">{selectedShop.owner}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm text-gray-600">{selectedShop.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Số điện thoại</Label>
                  <p className="text-sm text-gray-600">{selectedShop.phone}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-sm font-medium">Địa chỉ</Label>
                  <p className="text-sm text-gray-600">{selectedShop.address}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Trạng thái</Label>
                  <div className="mt-1">{getStatusBadge(selectedShop.status)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Ngày tham gia</Label>
                  <p className="text-sm text-gray-600">{new Date(selectedShop.joinDate).toLocaleDateString("vi-VN")}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Tổng đơn hàng</Label>
                  <p className="text-sm text-gray-600">{selectedShop.totalOrders}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Đánh giá</Label>
                  <p className="text-sm text-gray-600">{selectedShop.rating}/5.0</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-sm font-medium">Doanh thu</Label>
                  <p className="text-sm text-gray-600">{selectedShop.revenue.toLocaleString("vi-VN")}₫</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedShop(null)}>
              Đóng
            </Button>
            <Button className="bg-rose-600 hover:bg-rose-700">Chỉnh Sửa</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
