"use client";

import { ErrorCard } from "@/components/error-card";
import { GoBackButton } from "@/components/go-back-button";
import { StaffNotFound } from "@/components/staff-not-found";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageLoading } from "@/components/ui/page-loading";
import { isSuccess } from "@/lib/utils";
import { useLazyGetPublicBlogByIdQuery } from "@/services/apis";
import { IBlog } from "@/services/types";
import { RefreshCw } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

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
  }, [blogId]);

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

  if (blog) return <div className="p-6 space-y-6 max-w-full">{blog.title}</div>;
}
