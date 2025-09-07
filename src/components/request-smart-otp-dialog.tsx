"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { useRequestSmartOtpMutation } from "@/services/apis";
import { Check, Loader2, X } from "lucide-react";
import { useState } from "react";

interface RequestSmartOtpDialogProps {
  message: string;
  trigger: React.ReactNode;
  onConfirm: (smartOtp: string) => Promise<boolean>;
}

export const RequestSmartOtpDialog = ({
  message,
  trigger,
  onConfirm,
}: RequestSmartOtpDialogProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [walletPin, setWalletPin] = useState<string>("");
  const [requestOtp, { isLoading }] = useRequestSmartOtpMutation();
  const [, setIsError] = useState<boolean>(false);
  const [, setError] = useState<string>("");

  const handleCancel = () => {
    setWalletPin("");
    setIsError(false);
    setError("");
    setOpen(false);
  };

  const handleRequestSmartOtp = async () => {
    try {
      const { statusCode, message, item } = await requestOtp(
        walletPin
      ).unwrap();
      if ([200, 201, 202, 204].includes(statusCode)) {
        setOpen(false);
        const confirmed = await onConfirm(item);
        if (confirmed) {
          setWalletPin("");
          handleCancel();
        }
      } else {
        setIsError(true);
        setError(message || "Có lỗi xảy ra, vui lòng thử lại sau");
      }
    } catch (error) {
      setIsError(true);
      setError("Có lỗi xảy ra, vui lòng thử lại sau");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xác thực mã PIN</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <div className="space-x-2">
          <Label>Mã PIN</Label>
          <InputOTP
            maxLength={6}
            value={walletPin}
            onChange={(value) => setWalletPin(value)}
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
            onClick={handleRequestSmartOtp}
            disabled={isLoading || walletPin.length < 6}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang xác thực...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Xác thực
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
