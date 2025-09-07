'use client';

import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { IBlog, blogStatusColors, blogStatusLabels } from '@/services/types';
import { Calendar, FileText, Shield, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

interface BlogDetailDialogProps {
  blog: IBlog;
  trigger: React.ReactNode;
}

export const BlogDetailDialog = ({ blog, trigger }: BlogDetailDialogProps) => {
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCoverImage = (images: string | null) => {
    if (!images) return null;
    const imageArray = images.split(',');
    return imageArray[0] || null;
  };

  const getVerificationBadge = (isVerified: boolean) => {
    return isVerified ? (
      <Badge className="bg-green-100 text-green-700">
        <ShieldCheck className="h-3 w-3 mr-1" />
        Đã được duyệt
      </Badge>
    ) : (
      <Badge className="bg-yellow-100 text-yellow-700">
        <Shield className="h-3 w-3 mr-1" />
        Chờ staff duyệt
      </Badge>
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="w-[90vw] max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{blog.title}</DialogTitle>
          <DialogDescription>Chi tiết bài viết blog của cửa hàng</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Header Section */}
          <div className="flex flex-col items-center gap-4 md:flex-row md:items-start md:gap-6">
            <div className="flex-1 w-full">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 gap-2">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 text-center">
                  {blog.title}
                </h2>
                <div className="flex items-center gap-2 flex-wrap justify-center">
                  <Badge className={blogStatusColors[blog.status as keyof typeof blogStatusColors]}>
                    {blogStatusLabels[blog.status as keyof typeof blogStatusLabels]}
                  </Badge>
                  {getVerificationBadge(blog.isVerified)}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Cover Image */}
          {getCoverImage(blog.images) && (
            <>
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">Ảnh bìa</h3>
                <div className="rounded-lg overflow-hidden border">
                  <Image
                    src={getCoverImage(blog.images) || '/placeholder.svg'}
                    alt={`${blog.title} cover`}
                    width={800}
                    height={400}
                    className="w-full h-auto object-contain max-h-[60vh]"
                  />
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Content */}
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">Nội dung</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words overflow-wrap-anywhere">
                {blog.content}
              </p>
            </div>
          </div>

          <Separator />

          {/* Additional Images */}
          {blog.images && blog.images.split(',').length > 1 && (
            <>
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                  Hình ảnh khác
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {blog.images
                    .split(',')
                    .slice(1)
                    .map((image, index) => (
                      <div key={index} className="rounded-lg overflow-hidden border">
                        <Image
                          src={image || '/placeholder.svg'}
                          alt={`${blog.title} image ${index + 2}`}
                          width={400}
                          height={300}
                          className="w-full h-24 object-cover"
                        />
                      </div>
                    ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Metadata */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            <div className="space-y-4">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Thông Tin Thời Gian
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs md:text-sm text-gray-500">Ngày tạo</p>
                  <p className="font-medium">{formatDate(blog.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-500">Cập nhật lần cuối</p>
                  <p className="font-medium">{formatDate(blog.updatedAt)}</p>
                </div>
                {blog.deletedAt && (
                  <div>
                    <p className="text-xs md:text-sm text-gray-500">Ngày xóa</p>
                    <p className="font-medium text-red-600">{formatDate(blog.deletedAt)}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Thông Tin Blog
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs md:text-sm text-gray-500">Trạng thái</p>
                  <Badge className={blogStatusColors[blog.status as keyof typeof blogStatusColors]}>
                    {blogStatusLabels[blog.status as keyof typeof blogStatusLabels]}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-500">Trạng thái duyệt</p>
                  {getVerificationBadge(blog.isVerified)}
                </div>
                {blog.categoryId && (
                  <div>
                    <p className="text-xs md:text-sm text-gray-500">Danh mục</p>
                    <p className="font-medium">{blog.categoryId}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
