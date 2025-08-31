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
import { Check, Edit, X } from "lucide-react";
import { ReactNode, useCallback, useState } from "react";
import { toast } from "sonner";

interface UpdateShopStatusDialogProps {
  onConfirm: () => Promise<boolean>;
  trigger?: ReactNode;
  title?: string;
  message?: string;
  successMessage?: string;
  errorMessage?: string;
}

export const UpdateShopStatusDialog = ({
  onConfirm,
  trigger,
  title,
  message,
  successMessage,
  errorMessage,
}: UpdateShopStatusDialogProps) => {
  const [open, setOpen] = useState(false);

  const defaultTrigger = (
    <Button className="flex items-center justify-start gap-2">
      <Edit className="size-4" />
      Cập nhật trạng thái
    </Button>
  );

  const handleCancel = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const handleConfirm = useCallback(async () => {
    const result = await onConfirm();
    if (result) {
      setOpen(false);
      toast.success(successMessage || "Cập nhật trạng thái thành công");
    } else {
      toast.error(errorMessage || "Cập nhật trạng thái thất bại");
    }
  }, [onConfirm]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="w-xl max-w[90xw] flex flex-col items-center gap-2">
        <DialogHeader>
          <DialogTitle>{title || "Cập nhật trạng thái cửa hàng"}</DialogTitle>
        </DialogHeader>
        <DialogDescription className="p-9">
          {message || "Bạn có chắc chắn muốn cập nhật trạng thái cửa hàng này?"}
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
            onClick={handleConfirm}
          >
            <Check className="size-4" />
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
