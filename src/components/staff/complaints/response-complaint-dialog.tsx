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
import { useResponseComplaintMutation } from "@/services/apis";
import { ComplaintStatus } from "@/services/types";
import { Check, X } from "lucide-react";
import { ReactNode, useCallback, useState } from "react";
import { toast } from "sonner";

interface IResponseComplaintDialogProps {
  complaintId: string;
  isApproved: ComplaintStatus.APPROVED | ComplaintStatus.REJECTED;
  onSuccess?: () => void;
  trigger?: ReactNode;
  successMessage?: string;
}

export const ResponseComplaintDialog = ({
  complaintId,
  onSuccess,
  isApproved,
  trigger,
  successMessage = "Phản hồi khiếu nại thành công",
}: IResponseComplaintDialogProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [responseTrigger, { isLoading }] = useResponseComplaintMutation();

  const handleConfirm = useCallback(async () => {
    try {
      const { statusCode, message } = await responseTrigger({
        id: complaintId,
        status: isApproved,
      }).unwrap();
      if (isSuccess(statusCode)) {
        setOpen(false);
        onSuccess?.();
        toast.success(successMessage);
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.error("Failed to respond to complaint:", error);
    }
  }, [
    complaintId,
    onSuccess,
    responseTrigger,
    setOpen,
    isApproved,
    successMessage,
  ]);

  const handleCancel = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const defaultTrigger = (
    <Button className="flex items-center justify-start gap-2">
      <Check className="size-4" />
      Xác nhận phản hồi
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="w-lg max-w[90xw] flex flex-col items-center gap-2">
        <DialogHeader>
          <DialogTitle>Phản hồi khiếu nại</DialogTitle>
        </DialogHeader>
        <DialogDescription className="p-9 text-center">
          <p>Bạn có chắc chắn muốn phản hồi khiếu nại này?</p>
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
