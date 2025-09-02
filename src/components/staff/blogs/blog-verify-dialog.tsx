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
import { isSuccess } from "@/lib/utils";
import { useVerifyBlogMutation } from "@/services/apis";
import { IBlog } from "@/services/types";
import { Check, X } from "lucide-react";
import { ReactNode, useCallback, useState } from "react";
import { toast } from "sonner";

interface BlogVerifyDialogProps {
  blog: IBlog;
  onUpdate?: () => void;
  trigger?: ReactNode;
}

export const BlogVerifyDialog = ({
  blog,
  onUpdate,
  trigger,
}: BlogVerifyDialogProps) => {
  const [updateTrigger, { isLoading }] = useVerifyBlogMutation();
  const [open, setOpen] = useState(false);

  const defaultTrigger = (
    <Button className="flex items-center justify-start gap-2">
      <Check className="size-4" />
      Xác thực bài đăng
    </Button>
  );

  const handleVerify = useCallback(
    async (isVerified: boolean) => {
      try {
        const { message, statusCode } = await updateTrigger({
          id: blog.id,
          isVerified,
        }).unwrap();
        if (isSuccess(statusCode)) {
          toast.success("Xác thực bài đăng thành công");
          onUpdate?.();
          setOpen(false);
        } else {
          toast.error("Xác thực bài đăng thất bại", {
            description: message,
          });
        }
      } catch (error) {
        console.error(error);
        toast.error("Đã xảy ra lỗi khi xác thực bài đăng", {
          description: "Vui lòng thử lại sau",
        });
      }
    },
    [blog, setOpen, updateTrigger, onUpdate]
  );

  const handleCancel = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="w-lg max-w[90xw] flex flex-col items-center gap-2">
        <DialogHeader>
          <DialogTitle>Xác thực bài đăng</DialogTitle>
        </DialogHeader>
        <DialogDescription className="p-9 text-center">
          <p>Bạn có chắc chắn muốn xác thực bài đăng này?</p>
        </DialogDescription>
        <DialogFooter>
          <Button
            className="flex items-center justify-start gap-2"
            variant="outline"
            onClick={handleCancel}
          >
            <X className="size-4" />
            Huỷ
          </Button>
          <Button
            className="flex items-center justify-start gap-2 bg-rose-500 text-white"
            onClick={() => {
              handleVerify(true);
            }}
            disabled={isLoading}
          >
            <Check className="size-4" />
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
