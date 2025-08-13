"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
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
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  Calendar,
} from "lucide-react"

const complaints = [
  {
    id: 1,
    title: "Chất lượng váy không như mô tả",
    customer: "Nguyễn Thị Lan",
    customerEmail: "lan@gmail.com",
    shop: "Cửa hàng thời trang ABC",
    category: "Chất lượng sản phẩm",
    priority: "high",
    status: "open",
    createdDate: "2024-01-20",
    description: "Váy cưới nhận được không giống như hình ảnh trên website, chất liệu kém hơn nhiều so với mô tả...",
    response: null,
  },
  {
    id: 2,
    title: "Giao hàng chậm trễ",
    customer: "Trần Thị Mai",
    customerEmail: "mai@gmail.com",
    shop: "Váy Cưới Hoàng Gia",
    category: "Giao hàng",
    priority: "medium",
    status: "in_progress",
    createdDate: "2024-01-18",
    description: "Đặt hàng từ 2 tuần trước nhưng vẫn chưa nhận được váy, liên hệ shop không phản hồi...",
    response: "Đã liên hệ với shop để xác minh tình hình giao hàng.",
  },
  {
    id: 3,
    title: "Dịch vụ khách hàng kém",
    customer: "Lê Thị Hương",
    customerEmail: "huong@gmail.com",
    shop: "Thiết Kế Cô Dâu Elite",
    category: "Dịch vụ khách hàng",
    priority: "low",
    status: "resolved",
    createdDate: "2024-01-15",
    description: "Nhân viên tư vấn không chuyên nghiệp, thái độ không thân thiện...",
    response: "Đã xử lý và shop cam kết cải thiện chất lượng dịch vụ.",
  },
  {
    id: 4,
    title: "Vấn đề thanh toán",
    customer: "Phạm Văn Nam",
    customerEmail: "nam@gmail.com",
    shop: "Cửa hàng thời trang ABC",
    category: "Thanh toán",
    priority: "high",
    status: "open",
    createdDate: "2024-01-22",
    description: "Đã thanh toán nhưng đơn hàng vẫn hiển thị chưa thanh toán, tiền bị trừ 2 lần...",
    response: null,
  },
]

export default function ComplaintsManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null)
  const [responseText, setResponseText] = useState("")

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      open: { label: "Mở", className: "bg-red-100 text-red-700", icon: AlertTriangle },
      in_progress: { label: "Đang xử lý", className: "bg-yellow-100 text-yellow-700", icon: Clock },
      resolved: { label: "Đã giải quyết", className: "bg-green-100 text-green-700", icon: CheckCircle },
      closed: { label: "Đã đóng", className: "bg-gray-100 text-gray-700", icon: XCircle },
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    const Icon = config.icon
    return (
      <Badge className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      high: { label: "Cao", className: "bg-red-100 text-red-700" },
      medium: { label: "Trung bình", className: "bg-yellow-100 text-yellow-700" },
      low: { label: "Thấp", className: "bg-green-100 text-green-700" },
    }
    const config = priorityConfig[priority as keyof typeof priorityConfig]
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.shop.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || complaint.status === statusFilter
    const matchesPriority = priorityFilter === "all" || complaint.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản Lý Khiếu Nại</h1>
          <p className="text-gray-600 mt-2">Xử lý và theo dõi các khiếu nại từ khách hàng</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng Khiếu Nại</p>
                <p className="text-2xl font-bold text-gray-900">{complaints.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đang Mở</p>
                <p className="text-2xl font-bold text-red-600">
                  {complaints.filter((c) => c.status === "open").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đang Xử Lý</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {complaints.filter((c) => c.status === "in_progress").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đã Giải Quyết</p>
                <p className="text-2xl font-bold text-green-600">
                  {complaints.filter((c) => c.status === "resolved").length}
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
                placeholder="Tìm kiếm khiếu nại, khách hàng, cửa hàng..."
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
                <SelectItem value="open">Mở</SelectItem>
                <SelectItem value="in_progress">Đang xử lý</SelectItem>
                <SelectItem value="resolved">Đã giải quyết</SelectItem>
                <SelectItem value="closed">Đã đóng</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Lọc theo độ ưu tiên" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả độ ưu tiên</SelectItem>
                <SelectItem value="high">Cao</SelectItem>
                <SelectItem value="medium">Trung bình</SelectItem>
                <SelectItem value="low">Thấp</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Complaints List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Khiếu Nại ({filteredComplaints.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredComplaints.map((complaint) => (
              <div key={complaint.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-lg">{complaint.title}</h3>
                      {getPriorityBadge(complaint.priority)}
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{complaint.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{complaint.customer}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(complaint.createdDate).toLocaleDateString("vi-VN")}</span>
                      </div>
                      <Badge variant="outline">{complaint.category}</Badge>
                      <span>Cửa hàng: {complaint.shop}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(complaint.status)}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedComplaint(complaint)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Phản hồi
                        </DropdownMenuItem>
                        {complaint.status === "open" && (
                          <DropdownMenuItem>
                            <Clock className="h-4 w-4 mr-2" />
                            Đánh dấu đang xử lý
                          </DropdownMenuItem>
                        )}
                        {complaint.status === "in_progress" && (
                          <DropdownMenuItem>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Đánh dấu đã giải quyết
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                {complaint.response && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Phản hồi:</strong> {complaint.response}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Complaint Detail Dialog */}
      <Dialog open={!!selectedComplaint} onOpenChange={() => setSelectedComplaint(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Chi Tiết Khiếu Nại</DialogTitle>
            <DialogDescription>Thông tin chi tiết về khiếu nại #{selectedComplaint?.id}</DialogDescription>
          </DialogHeader>
          {selectedComplaint && (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Tiêu đề</label>
                  <p className="text-sm text-gray-600">{selectedComplaint.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Khách hàng</label>
                  <p className="text-sm text-gray-600">{selectedComplaint.customer}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p className="text-sm text-gray-600">{selectedComplaint.customerEmail}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Cửa hàng</label>
                  <p className="text-sm text-gray-600">{selectedComplaint.shop}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Danh mục</label>
                  <p className="text-sm text-gray-600">{selectedComplaint.category}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Độ ưu tiên</label>
                  <div className="mt-1">{getPriorityBadge(selectedComplaint.priority)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium">Trạng thái</label>
                  <div className="mt-1">{getStatusBadge(selectedComplaint.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium">Ngày tạo</label>
                  <p className="text-sm text-gray-600">
                    {new Date(selectedComplaint.createdDate).toLocaleDateString("vi-VN")}
                  </p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium">Mô tả</label>
                  <p className="text-sm text-gray-600">{selectedComplaint.description}</p>
                </div>
                {selectedComplaint.response && (
                  <div className="col-span-2">
                    <label className="text-sm font-medium">Phản hồi hiện tại</label>
                    <p className="text-sm text-gray-600">{selectedComplaint.response}</p>
                  </div>
                )}
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium">Phản hồi mới</label>
                <Textarea
                  placeholder="Nhập phản hồi cho khiếu nại này..."
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedComplaint(null)}>
              Đóng
            </Button>
            <Button className="bg-rose-600 hover:bg-rose-700">Gửi Phản Hồi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
