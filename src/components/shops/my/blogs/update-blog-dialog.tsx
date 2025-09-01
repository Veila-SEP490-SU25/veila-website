"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SingleImageUploadDialog } from "@/components/upload-image-dialog";
import { useUpdateBlogMutation } from "@/services/apis";
import { IBlog, IUpdateBlog, BlogStatus } from "@/services/types";
import { Edit, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface UpdateBlogDialogProps {
  blog: IBlog;
  onSuccess: () => void;
  trigger: React.ReactNode;
}

export const UpdateBlogDialog = ({
  blog,
  onSuccess,
  trigger,
}: UpdateBlogDialogProps) => {
  const [open, setOpen] = useState(false);
  const [updateBlog, { isLoading }] = useUpdateBlogMutation();
  const [blogData, setBlogData] = useState<IUpdateBlog>({
    categoryId: "",
    title: "",
    content: "",
    images: "",
    status: BlogStatus.DRAFT,
  });

  useEffect(() => {
    if (blog) {
      setBlogData({
        categoryId: blog.categoryId || "",
        title: blog.title,
        content: blog.content,
        images: blog.images,
        status: blog.status,
      });
    }
  }, [blog]);

  const handleInputChange = (
    field: keyof IUpdateBlog,
    value: string | BlogStatus
  ) => {
    setBlogData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!blogData.title.trim()) {
      toast.error("Vui lòng nhập tiêu đề blog");
      return;
    }
    if (!blogData.content.trim()) {
      toast.error("Vui lòng nhập nội dung blog");
      return;
    }

    try {
      const { statusCode, message } = await updateBlog({
        id: blog.id,
        data: blogData,
      }).unwrap();
      if (statusCode === 200) {
        toast.success("Cập nhật blog thành công!");
        setOpen(false);
        onSuccess();
      } else {
        toast.error(message || "Có lỗi xảy ra khi cập nhật blog");
      }
    } catch {
      toast.error("Có lỗi xảy ra khi cập nhật blog");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="w-[90vw] max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa blog</DialogTitle>
          <DialogDescription>Cập nhật thông tin blog của bạn</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Thông tin cơ bản</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề blog *</Label>
                <Input
                  id="title"
                  placeholder="Nhập tiêu đề blog..."
                  value={blogData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Trạng thái</Label>
                <Select
                  value={blogData.status}
                  onValueChange={(value) =>
                    handleInputChange("status", value as BlogStatus)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={BlogStatus.DRAFT}>
                      Bản nháp (có thể chỉnh sửa)
                    </SelectItem>
                    <SelectItem value={BlogStatus.PUBLISHED}>
                      Xuất bản ngay
                    </SelectItem>
                    <SelectItem value={BlogStatus.UNPUBLISHED}>
                      Ẩn blog
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Nội dung</h3>
            <div className="space-y-2">
              <Label htmlFor="content">Nội dung blog *</Label>
              <Textarea
                id="content"
                placeholder="Viết nội dung blog của bạn..."
                value={blogData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                rows={10}
                className="resize-none"
              />
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Hình ảnh</h3>
            <div className="space-y-2">
              <Label>Ảnh bìa blog</Label>
              <SingleImageUploadDialog
                imageUrl={blogData.images || undefined}
                onImageChange={(url) => handleInputChange("images", url)}
                trigger={
                  <Button variant="outline" className="w-full">
                    <Edit className="h-4 w-4 mr-2" />
                    Thay đổi ảnh
                  </Button>
                }
                handleUpload={() => {}}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang cập nhật...
              </>
            ) : (
              "Cập nhật blog"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
