"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { useVietQR } from "@/hooks/use-vietqr";
import { IUpdateBankInfo, useUpdateBankInfoMutation } from "@/services/apis";
import { IWallet } from "@/services/types";
import { Loader2, Save, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface UpdateBankInfoDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
  wallet: IWallet;
}

export const UpdateBankInfoDialog = ({
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
  onSuccess,
  wallet,
}: UpdateBankInfoDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalOnOpenChange || setInternalOpen;
  const { banks } = useVietQR();
  const [updateBankInfo, { isLoading }] = useUpdateBankInfoMutation();

  const [bankData, setBankData] = useState<IUpdateBankInfo>({
    bankNumber: wallet.bankNumber || "",
    bin: wallet.bin || "",
  });

  const handleInputChange = (field: keyof IUpdateBankInfo, value: any) => {
    setBankData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setBankData({
      bankNumber: wallet.bankNumber || "",
      bin: wallet.bin || "",
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
      const { statusCode, message } = await updateBankInfo(bankData).unwrap();
      if ([200, 201, 204, 203].includes(statusCode)) {
        toast.success("Cập nhật thông tin ngân hàng thành công!");
        setOpen(false);
        resetForm();
        onSuccess?.();
      } else {
        toast.error(
          message || "Có lỗi xảy ra khi cập nhật thông tin ngân hàng"
        );
      }
    } catch {
      toast.error("Có lỗi xảy ra khi cập nhật thông tin ngân hàng");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="min-w-xl md:min-w-xl max-w-[90vw] md:max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Thông tin ngân hàng</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin ngân hàng của bạn
          </DialogDescription>
        </DialogHeader>
        {/* Form content goes here */}
        <Select
          value={bankData.bin}
          onValueChange={(value) => handleInputChange("bin", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn ngân hàng" />
          </SelectTrigger>
          <SelectContent align="end" className="w-xl h-2xl">
            {banks
              ? banks.map((bank) => (
                  <SelectItem key={bank.id} value={bank.bin} className="">
                    <div className="flex items-center gap-2">
                      <Image
                        src={bank.logo}
                        alt={bank.shortName}
                        width={24}
                        height={24}
                        className="w-14 h-14 object-contain"
                      />
                      <div className="flex-1 flex items-center gap-2">
                        <span className="text-lg text-gray-600 font-semibold">
                          {bank.code}
                        </span>
                        -
                        <span className="text-sm text-gray-600">
                          {bank.shortName}
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                ))
              : null}
          </SelectContent>
        </Select>
        <div className="mt-4 space-y-2">
          <Label>Số tài khoản *</Label>
          <Input
            value={bankData.bankNumber}
            onChange={(e) => handleInputChange("bankNumber", e.target.value)}
            placeholder="Nhập số tài khoản"
          />
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
