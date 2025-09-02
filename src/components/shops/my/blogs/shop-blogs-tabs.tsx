"use client";

import { LoadingItem } from "@/components/loading-item";
import { PagingComponent } from "@/components/paging-component";
import { CreateBlogDialog } from "@/components/shops/my/blogs/create-blog-dialog";
import { DeleteBlogDialog } from "@/components/shops/my/blogs/delete-blog-dialog";
import { BlogDetailDialog } from "@/components/shops/my/blogs/blog-detail-dialog";
import { UpdateBlogDialog } from "@/components/shops/my/blogs/update-blog-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  IBlog,
  BlogStatus,
  blogStatusColors,
  blogStatusLabels,
} from "@/services/types";
import {
  useLazyGetMyShopBlogsQuery,
  useUpdateBlogMutation,
} from "@/services/apis";
import { usePaging } from "@/providers/paging.provider";
import { useDebounce } from "@/hooks/use-debounce";
import {
  CheckCircle,
  Edit,
  FileText,
  MoreHorizontal,
  Search,
  Trash2,
  Loader2,
  Calendar,
  XCircle,
  AlertCircleIcon,
  Eye,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";

export const ShopBlogsTabs = () => {
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [trigger, { isLoading }] = useLazyGetMyShopBlogsQuery();
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [updateTrigger, setUpdateTrigger] = useState<number>(0);

  const debouncedSearchTerm = useDebounce<string>(searchTerm, 300);
  const { setPaging, pageSize, pageIndex, resetPaging } = usePaging();

  const fetchBlogs = useCallback(async () => {
    try {
      let filter = "";
      if (debouncedSearchTerm) {
        filter += `title:like:${debouncedSearchTerm}`;
      }
      if (statusFilter !== "ALL") {
        if (filter) filter += ",";
        filter += `status:eq:${statusFilter}`;
      }

      const { statusCode, message, items, ...paging } = await trigger({
        filter: filter,
        sort: `createdAt:desc`,
        page: pageIndex,
        size: pageSize,
      }).unwrap();
      if (statusCode === 200) {
        setBlogs(items);
        setPaging(
          paging.pageIndex,
          paging.pageSize,
          paging.totalItems,
          paging.totalPages,
          paging.hasNextPage,
          paging.hasPrevPage
        );
      } else {
        setIsError(true);
        setError(message);
      }
    } catch {
      toast.error("Đã xảy ra lỗi khi tải dữ liệu blog của cửa hàng");
    }
  }, [
    debouncedSearchTerm,
    statusFilter,
    pageIndex,
    pageSize,
    setPaging,
    setIsError,
    setError,
    trigger,
  ]);

  const handleStatusUpdate = useCallback(
    async (blogId: string, newStatus: string, blog: IBlog) => {
      try {
        const { statusCode, message } = await updateBlog({
          id: blogId,
          data: {
            categoryId: blog.categoryId || "",
            title: blog.title,
            content: blog.content,
            images: blog.images || "",
            status: newStatus as BlogStatus,
          },
        }).unwrap();
        if (statusCode === 200) {
          // Force update state ngay lập tức
          setBlogs((prevBlogs) => {
            const updatedBlogs = prevBlogs.map((b) =>
              b.id === blogId ? { ...b, status: newStatus as BlogStatus } : b
            );
            console.log("🔄 Updating blog status:", {
              blogId,
              newStatus,
              updatedBlogs,
            });
            return updatedBlogs;
          });

          // Force re-render bằng cách trigger update
          setUpdateTrigger((prev) => prev + 1);

          toast.success("Cập nhật trạng thái blog thành công!");
        } else {
          toast.error(message || "Có lỗi xảy ra khi cập nhật trạng thái");
        }
      } catch {
        toast.error("Có lỗi xảy ra khi cập nhật trạng thái blog");
      }
    },
    [updateBlog]
  );

  useEffect(() => {
    resetPaging();
    fetchBlogs();
  }, [debouncedSearchTerm, resetPaging, fetchBlogs]);

  useEffect(() => {
    fetchBlogs();
  }, [debouncedSearchTerm, pageIndex, pageSize, fetchBlogs]);

  // Debug: Log khi blogs state thay đổi
  useEffect(() => {
    console.log("🔄 Blogs state updated:", blogs);
  }, [blogs]);

  // Debug: Log khi updateTrigger thay đổi
  useEffect(() => {
    console.log("🔄 Update trigger changed:", updateTrigger);
  }, [updateTrigger]);

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 items-center justify-between space-x-2">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm blog..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                  disabled={isLoading}
                />
                {isLoading && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-rose-600"></div>
                  </div>
                )}
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                  <SelectItem value="DRAFT">Bản nháp</SelectItem>
                  <SelectItem value="PUBLISHED">Đã xuất bản</SelectItem>
                  <SelectItem value="UNPUBLISHED">Chưa xuất bản</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <CreateBlogDialog onSuccess={fetchBlogs} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <LoadingItem />
        ) : isError ? (
          <Alert variant={"destructive"} className="mb-4 h-full">
            <AlertCircleIcon />
            <AlertTitle>
              Đã có lỗi xảy ra trong quá trình lấy dữ liệu
            </AlertTitle>
            <AlertDescription>
              <p>Chi tiết lỗi:</p>
              <ul className="list-inside list-disc text-sm">
                <li>{error}</li>
              </ul>
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Blog</TableHead>
                    <TableHead className="w-[400px]">Nội dung</TableHead>
                    <TableHead className="w-[120px]">Trạng thái</TableHead>
                    <TableHead className="w-[120px]">Ngày tạo</TableHead>
                    <TableHead className="w-[100px]">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blogs.map((blog) => (
                    <TableRow key={blog.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            {blog.images ? (
                              <Image
                                src={blog.images.split(",")[0]}
                                alt={blog.title}
                                width={40}
                                height={40}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                            ) : (
                              <FileText className="h-5 w-5 text-gray-500" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {blog.title}
                            </p>
                            <Badge
                              className={
                                blogStatusColors[
                                  blog.status as keyof typeof blogStatusColors
                                ]
                              }
                            >
                              {
                                blogStatusLabels[
                                  blog.status as keyof typeof blogStatusLabels
                                ]
                              }
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="w-[400px]">
                        <div className="max-w-[380px]">
                          <p className="text-sm text-gray-600 line-clamp-2 break-words overflow-wrap-anywhere">
                            {blog.content}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            blogStatusColors[
                              blog.status as keyof typeof blogStatusColors
                            ]
                          }
                        >
                          {
                            blogStatusLabels[
                              blog.status as keyof typeof blogStatusLabels
                            ]
                          }
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          {formatDate(blog.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              disabled={isLoading}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <BlogDetailDialog
                                blog={blog}
                                trigger={
                                  <Button
                                    className="flex items-center cursor-pointer w-full justify-start"
                                    variant="ghost"
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    Xem chi tiết
                                  </Button>
                                }
                              />
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <UpdateBlogDialog
                                blog={blog}
                                trigger={
                                  <Button
                                    className="flex items-center cursor-pointer w-full justify-start"
                                    variant="ghost"
                                  >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Chỉnh sửa
                                  </Button>
                                }
                                onSuccess={fetchBlogs}
                              />
                            </DropdownMenuItem>

                            {/* Status Update Options */}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusUpdate(
                                  blog.id,
                                  BlogStatus.DRAFT,
                                  blog
                                )
                              }
                              className="text-gray-600"
                              disabled={
                                isUpdating || blog.status === BlogStatus.DRAFT
                              }
                            >
                              {isUpdating ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <FileText className="h-4 w-4 mr-2" />
                              )}
                              Chuyển về bản nháp
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusUpdate(
                                  blog.id,
                                  BlogStatus.PUBLISHED,
                                  blog
                                )
                              }
                              className="text-green-600"
                              disabled={
                                isUpdating ||
                                blog.status === BlogStatus.PUBLISHED
                              }
                            >
                              {isUpdating ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <CheckCircle className="h-4 w-4 mr-2" />
                              )}
                              Xuất bản blog
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusUpdate(
                                  blog.id,
                                  BlogStatus.UNPUBLISHED,
                                  blog
                                )
                              }
                              className="text-red-600"
                              disabled={
                                isUpdating ||
                                blog.status === BlogStatus.UNPUBLISHED
                              }
                            >
                              {isUpdating ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <XCircle className="h-4 w-4 mr-2" />
                              )}
                              Ẩn blog
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <DeleteBlogDialog
                                blog={blog}
                                onSuccess={fetchBlogs}
                                trigger={
                                  <Button
                                    variant="ghost"
                                    className="flex items-center cursor-pointer w-full text-red-600 justify-start"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Xóa
                                  </Button>
                                }
                              />
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <PagingComponent />
          </>
        )}
      </CardContent>
    </Card>
  );
};
