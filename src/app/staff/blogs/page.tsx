'use client';

import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RefreshCw } from 'lucide-react';
import { IBlog } from '@/services/types';
import { usePaging } from '@/providers/paging.provider';
import { useLazyGetPublicBlogsQuery } from '@/services/apis';
import { isSuccess } from '@/lib/utils';
import { GoBackButton } from '@/components/go-back-button';
import { Button } from '@/components/ui/button';
import { LoadingItem } from '@/components/loading-item';
import { ErrorCard } from '@/components/error-card';
import { EmptyCard } from '@/components/empty-card';
import { BlogCard } from '@/components/staff/blogs/blog-card';
import { PagingComponent } from '@/components/paging-component';

export default function BlogsManagement() {
  const [filter, setFilter] = useState('all');
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const { pageSize, pageIndex, totalItems, setPaging, resetPaging } = usePaging();
  const [trigger, { isLoading }] = useLazyGetPublicBlogsQuery();
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string>('');

  const fetchBlogs = useCallback(async () => {
    try {
      const { statusCode, message, items, ...paging } = await trigger({
        sort: 'updatedAt:desc',
        page: pageIndex,
        size: pageSize,
        filter: filter === 'all' ? '' : `isVerified:eq:${filter}`,
      }).unwrap();
      if (isSuccess(statusCode)) {
        setBlogs(items);
        setPaging(
          paging.pageIndex,
          paging.pageSize,
          paging.totalItems,
          paging.totalPages,
          paging.hasNextPage,
          paging.hasPrevPage,
        );
        setIsError(false);
        setError('');
      } else {
        setIsError(true);
        setError(message);
      }
    } catch (error) {
      console.error(error);
      setIsError(true);
      setError('Đã có lỗi xảy ra khi lấy danh sách bài viết');
    }
  }, [filter, pageSize, pageIndex, trigger, setPaging]);

  useEffect(() => {
    resetPaging();
    fetchBlogs();
  }, [filter, resetPaging, fetchBlogs]);

  useEffect(() => {
    fetchBlogs();
  }, [pageSize, pageIndex, fetchBlogs]);

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="space-y-2">
              <CardTitle>Quản lý bài viết</CardTitle>
              <CardDescription>
                Hiển thị {blogs.length}/{totalItems} bài viết
              </CardDescription>
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="1">Đã duyệt</SelectItem>
                <SelectItem value="0">Chưa duyệt</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {isError ? (
            <div className="p-6 space-y-6 max-w-full">
              <Card>
                <CardHeader className="items-center justify-center">
                  <CardTitle className="text-red-500">Đã có lỗi xảy ra khi tải dữ liệu</CardTitle>
                  <CardDescription className="w-full items-center justify-center flex gap-2">
                    <GoBackButton />
                    <Button
                      className="flex items-center justify-center gap-2 bg-rose-500 text-white"
                      onClick={fetchBlogs}
                    >
                      <RefreshCw className={`size-4 ${isLoading ? 'animate-spin' : ''}`} />
                      Thử lại
                    </Button>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ErrorCard message={error} />
                </CardContent>
              </Card>
            </div>
          ) : isLoading ? (
            <div className="p-6 space-y-6 max-w-full">
              <LoadingItem />
            </div>
          ) : blogs.length === 0 ? (
            <div className="p-6 space-y-6 max-w-full">
              <EmptyCard
                message="Không có bài viết phù hợp với tìm kiếm của bạn"
                title="Không có bài viết nào"
              />
            </div>
          ) : (
            <div className="p-6 space-y-6 max-w-full">
              {blogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} onUpdate={fetchBlogs} />
              ))}
              <PagingComponent />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
