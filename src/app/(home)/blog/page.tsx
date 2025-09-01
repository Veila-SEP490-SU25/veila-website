"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLazyGetPublicBlogsQuery } from "@/services/apis";
import { IBlog } from "@/services/types";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Search,
  Calendar,
  User,
  ArrowRight,
  BookOpen,
  Grid,
  List,
  SortAsc,
  SortDesc,
  Filter,
} from "lucide-react";

export default function BlogListPage() {
  const router = useRouter();
  const [trigger, { data, isLoading, error }] = useLazyGetPublicBlogsQuery();
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const safeStatusFilter = statusFilter || "ALL";
  const pageSize = 12;

  useEffect(() => {
    const filters = [];

    if (searchTerm) {
      filters.push(`title:like:${searchTerm}`);
    }

    if (safeStatusFilter && safeStatusFilter !== "ALL") {
      filters.push(`status:eq:${safeStatusFilter}`);
    }

    trigger({
      page: currentPage,
      size: pageSize,
      filter: filters.join(","),
      sort: `${sortField}:${sortOrder}`,
    });
  }, [
    trigger,
    currentPage,
    searchTerm,
    sortField,
    sortOrder,
    safeStatusFilter,
  ]);

  useEffect(() => {
    if (data?.items) {
      setBlogs(data.items);
    }
  }, [data]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(0);
  };

  const handleSortChange = (field: string) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
    setCurrentPage(0);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(0);
  };

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const extractImageFromContent = (content?: string): string | null => {
    if (!content) return null;
    const imgMatch = content.match(/!\[.*?\]\((.*?)\)/);
    return imgMatch ? imgMatch[1] : null;
  };

  const extractExcerpt = (content?: string): string => {
    if (!content) return "Không có nội dung xem trước...";

    const textContent = content
      .replace(/!\[.*?\]\(.*?\)/g, "")
      .replace(/\[.*?\]\(.*?\)/g, "")
      .replace(/[#*`]/g, "")
      .trim();
    return textContent.length > 150
      ? textContent.substring(0, 150) + "..."
      : textContent;
  };

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="h-48 w-full" />
          <CardContent className="p-6">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-3/4 mb-4" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-20" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const BlogCard = ({ blog }: { blog: IBlog }) => {
    const image = extractImageFromContent(blog.content) || blog.images;
    const excerpt = extractExcerpt(blog.content);

    return (
      <Card className="group py-0 overflow-hidden hover:shadow-xl transition-all duration-300 border-pink-100 hover:border-pink-200">
        <div className="relative overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={blog.title}
              width={400}
              height={192}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              style={{ height: "auto" }}
            />
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
              <BookOpen className="h-16 w-16 text-pink-300" />
            </div>
          )}
          {/* <div className="absolute top-4 left-4">
            <Badge className={cn("text-xs", getStatusColor(blog.status))}>
              {getStatusText(blog.status)}
            </Badge>
          </div>
          {blog.isVerified && (
            <div className="absolute top-4 right-4">
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                Đã xác thực
              </Badge>
            </div>
          )} */}
        </div>

        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <Calendar className="h-4 w-4" />
            {formatDate(blog.createdAt)}
          </div>

          <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors">
            {blog.title}
          </h3>

          <p className="text-gray-600 mb-4 line-clamp-3">{excerpt}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <User className="h-4 w-4" />
              <span>Tác giả</span>
            </div>
            <Button
              size="sm"
              onClick={() => router.push(`/blog/${blog.id}`)}
              className="group-hover:bg-pink-600 group-hover:text-white transition-colors"
            >
              Đọc thêm
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const BlogListItem = ({ blog }: { blog: IBlog }) => {
    const image = extractImageFromContent(blog.content) || blog.images;
    const excerpt = extractExcerpt(blog.content);

    return (
      <Card className="overflow-hidden hover:shadow-lg py-0 transition-all duration-300 border-pink-100 hover:border-pink-200">
        <div className="flex">
          <div className="relative w-48 h-32  flex-shrink-0">
            {image ? (
              <Image
                src={image}
                alt={blog.title}
                width={192}
                height={128}
                className="w-full  h-full object-cover"
                style={{ height: "auto" }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-pink-300" />
              </div>
            )}
          </div>

          <CardContent className="flex-1 p-6 py-0">
            <h3 className="font-bold text-lg mb-2 hover:text-pink-600 transition-colors cursor-pointer">
              {blog.title}
            </h3>

            <p className="text-gray-600 mb-3 line-clamp-2">{excerpt}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>Tác giả</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(blog.createdAt)}
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => router.push(`/blog/${blog.id}`)}
                className="hover:bg-pink-600 hover:text-white transition-colors"
              >
                Đọc thêm
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-red-500">Có lỗi xảy ra khi tải danh sách blog</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <div className="bg-gradient-to-r from-pink-600 to-purple-600">
        <div className="container mx-auto px-4 py-16 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog Veila</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Khám phá những câu chuyện, xu hướng và kinh nghiệm về váy cưới từ
            cộng đồng Veila
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="space-y-4 mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm blog theo tiêu đề..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <Select
                  key="status-filter"
                  value={safeStatusFilter}
                  defaultValue="ALL"
                  onValueChange={handleStatusFilter}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Tất cả</SelectItem>
                    <SelectItem value="PUBLISHED">Đã xuất bản</SelectItem>
                    <SelectItem value="DRAFT">Bản nháp</SelectItem>
                    <SelectItem value="UNPUBLISHED">Chưa xuất bản</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Options */}
              <div className="flex items-center gap-1">
                <Button
                  variant={sortField === "createdAt" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSortChange("createdAt")}
                  className="text-sm"
                >
                  Ngày tạo
                  {sortField === "createdAt" &&
                    (sortOrder === "desc" ? (
                      <SortDesc className="ml-1 h-3 w-3" />
                    ) : (
                      <SortAsc className="ml-1 h-3 w-3" />
                    ))}
                </Button>
                <Button
                  variant={sortField === "title" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSortChange("title")}
                  className="text-sm"
                >
                  Tiêu đề
                  {sortField === "title" &&
                    (sortOrder === "desc" ? (
                      <SortDesc className="ml-1 h-3 w-3" />
                    ) : (
                      <SortAsc className="ml-1 h-3 w-3" />
                    ))}
                </Button>
              </div>
            </div>

            {/* View Mode */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Hiển thị:</span>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchTerm || (safeStatusFilter && safeStatusFilter !== "ALL")) && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-500">
                Bộ lọc đang áp dụng:
              </span>
              {searchTerm && (
                <Badge variant="secondary" className="gap-1">
                  Tìm kiếm: "{searchTerm}"
                  <button
                    onClick={() => handleSearch("")}
                    className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Blog Content */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : blogs.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Không tìm thấy blog nào
            </h3>
            <p className="text-gray-500">
              {searchTerm
                ? `Không có blog nào phù hợp với "${searchTerm}"`
                : "Chưa có blog nào được xuất bản"}
            </p>
          </div>
        ) : (
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog) => (
                  <BlogCard key={blog.id} blog={blog} />
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {blogs.map((blog) => (
                  <BlogListItem key={blog.id} blog={blog} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {data && data.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                >
                  Trước
                </Button>

                {Array.from({ length: Math.min(5, data.totalPages) }).map(
                  (_, i) => {
                    const pageNum =
                      Math.max(
                        0,
                        Math.min(
                          data.totalPages - 5,
                          currentPage - Math.floor(5 / 2)
                        )
                      ) + i;

                    return (
                      <Button
                        key={pageNum}
                        variant={
                          currentPage === pageNum ? "default" : "outline"
                        }
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-10"
                      >
                        {pageNum + 1}
                      </Button>
                    );
                  }
                )}

                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage(
                      Math.min(data.totalPages - 1, currentPage + 1)
                    )
                  }
                  disabled={currentPage === data.totalPages - 1}
                >
                  Sau
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
