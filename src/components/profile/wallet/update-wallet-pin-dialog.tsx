"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { useUpdateWalletPINMutation } from "@/services/apis";
import { IUpdateWalletPIN } from "@/services/types";
import { Loader2, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface UpdateWalletPINDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
}

export const UpdateWalletPINDialog = ({
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
  onSuccess,
}: UpdateWalletPINDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalOnOpenChange || setInternalOpen;
  const [updateWalletPIN, { isLoading }] = useUpdateWalletPINMutation();

  const [pinData, setPinData] = useState<IUpdateWalletPIN>({
    oldPin: "",
    pin: "",
  });

  const handleInputChange = (field: keyof IUpdateWalletPIN, value: any) => {
    setPinData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setPinData({
      oldPin: "",
      pin: "",
    });
  };

  const handleCancel = () => {
    setOpen(false);
    resetForm();
  };

  useEffect(() => {
    if (open) resetForm();
  }, [open]);

  const handleSubmit = async () => {
    try {
      const { statusCode, message } = await updateWalletPIN(pinData).unwrap();
      if ([200, 201, 204, 203].includes(statusCode)) {
        toast.success("Cập nhật mật khẩu ví thành công!");
        setOpen(false);
        resetForm();
        onSuccess?.();
      } else {
        toast.error(message || "Có lỗi xảy ra khi cập nhật thông tin ví");
      }
    } catch {
      toast.error("Có lỗi xảy ra khi cập nhật thông tin ví");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="min-w-xl md:min-w-xl max-w-[90vw] md:max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Chập nhật mã PIN</DialogTitle>
          <DialogDescription>Cập nhật mã PIN cho ví của bạn</DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-2">
          <Label>Mã PIN cũ *</Label>
          <InputOTP
            maxLength={6}
            value={pinData.oldPin}
            onChange={(value) => handleInputChange("oldPin", value)}
            className="gap-2"
            type="password"
          >
            <InputOTPGroup>
              <InputOTPSlot
                index={0}
                className="w-12 h-12 text-lg font-bold border-2 focus:border-rose-500"
                type="password"
              />
              <InputOTPSlot
                index={1}
                className="w-12 h-12 text-lg font-bold border-2 focus:border-rose-500"
                type="password"
              />
              <InputOTPSlot
                index={2}
                className="w-12 h-12 text-lg font-bold border-2 focus:border-rose-500"
                type="password"
              />
              <InputOTPSlot
                index={3}
                className="w-12 h-12 text-lg font-bold border-2 focus:border-rose-500"
                type="password"
              />
              <InputOTPSlot
                index={4}
                className="w-12 h-12 text-lg font-bold border-2 focus:border-rose-500"
                type="password"
              />
              <InputOTPSlot
                index={5}
                className="w-12 h-12 text-lg font-bold border-2 focus:border-rose-500"
                type="password"
              />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <div className="mt-4 space-y-2">
          <Label>Mã PIN mới *</Label>
          <InputOTP
            maxLength={6}
            value={pinData.pin}
            onChange={(value) => handleInputChange("pin", value)}
            className="gap-2"
            type="password"
          >
            <InputOTPGroup>
              <InputOTPSlot
                index={0}
                className="w-12 h-12 text-lg font-bold border-2 focus:border-rose-500"
                type="password"
              />
              <InputOTPSlot
                index={1}
                className="w-12 h-12 text-lg font-bold border-2 focus:border-rose-500"
                type="password"
              />
              <InputOTPSlot
                index={2}
                className="w-12 h-12 text-lg font-bold border-2 focus:border-rose-500"
                type="password"
              />
              <InputOTPSlot
                index={3}
                className="w-12 h-12 text-lg font-bold border-2 focus:border-rose-500"
                type="password"
              />
              <InputOTPSlot
                index={4}
                className="w-12 h-12 text-lg font-bold border-2 focus:border-rose-500"
                type="password"
              />
              <InputOTPSlot
                index={5}
                className="w-12 h-12 text-lg font-bold border-2 focus:border-rose-500"
                type="password"
              />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            <X className="h-4 w-4 mr-2" />
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-rose-600 hover:bg-rose-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang cập nhật...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Cập nhật
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
