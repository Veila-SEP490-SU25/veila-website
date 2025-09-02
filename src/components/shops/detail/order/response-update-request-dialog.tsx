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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { isSuccess } from "@/lib/utils";
import {
  useApproveUpdateRequestMutation,
  useStaffHandleCreateShopMutation,
} from "@/services/apis";
import { IShop, IUpdateRequest, UpdateRequestStatus } from "@/services/types";
import { Check, X } from "lucide-react";
import { ReactNode, useCallback, useState } from "react";
import { toast } from "sonner";

interface ResponseUpdateRequestDialogProps {
  requestId: string;
  updateRequest: IUpdateRequest;
  onUpdate?: () => void;
  trigger?: ReactNode;
}

export const ResponseUpdateRequestDialog = ({
  requestId,
  updateRequest,
  onUpdate,
  trigger,
}: ResponseUpdateRequestDialogProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [verifyTrigger, { isLoading }] = useApproveUpdateRequestMutation();
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [amount, setAmount] = useState<number>(0);

  const handleConfirm = useCallback(async () => {
    if (!isApproved && amount <= 0) {
      toast.error("Vui lòng nhập số tiền");
      return;
    }

    try {
      const { message, statusCode } = await verifyTrigger({
        requestId: requestId,
        updateRequestId: updateRequest.id,
        status: isApproved
          ? UpdateRequestStatus.ACCEPTED
          : UpdateRequestStatus.REJECTED,
        price: amount,
      }).unwrap();
      if (isSuccess(statusCode)) {
        toast.success("Phê duyệt yêu cầu chỉnh sửa thành công");
        onUpdate?.();
        setOpen(false);
      } else {
        toast.error("Phê duyệt yêu cầu chỉnh sửa thất bại", {
          description: message,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Đã xảy ra lỗi khi phê duyệt yêu cầu chỉnh sửa", {
        description: "Vui lòng thử lại sau",
      });
    }
  }, [isApproved, updateRequest, requestId, amount, verifyTrigger, onUpdate]);

  const resetForm = useCallback(() => {
    setIsApproved(false);
    setAmount(0);
  }, [setIsApproved, setAmount]);

  const handleCancel = useCallback(() => {
    resetForm();
    setOpen(false);
  }, [resetForm]);

  const handleSwitch = useCallback(
    (value: boolean) => {
      setIsApproved(value);
      if (!value) setAmount(0);
    },
    [setIsApproved]
  );

  const defaultTrigger = (
    <Button className="flex items-center justify-start gap-2" variant="outline">
      <Check className="size-4" />
      Xác thực
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="w-lg max-w[90xw] flex flex-col items-center gap-2">
        <DialogHeader className="text-center">
          <DialogTitle className="w-full text-center">
            Phê duyệt yêu cầu chỉnh sửa
          </DialogTitle>
          <DialogDescription className="w-full text-center">
            Xác nhận phê duyệt yêu cầu chỉnh sửa
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 items-center gap-4 px-8 w-full py-4">
          <div className="flex items-center justify-between w-full">
            <Label htmlFor="is-approved">Phê duyệt</Label>
            <Switch
              id="is-approved"
              checked={isApproved}
              onCheckedChange={handleSwitch}
            />
          </div>
          <div className="w-full space-y-2">
            <Label htmlFor="reject-reason" className="flex items-start gap-1">
              Giá tiền{" "}
              {!isApproved && <span className="text-red-500 text-xs">*</span>}
            </Label>
            <Input
              id="reject-reason"
              className="w-full border border-gray-300 rounded-md p-2"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="Nhập số tiền"
              type="number"
              disabled={!isApproved}
            />
          </div>
        </div>
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
