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
import { useCreateBlogMutation } from "@/services/apis";
import { ICreateBlog, BlogStatus } from "@/services/types";
import { Plus, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CreateBlogDialogProps {
  onSuccess: () => void;
  trigger?: React.ReactNode;
}

export const CreateBlogDialog = ({
  onSuccess,
  trigger,
}: CreateBlogDialogProps) => {
  const [open, setOpen] = useState(false);
  const [createBlog, { isLoading }] = useCreateBlogMutation();
  const [blogData, setBlogData] = useState<ICreateBlog>({
    categoryId: "",
    title: "",
    content: "",
    images: "",
    status: BlogStatus.DRAFT,
  });

  const handleInputChange = (
    field: keyof ICreateBlog,
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
      const { statusCode, message } = await createBlog(blogData).unwrap();
      if (statusCode === 200) {
        toast.success("Tạo blog thành công!");
        setOpen(false);
        setBlogData({
          categoryId: "",
          title: "",
          content: "",
          images: "",
          status: BlogStatus.DRAFT,
        });
        onSuccess();
      } else {
        toast.error(message || "Có lỗi xảy ra khi tạo blog");
      }
    } catch {
      toast.error("Có lỗi xảy ra khi tạo blog");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Tạo blog mới
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-[90vw] max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo blog mới</DialogTitle>
          <DialogDescription>
            Tạo bài viết mới để chia sẻ với khách hàng
          </DialogDescription>
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
                    <Plus className="h-4 w-4 mr-2" />
                    Tải lên ảnh
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
                Đang tạo...
              </>
            ) : (
              "Tạo blog"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
