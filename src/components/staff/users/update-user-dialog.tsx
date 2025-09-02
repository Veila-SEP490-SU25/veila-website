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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isSuccess } from "@/lib/utils";
import { IUpdateUser, useUpdateUserMutation } from "@/services/apis";
import { IUser, UserStatus } from "@/services/types";
import { X, Check } from "lucide-react";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface UpdateUserDialogProps {
  user: IUser;
  onUpdate: () => void;
  children?: ReactNode;
}

export const UpdateUserDialog = ({
  user,
  onUpdate,
  children,
}: UpdateUserDialogProps) => {
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
    status: user.status,
    username: user.username,
  });

  const handleConfirm = useCallback(async () => {
    try {
      const { statusCode, message } = await trigger(updateInfo).unwrap();
      if (isSuccess(statusCode)) {
        toast.success(message);
        setOpen(false);
        onUpdate();
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi cập nhật người dùng");
    }
  }, [trigger, user, onUpdate, updateInfo]);

  const defaultTrigger = (
    <Button variant="outline" onClick={() => setOpen(true)}>
      Cập nhật
    </Button>
  );

  const handleInputChange = (field: keyof IUpdateUser, value: string) => {
    setUpdateInfo((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    setUpdateInfo({
      email: user.email,
      firstName: user.firstName,
      id: user.id,
      lastName: user.lastName,
      isIdentified: user.isIdentified || false,
      isVerified: user.isVerified || false,
      role: user.role,
      status: user.status,
      username: user.username,
    });
  }, [user, open, setUpdateInfo]);

  const handleCancel = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children || defaultTrigger}</DialogTrigger>
      <DialogContent className="w-[90vw] max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Cập nhật người dùng</DialogTitle>
          <DialogDescription className="">
            Cập nhật thông tin người dùng
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="w-full space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">
                Tên người dùng<span className="text-xs text-rose-500">*</span>
              </Label>
              <Input
                id="username"
                value={updateInfo.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">
                Email<span className="text-xs text-rose-500">*</span>
              </Label>
              <Input
                id="email"
                value={updateInfo.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="firstName">
                Họ<span className="text-xs text-rose-500">*</span>
              </Label>
              <Input
                id="firstName"
                value={updateInfo.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">
                Tên<span className="text-xs text-rose-500">*</span>
              </Label>
              <Input
                id="lastName"
                value={updateInfo.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
              />
            </div>
            <div className="space-y-2 flex items-center justify-between">
              <Label htmlFor="role">
                Vai trò<span className="text-xs text-rose-500">*</span>
              </Label>
              <Select
                value={updateInfo.role}
                onValueChange={(e) => handleInputChange("role", e)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STAFF">Quản trị viên</SelectItem>
                  <SelectItem value="SHOP">Chủ cửa hàng</SelectItem>
                  <SelectItem value="CUSTOMER">Khách hàng</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </ScrollArea>
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
