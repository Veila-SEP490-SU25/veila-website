"use client";

import { ErrorCard } from "@/components/error-card";
import { GoBackButton } from "@/components/go-back-button";
import { StaffNotFound } from "@/components/staff-not-found";
import { StatusBadge, VerifyBadge } from "@/components/staff/blogs/blog-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageLoading } from "@/components/ui/page-loading";
import { formatDateShort } from "@/lib/order-util";
import { isSuccess } from "@/lib/utils";
import { useLazyGetPublicBlogByIdQuery } from "@/services/apis";
import { IBlog } from "@/services/types";
import { Calendar, Check, Clock, RefreshCw, User } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import Image from "next/image";
import { BlogVerifyDialog } from "@/components/staff/blogs/blog-verify-dialog";

export default function BlogDetailPage() {
  const { blogId } = useParams() as { blogId: string };
  const [blog, setBlog] = useState<IBlog>();
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [getTrigger, { isLoading }] = useLazyGetPublicBlogByIdQuery();
  const [isNotFound, setIsNotFound] = useState<boolean>(false);

  const fetchBlog = useCallback(async () => {
    try {
      const { statusCode, message, item } = await getTrigger(blogId).unwrap();
      if (isSuccess(statusCode)) {
        setBlog(item);
        setIsError(false);
        setIsNotFound(false);
        setError("");
      } else if (statusCode === 404) {
        setIsNotFound(true);
      } else {
        setError(message);
        setIsError(true);
      }
    } catch (error) {
      console.error(error);
      setIsError(true);
      setError("Đã có lỗi xảy ra khi lấy thông tin bài viết");
    }
  }, [blogId, setBlog, setError, setIsError, setIsNotFound, getTrigger]);

  useEffect(() => {
    fetchBlog();
  }, [blogId, fetchBlog]);

  if (isNotFound)
    return (
      <div className="space-y-6 max-w-full h-full">
        <StaffNotFound />
      </div>
    );

  if (isError)
    return (
      <div className="p-6 space-y-6 max-w-full">
        <Card>
          <CardHeader className="items-center justify-center">
            <CardTitle className="text-red-500">
              Đã có lỗi xảy ra khi tải dữ liệu
            </CardTitle>
            <CardDescription>
              <GoBackButton />
              <Button
                className="flex items-center justify-center gap-2 bg-rose-500 text-white"
                onClick={fetchBlog}
              >
                <RefreshCw
                  className={`size-4 ${isLoading ? "animate-spin" : ""}`}
                />
                Thử lại
              </Button>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ErrorCard message={error} />
          </CardContent>
        </Card>
      </div>
    );

  if (isLoading)
    return (
      <div className="p-6 space-y-6 max-w-full">
        <PageLoading type="blog" />
      </div>
    );

  return (
    blog && (
      <div className="p-6 space-y-6 max-w-full">
        {/* Blog Header */}
        <Card className="mb-8 border-pink-200 shadow-lg">
          <CardContent className="p-8">
            {/* Status and Meta */}
            <div className="w-full flex items-center justify-between">
              <GoBackButton />
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <StatusBadge status={blog.status} />
                <VerifyBadge isVerified={blog.isVerified} />
              </div>
              {!blog.isVerified && (
                <BlogVerifyDialog
                  blog={blog}
                  onUpdate={fetchBlog}
                  trigger={
                    <Button
                      className="w-max flex items-center gap-2"
                      variant="outline"
                    >
                      <Check className="size-4" />
                      Phê duyệt bài viết
                    </Button>
                  }
                />
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
                <span>{formatDateShort(blog.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>
                  {Math.ceil((blog.content?.length || 0) / 1000)} phút đọc
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Blog Content */}
        <Card className="border-pink-200 shadow-lg">
          <CardContent className="p-8">
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
                    <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-3">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-semibold text-gray-800 mt-5 mb-2">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {children}
                    </p>
                  ),
                  img: ({ src, alt }) => (
                    <div className="my-6">
                      <Image
                        src={(src as string) || ""}
                        alt={alt || ""}
                        width={800}
                        height={400}
                        className="w-full rounded-lg shadow-md object-cover"
                      />
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
                    <ul className="list-disc list-inside mb-4 text-gray-700">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside mb-4 text-gray-700">
                      {children}
                    </ol>
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
                {blog.content || "Nội dung blog đang được cập nhật..."}
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
                <h4 className="font-semibold text-lg text-gray-900 mb-1">
                  Tác giả
                </h4>
                <p className="text-gray-600">Thành viên của Veila</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  );
}
