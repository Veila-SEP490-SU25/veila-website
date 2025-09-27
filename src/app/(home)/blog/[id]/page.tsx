'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useLazyGetPublicBlogByIdQuery } from '@/services/apis/blog.api';
import { IBlog, BlogStatus } from '@/services/types';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import { ArrowLeft, Calendar, User, Share2, BookOpen, CheckCircle, Clock, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import 'highlight.js/styles/github.css';
import { ImageGallery } from '@/components/image-gallery';
import { getImages } from '@/lib/products-utils';

export default function BlogDetailPage() {
  const router = useRouter();
  const params = useParams();
  const blogId = params.id as string;

  const [trigger, { data, isLoading, error }] = useLazyGetPublicBlogByIdQuery();
  const [blog, setBlog] = useState<IBlog | null>(null);

  useEffect(() => {
    if (blogId) {
      trigger(blogId);
    }
  }, [trigger, blogId]);

  useEffect(() => {
    if (data?.item) {
      setBlog(data.item);
    }
  }, [data]);

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: BlogStatus) => {
    switch (status) {
      case BlogStatus.PUBLISHED:
        return 'bg-green-100 text-green-800 border-green-200';
      case BlogStatus.DRAFT:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case BlogStatus.UNPUBLISHED:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: BlogStatus) => {
    switch (status) {
      case BlogStatus.PUBLISHED:
        return 'Đã xuất bản';
      case BlogStatus.DRAFT:
        return 'Bản nháp';
      case BlogStatus.UNPUBLISHED:
        return 'Chưa xuất bản';
      default:
        return status;
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog?.title,
          text: `Đọc blog "${blog?.title}" trên Veila`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You can add a toast notification here
    }
  };

  const LoadingSkeleton = () => (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="h-12 w-full mb-4" />
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-20" />
        </div>
        <Skeleton className="h-64 w-full mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-red-500 mb-4">Có lỗi xảy ra khi tải blog này</p>
            <Button onClick={() => router.push('/blog')}>Quay lại danh sách blog</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Không tìm thấy blog này</p>
            <Button onClick={() => router.push('/blog')}>Quay lại danh sách blog</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Navigation */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/blog')}
            className="hover:bg-pink-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại danh sách blog
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Blog Header */}
          <Card className="mb-8 border-pink-200 shadow-lg">
            <CardContent className="p-8">
              {/* Status and Meta */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <Badge className={cn('text-sm', getStatusColor(blog.status))}>
                  {getStatusText(blog.status)}
                </Badge>
                {blog.isVerified && (
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Đã xác thực
                  </Badge>
                )}
                {blog.categoryId && (
                  <Badge variant="outline" className="border-purple-200 text-purple-700">
                    <Tag className="h-3 w-3 mr-1" />
                    {blog.categoryId}
                  </Badge>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                {blog.title}
              </h1>

              {/* Author and Date */}
              <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <span className="font-medium">Tác giả</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>{formatDate(blog.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>{Math.ceil((blog.content?.length || 0) / 1000)} phút đọc</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <Button onClick={handleShare} variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Chia sẻ
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Blog Content */}
          <Card className="border-pink-200 shadow-lg">
            <CardContent className="p-8">
              <ImageGallery images={getImages(blog.images)} alt="img" />
              <div className="prose prose-lg prose-pink max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw, rehypeHighlight]}
                  components={{
                    // Custom components for better styling
                    h1: ({ children }) => (
                      <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4 border-b border-pink-200 pb-2">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-3">{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-xl font-semibold text-gray-800 mt-5 mb-2">{children}</h3>
                    ),
                    p: ({ children }) => (
                      <p className="text-gray-700 leading-relaxed mb-4">{children}</p>
                    ),
                    img: ({ src, alt }) => (
                      <div className="my-6">
                        <Image
                          src={(src as string) || ''}
                          alt={alt || ''}
                          width={800}
                          height={400}
                          className="w-full rounded-lg shadow-md"
                        />
                        {alt && (
                          <p className="text-center text-sm text-gray-500 mt-2 italic">{alt}</p>
                        )}
                      </div>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-pink-300 pl-4 my-6 italic text-gray-700 bg-pink-50 py-2 rounded-r">
                        {children}
                      </blockquote>
                    ),
                    code: ({ children, className }) => {
                      const isInline = !className;
                      return isInline ? (
                        <code className="bg-gray-100 text-pink-600 px-1 py-0.5 rounded text-sm">
                          {children}
                        </code>
                      ) : (
                        <code className={className}>{children}</code>
                      );
                    },
                    pre: ({ children }) => (
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-6">
                        {children}
                      </pre>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside mb-4 text-gray-700">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside mb-4 text-gray-700">{children}</ol>
                    ),
                    li: ({ children }) => <li className="mb-1">{children}</li>,
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        className="text-pink-600 hover:text-pink-800 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {children}
                      </a>
                    ),
                  }}
                >
                  {blog.content || 'Nội dung blog đang được cập nhật...'}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>

          {/* Author Info */}
          <Card className="mt-8 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <User className="h-5 w-5" />
                Về tác giả
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  T
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-gray-900 mb-1">Tác giả</h4>
                  <p className="text-gray-600">Thành viên của Veila</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Actions */}
          <div className="mt-8 text-center">
            <Button
              onClick={() => router.push('/blog')}
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Khám phá thêm blog khác
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
