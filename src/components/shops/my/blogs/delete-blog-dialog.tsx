'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useDeleteBlogMutation } from '@/services/apis';
import { IBlog } from '@/services/types';
import { AlertTriangle, Loader2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface DeleteBlogDialogProps {
  blog: IBlog;
  onSuccess: () => void;
  trigger: React.ReactNode;
}

export const DeleteBlogDialog = ({ blog, onSuccess, trigger }: DeleteBlogDialogProps) => {
  const [open, setOpen] = useState(false);
  const [deleteBlog, { isLoading }] = useDeleteBlogMutation();

  const handleDelete = async () => {
    try {
      const { statusCode, message } = await deleteBlog(blog.id).unwrap();
      if (statusCode === 200) {
        toast.success('Xóa blog thành công!');
        setOpen(false);
        onSuccess();
      } else {
        toast.error(message || 'Có lỗi xảy ra khi xóa blog');
      }
    } catch {
      toast.error('Có lỗi xảy ra khi xóa blog');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Xác nhận xóa blog
          </DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa blog "{blog.title}"? Hành động này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Trash2 className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-800">Blog sẽ bị xóa vĩnh viễn</h4>
                <p className="text-sm text-red-700 mt-1">
                  Tất cả dữ liệu, hình ảnh và nội dung của blog này sẽ bị mất hoàn toàn.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
            Hủy
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang xóa...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa blog
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
