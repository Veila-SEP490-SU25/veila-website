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
  Edit,
  Trash2,
  Plus,
  Calendar,
  User,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react"

const blogs = [
  {
    id: 1,
    title: "10 Xu Hướng Váy Cưới 2024",
    author: "Nguyễn Thị Mai",
    authorEmail: "mai@veila.com",
    status: "published",
    publishDate: "2024-01-15",
    views: 1250,
    excerpt: "Khám phá những xu hướng váy cưới hot nhất năm 2024 từ các nhà thiết kế hàng đầu...",
    category: "Xu hướng",
    featured: true,
  },
  {
    id: 2,
    title: "Cách Chọn Váy Cưới Phù Hợp Với Dáng Người",
    author: "Lê Thị Hương",
    authorEmail: "huong@veila.com",
    status: "draft",
    publishDate: null,
    views: 0,
    excerpt: "Hướng dẫn chi tiết cách chọn váy cưới phù hợp với từng dáng người để tôn lên vẻ đẹp tự nhiên...",
    category: "Hướng dẫn",
    featured: false,
  },
  {
    id: 3,
    title: "Bí Quyết Chăm Sóc Váy Cưới",
    author: "Trần Văn Nam",
    authorEmail: "nam@veila.com",
    status: "review",
    publishDate: null,
    views: 0,
    excerpt: "Những tips quan trọng để bảo quản và chăm sóc váy cưới luôn như mới...",
    category: "Chăm sóc",
    featured: false,
  },
  {
    id: 4,
    title: "Top 5 Nhà Thiết Kế Váy Cưới Nổi Tiếng",
    author: "Phạm Thị Lan",
    authorEmail: "lan@veila.com",
    status: "published",
    publishDate: "2024-01-10",
    views: 890,
    excerpt: "Giới thiệu về những nhà thiết kế váy cưới nổi tiếng nhất hiện nay...",
    category: "Nhà thiết kế",
    featured: false,
  },
]

export default function BlogsManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedBlog, setSelectedBlog] = useState<any>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      published: { label: "Đã xuất bản", className: "bg-green-100 text-green-700", icon: CheckCircle },
      draft: { label: "Bản nháp", className: "bg-gray-100 text-gray-700", icon: Clock },
      review: { label: "Chờ duyệt", className: "bg-yellow-100 text-yellow-700", icon: Clock },
      rejected: { label: "Từ chối", className: "bg-red-100 text-red-700", icon: XCircle },
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

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.category.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || blog.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản Lý Blog</h1>
          <p className="text-gray-600 mt-2">Quản lý nội dung blog và bài viết của hệ thống</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setShowCreateDialog(true)} className="bg-rose-600 hover:bg-rose-700">
            <Plus className="h-4 w-4 mr-2" />
            Tạo Bài Viết
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng Bài Viết</p>
                <p className="text-2xl font-bold text-gray-900">{blogs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đã Xuất Bản</p>
                <p className="text-2xl font-bold text-green-600">
                  {blogs.filter((b) => b.status === "published").length}
                </p>
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
                  {blogs.filter((b) => b.status === "review").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Bản Nháp</p>
                <p className="text-2xl font-bold text-gray-600">{blogs.filter((b) => b.status === "draft").length}</p>
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
                placeholder="Tìm kiếm bài viết, tác giả, danh mục..."
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
                <SelectItem value="published">Đã xuất bản</SelectItem>
                <SelectItem value="draft">Bản nháp</SelectItem>
                <SelectItem value="review">Chờ duyệt</SelectItem>
                <SelectItem value="rejected">Từ chối</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Blogs List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Bài Viết ({filteredBlogs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredBlogs.map((blog) => (
              <div key={blog.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-lg">{blog.title}</h3>
                      {blog.featured && <Badge className="bg-purple-100 text-purple-700">Nổi bật</Badge>}
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{blog.excerpt}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{blog.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {blog.publishDate ? new Date(blog.publishDate).toLocaleDateString("vi-VN") : "Chưa xuất bản"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{blog.views} lượt xem</span>
                      </div>
                      <Badge variant="outline">{blog.category}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(blog.status)}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedBlog(blog)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        {blog.status === "review" && (
                          <>
                            <DropdownMenuItem>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Phê duyệt
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <XCircle className="h-4 w-4 mr-2" />
                              Từ chối
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Blog Detail Dialog */}
      <Dialog open={!!selectedBlog} onOpenChange={() => setSelectedBlog(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Chi Tiết Bài Viết</DialogTitle>
            <DialogDescription>Thông tin chi tiết về bài viết {selectedBlog?.title}</DialogDescription>
          </DialogHeader>
          {selectedBlog && (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Tiêu đề</label>
                  <p className="text-sm text-gray-600">{selectedBlog.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Tác giả</label>
                  <p className="text-sm text-gray-600">{selectedBlog.author}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Danh mục</label>
                  <p className="text-sm text-gray-600">{selectedBlog.category}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Trạng thái</label>
                  <div className="mt-1">{getStatusBadge(selectedBlog.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium">Ngày xuất bản</label>
                  <p className="text-sm text-gray-600">
                    {selectedBlog.publishDate
                      ? new Date(selectedBlog.publishDate).toLocaleDateString("vi-VN")
                      : "Chưa xuất bản"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Lượt xem</label>
                  <p className="text-sm text-gray-600">{selectedBlog.views}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium">Tóm tắt</label>
                  <p className="text-sm text-gray-600">{selectedBlog.excerpt}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedBlog(null)}>
              Đóng
            </Button>
            <Button className="bg-rose-600 hover:bg-rose-700">Chỉnh Sửa</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Blog Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tạo Bài Viết Mới</DialogTitle>
            <DialogDescription>Tạo một bài viết blog mới cho hệ thống</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Tiêu đề *</label>
              <Input placeholder="Nhập tiêu đề bài viết" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Danh mục *</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trend">Xu hướng</SelectItem>
                    <SelectItem value="guide">Hướng dẫn</SelectItem>
                    <SelectItem value="care">Chăm sóc</SelectItem>
                    <SelectItem value="designer">Nhà thiết kế</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Tác giả *</label>
                <Input placeholder="Tên tác giả" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Tóm tắt *</label>
              <Textarea placeholder="Nhập tóm tắt bài viết" rows={3} />
            </div>
            <div>
              <label className="text-sm font-medium">Nội dung *</label>
              <Textarea placeholder="Nhập nội dung bài viết" rows={6} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Hủy
            </Button>
            <Button className="bg-rose-600 hover:bg-rose-700">Tạo Bài Viết</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
