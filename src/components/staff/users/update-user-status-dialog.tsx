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
import { IUpdateUser, useUpdateUserMutation } from "@/services/apis";
import { IUser, UserStatus } from "@/services/types";
import { X, Check } from "lucide-react";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface UpdateUserStatusDialogProps {
  user: IUser;
  status: UserStatus;
  onUpdate: () => void;
  children?: ReactNode;
  title: string;
  description: string;
  successMessage: string;
}

export const UpdateUserStatusDialog = ({
  user,
  status,
  onUpdate,
  title,
  description,
  successMessage,
  children,
}: UpdateUserStatusDialogProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [trigger, { isLoading }] = useUpdateUserMutation();
  const [updateInfo, setUpdateInfo] = useState<IUpdateUser>({
    email: user.email,
    firstName: user.firstName,
    id: user.id,
    lastName: user.lastName,
    isIdentified: user.isIdentified || false,
    isVerified: user.isVerified || false,
    role: user.role,
    status: status,
    username: user.username,
  });

  const handleConfirm = useCallback(async () => {
    try {
      const { statusCode, message } = await trigger(updateInfo).unwrap();
      if (isSuccess(statusCode)) {
        toast.success(successMessage);
        setOpen(false);
        onUpdate();
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi cập nhật trạng thái giao dịch");
    }
  }, [trigger, user, status, onUpdate, updateInfo]);

  const defaultTrigger = (
    <Button variant="outline" onClick={() => setOpen(true)}>
      Cập nhật
    </Button>
  );

  useEffect(() => {
    setUpdateInfo({
      email: user.email,
      firstName: user.firstName,
      id: user.id,
      lastName: user.lastName,
      isIdentified: user.isIdentified || false,
      isVerified: user.isVerified || false,
      role: user.role,
      status: status,
      username: user.username,
    });
  }, [user, open, setUpdateInfo]);

  const handleCancel = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children || defaultTrigger}</DialogTrigger>
      <DialogContent className="w-lg max-w[90xw] flex flex-col items-center gap-2">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogDescription className="p-9 text-center">
          <p>{description}</p>
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
