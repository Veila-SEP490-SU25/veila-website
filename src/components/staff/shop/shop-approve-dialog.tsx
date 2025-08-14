"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useStaffHandleCreateShopMutation } from "@/services/apis";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { CheckCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ShopApproveDialogProps {
  shopId: string;
  onChange: () => Promise<void>;
}

export const ShopApproveDialog = ({
  shopId,
  onChange,
}: ShopApproveDialogProps) => {
  const [open, setOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const [handleCreateShop, { isLoading }] = useStaffHandleCreateShopMutation();

  const handleSubmit = async (isApproved: boolean) => {
    try {
      const { statusCode, message } = await handleCreateShop({
        id: shopId,
        isApproved,
        rejectReason: isApproved ? null : rejectReason,
      }).unwrap();
      if (statusCode === 200) {
        toast.success("Xử lý yêu cầu thành công.");
        setOpen(false);
        onChange();
      } else {
        toast.error("Đã có lỗi xảy ra khi xử lý yêu cầu.", {
          description: message,
        });
      }
    } catch (error) {
      toast.error("Đã có lỗi xảy ra khi xử lý yêu cầu.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-rose-600">
          <CheckCircle className="h-4 w-4 mr-2" />
          Phê duyệt
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[90vw] max-w-[90vw] md:max-w-4xl p-0 overflow-hidden border-0">
        <DialogHeader className="bg-rose-200 p-4 text-left">
          <DialogTitle className="text-lg md:text-2xl">
            Xác nhận duyệt cửa hàng
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Input
            placeholder="Nhập lý do từ chối (nếu có)"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <div className="flex justify-center p-4">
            <Button
              variant="outline"
              onClick={() => handleSubmit(false)}
              disabled={isLoading}
            >
              Từ chối
            </Button>
            <Button
              className="ml-2"
              onClick={() => handleSubmit(true)}
              disabled={isLoading}
            >
              Duyệt
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
