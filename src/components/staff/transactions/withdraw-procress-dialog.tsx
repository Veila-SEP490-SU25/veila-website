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
import { ScrollArea } from "@/components/ui/scroll-area";
import { useVietQR } from "@/hooks/use-vietqr";
import {
  useApproveWithdrawMutation,
  useCancelWithdrawMutation,
} from "@/services/apis";
import { ITransaction } from "@/services/types";
import { Check, X } from "lucide-react";
import Image from "next/image";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface WithdrawProcessDialogProps {
  children?: ReactNode;
  onUpdate?: () => void;
  transaction: ITransaction;
}

export const WithdrawProcessDialog = ({
  children,
  onUpdate,
  transaction,
}: WithdrawProcessDialogProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [appproveTrigger, { isLoading: isApproving }] =
    useApproveWithdrawMutation();
  const [cancelTrigger, { isLoading: isCanceling }] =
    useCancelWithdrawMutation();
  const [qr, setQR] = useState<string>("");

  const handleApprove = useCallback(async () => {
    try {
      const { statusCode, message } = await appproveTrigger(
        transaction.id
      ).unwrap();
      if (statusCode === 200) {
        toast.success(message);
        onUpdate?.();
        setOpen(false);
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error("Xảy ra lỗi khi hoàn thành giao dịch. Vui lòng thử lại sau.");
    }
  }, [transaction, appproveTrigger]);

  const handleCancel = useCallback(async () => {
    try {
      const { statusCode, message } = await cancelTrigger(
        transaction.id
      ).unwrap();
      if (statusCode === 200) {
        toast.success(message);
        onUpdate?.();
        setOpen(false);
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error("Xảy ra lỗi khi huỷ giao dịch. Vui lòng thử lại sau.");
    }
  }, [transaction, cancelTrigger]);

  const { generateQRImage } = useVietQR();

  useEffect(() => {
    const generateQR = async () => {
      if (!transaction.wallet.bin || !transaction.wallet.bankNumber) return;
      const qr = await generateQRImage(
        transaction.wallet.bin,
        transaction.wallet.bankNumber,
        transaction.amount,
        transaction.note || undefined
      );
      setQR(qr);
    };
    generateQR();
  }, [generateQRImage, transaction]);

  const defaultTrigger = <Button>Thực hiện giao dịch</Button>;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children || defaultTrigger}</DialogTrigger>
      <DialogContent className="w-[90vw] max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Thực hiện gia dịch rút tiền</DialogTitle>
          <DialogDescription>
            Thực hiện giao dịch rút tiền về tài khoản của người dùng
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] px-4">
          <Image
            src={qr}
            alt="QR Code"
            width={300}
            height={300}
            className="w-full h-auto object-cover"
          />
        </ScrollArea>
        <DialogFooter>
          <Button
            className="flex items-center justify-start gap-2"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            <X className="size-4" />
            Huỷ
          </Button>
          <Button
            className="flex items-center justify-start gap-2 bg-rose-500 text-white"
            onClick={handleCancel}
            disabled={isApproving || isCanceling}
          >
            <X className="size-4" />
            Từ chối
          </Button>
          <Button
            className="flex items-center justify-start gap-2 bg-rose-500 text-white"
            onClick={handleApprove}
            disabled={isApproving || isCanceling}
          >
            <Check className="size-4" />
            Hoàn thành
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
