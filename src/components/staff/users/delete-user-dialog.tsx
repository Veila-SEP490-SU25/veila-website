"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { isSuccess } from "@/lib/utils";
import { useDeleteUserMutation } from "@/services/apis";
import { IUser } from "@/services/types";
import { Check, Trash, X } from "lucide-react";
import { ReactNode, useCallback, useState } from "react";
import { toast } from "sonner";

interface DeleteUserDialogProps {
  user: IUser;
  onUpdate?: () => void;
  children?: ReactNode;
}

export const DeleteUserDialog = ({
  user,
  onUpdate,
  children,
}: DeleteUserDialogProps) => {
  const [trigger, { isLoading }] = useDeleteUserMutation();
  const [open, setOpen] = useState<boolean>(false);

  const handleConfirm = useCallback(async () => {
    try {
      const { statusCode, message } = await trigger(user.id).unwrap();
      if (isSuccess(statusCode)) {
        setOpen(false);
        onUpdate?.();
        toast.success(message);
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.error("Failed to respond to complaint:", error);
    }
  }, [user, onUpdate, trigger, setOpen]);

  const handleCancel = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const defaultTrigger = (
    <Button className="flex items-center justify-start gap-2">
      <Trash className="size-4" />
      Xoá người dùng
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children || defaultTrigger}</DialogTrigger>
      <DialogContent className="w-lg max-w[90xw] flex flex-col items-center gap-2">
        <DialogHeader>
          <DialogTitle>Xoá người dùng</DialogTitle>
        </DialogHeader>
        <DialogDescription className="p-9 text-center">
          <p>Bạn có chắc chắn muốn xoá người dùng này?</p>
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
