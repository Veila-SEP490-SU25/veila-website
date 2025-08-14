"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLazyGetShopBlogsQuery } from "@/services/apis";
import { IBlog, IPaginationResponse } from "@/services/types";
import { BookOpen, Calendar, CheckCircle, Eye, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Props {
  id: string;
}

export const ShopBlogs: React.FC<Props> = ({ id }) => {
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [getBlogs, { isLoading }] = useLazyGetShopBlogsQuery();
  const [paging, setPaging] = useState<IPaginationResponse>({
    hasNextPage: false,
    hasPrevPage: false,
    pageIndex: 0,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  });

  const handlePageChange = (newPageIndex: number) => {
    setPaging((prev) => ({
      ...prev,
      pageIndex: newPageIndex,
    }));
  };

  const handlePageSizeChange = (newPageSize: string) => {
    const pageSize = Number.parseInt(newPageSize);
    setPaging((prev) => ({
      ...prev,
      pageSize,
      pageIndex: 0,
    }));
  };

  const fetchBlogs = async () => {
    try {
      const { statusCode, message, items, ...pagination } = await getBlogs({
        filter: "",
        id,
        page: paging.pageIndex,
        size: paging.pageSize,
        sort: "",
      }).unwrap();
      if (statusCode === 200) {
        setBlogs(items);
        setPaging((prev) => ({
          ...prev,
          hasNextPage: pagination.hasNextPage,
          hasPrevPage: pagination.hasPrevPage,
          totalItems: pagination.totalItems,
          totalPages: pagination.totalPages,
        }));
      }
    } catch (error) {}
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

  useEffect(() => {
    if (id) {
      fetchBlogs();
    }
  }, [id, paging.pageIndex, paging.pageSize]);
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:gap-4 md:justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-gray-900">Blog & Bài Viết</h2>
          {!isLoading && (
            <span className="text-sm text-gray-600">
              ({paging.totalItems} bài viết)
            </span>
          )}
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:gap-4">
          <Select
            value={paging.pageSize.toString()}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className="w-full md:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6">6 / trang</SelectItem>
              <SelectItem value="12">12 / trang</SelectItem>
              <SelectItem value="24">24 / trang</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="h-48 bg-gray-200 animate-pulse" />
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-6 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                  <div className="flex justify-between items-center pt-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
                    <div className="h-8 bg-gray-200 rounded animate-pulse w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Blogs Grid */}
      {!isLoading && blogs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => {
            return (
              <Card
                key={blog.id}
                className="group hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="relative">
                  <Image
                    src={blog.images || "/placeholder.svg"}
                    alt={blog.title}
                    width={400}
                    height={250}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 space-y-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Link href={`/blog/${blog.id}`}>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="space-y-3">
                    {/* Category */}
                    {blog.category && (
                      <Badge variant="outline" className="text-xs">
                        {blog.category.name}
                      </Badge>
                    )}

                    {/* Title */}
                    <Link href={`/blog/${blog.id}`}>
                      <h3 className="font-bold text-lg group-hover:text-rose-600 transition-colors cursor-pointer line-clamp-2">
                        {blog.title}
                      </h3>
                    </Link>

                    {/* Content Preview */}
                    <p
                      className="text-gray-600 text-sm line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: blog.content }}
                    />

                    {/* Author and Date */}
                    <div className="flex items-center gap-3 pt-2 border-t">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={blog.user.avatarUrl || "/placeholder.svg"}
                        />
                        <AvatarFallback>
                          {blog.user.shop?.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {blog.user.shop?.name}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(blog.createdAt as any)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2">
                      <Link href={`/blog/${blog.id}`} className="w-full">
                        <Button
                          variant="outline"
                          className="w-full bg-transparent hover:bg-rose-50 hover:border-rose-300"
                        >
                          <BookOpen className="h-4 w-4 mr-2" />
                          Đọc bài viết
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && blogs.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Chưa có bài viết nào
          </h3>
          <p className="text-gray-500">
            Cửa hàng này chưa có bài viết blog nào được đăng tải.
          </p>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && paging.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Trang {paging.pageIndex + 1} / {paging.totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!paging.hasPrevPage}
              onClick={() => handlePageChange(paging.pageIndex - 1)}
            >
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!paging.hasNextPage}
              onClick={() => handlePageChange(paging.pageIndex + 1)}
            >
              Sau
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
