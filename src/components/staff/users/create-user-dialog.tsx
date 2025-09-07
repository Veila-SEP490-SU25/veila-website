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
import { ICreateUser, useCreateUserMutation } from "@/services/apis";
import { UserRole, UserStatus } from "@/services/types";
import { X, Check } from "lucide-react";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface CreateUserDialogProps {
  onUpdate: () => void;
  children?: ReactNode;
}

export const CreateUserDialog = ({
  onUpdate,
  children,
}: CreateUserDialogProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [trigger, { isLoading }] = useCreateUserMutation();
  const [updateInfo, setUpdateInfo] = useState<ICreateUser>({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    isIdentified: true,
    isVerified: true,
    role: UserRole.CUSTOMER,
    status: UserStatus.ACTIVE,
    username: "",
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
      toast.error("Đã xảy ra lỗi khi tạo người dùng mới");
      console.error(error);
    }
  }, [trigger, onUpdate, updateInfo]);

  const defaultTrigger = (
    <Button variant="outline" onClick={() => setOpen(true)}>
      Tạo mới
    </Button>
  );

  const handleInputChange = (field: keyof ICreateUser, value: string) => {
    setUpdateInfo((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    setUpdateInfo({
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      isIdentified: true,
      isVerified: true,
      role: UserRole.CUSTOMER,
      status: UserStatus.ACTIVE,
      username: "",
    });
  }, [open, setUpdateInfo]);

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
              <Label htmlFor="password">
                Mật khẩu<span className="text-xs text-rose-500">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                value={updateInfo.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
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
