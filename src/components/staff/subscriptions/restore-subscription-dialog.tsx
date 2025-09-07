'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { isSuccess } from '@/lib/utils';
import { useRestoreSubscriptionMutation } from '@/services/apis';
import { ISubscription } from '@/services/types';
import { ArchiveRestore, Check, X } from 'lucide-react';
import { ReactNode, useCallback, useState } from 'react';
import { toast } from 'sonner';

interface RestoreSubscriptionDialogProps {
  subscription: ISubscription;
  onSuccess?: () => void;
  children?: ReactNode;
}

export const RestoreSubscriptionDialog = ({
  subscription,
  onSuccess,
  children,
}: RestoreSubscriptionDialogProps) => {
  const [trigger, { isLoading }] = useRestoreSubscriptionMutation();
  const [open, setOpen] = useState<boolean>(false);

  const handleConfirm = useCallback(async () => {
    try {
      const { statusCode, message } = await trigger(subscription.id).unwrap();
      if (isSuccess(statusCode)) {
        setOpen(false);
        onSuccess?.();
        toast.success(message);
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.error('Failed to respond to complaint:', error);
    }
  }, [subscription, onSuccess, trigger, setOpen]);

  const handleCancel = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const defaultTrigger = (
    <Button className="flex items-center justify-start gap-2">
      <ArchiveRestore className="size-4" />
      Khôi phục gói đăng ký
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children || defaultTrigger}</DialogTrigger>
      <DialogContent className="w-lg max-w[90xw] flex flex-col items-center gap-2">
        <DialogHeader>
          <DialogTitle>Khôi phục gói đăng ký</DialogTitle>
        </DialogHeader>
        <DialogDescription className="p-9 text-center">
          <p>Bạn có chắc chắn muốn khôi phục gói đăng ký này?</p>
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
