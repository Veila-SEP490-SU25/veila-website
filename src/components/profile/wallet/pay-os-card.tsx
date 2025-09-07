'use client';

import { Button } from '@/components/ui/button';
import { usePostWebhookMutation } from '@/services/apis';
import { ITransfer, TransactionStatus } from '@/services/types';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { PayOSConfig, usePayOS } from '@payos/payos-checkout';
import { toast } from 'sonner';
import { isSuccess } from '@/lib/utils';

interface IPayOsCardProps {
  transfer: ITransfer;
  trigger?: ReactNode;
  onUpdate?: () => void;
}

export const PayOsCard = ({ transfer, onUpdate }: IPayOsCardProps) => {
  const [webhookTrigger, { isLoading }] = usePostWebhookMutation();
  const [config] = useState<PayOSConfig>({
    RETURN_URL: window.location.origin,
    ELEMENT_ID: 'embedded-container',
    CHECKOUT_URL: transfer.checkoutUrl,
    embedded: true,
    onSuccess: () => {
      handleWehook(TransactionStatus.COMPLETED);
      onUpdate?.();
    },
  });

  const handleWehook = useCallback(
    async (status: TransactionStatus) => {
      try {
        const { statusCode } = await webhookTrigger({
          transactionId: transfer.transactionId,
          status,
        }).unwrap();
        if (isSuccess(statusCode)) {
          toast.success('Thanh toán thành công');
          onUpdate?.();
        } else {
          onUpdate?.();
        }
      } catch (error) {
        console.error(error);
        toast.error('Có lỗi xảy ra khi thanh toán. Vui lòng liên hệ đội ngũ hỗ trợ.');
      }
    },
    [webhookTrigger, transfer.transactionId, onUpdate],
  );

  const { open: openPayOS, exit: closePayOS } = usePayOS(config);
  const hasOpenedRef = useRef(false);
  useEffect(() => {
    if (!hasOpenedRef.current) {
      openPayOS();
      hasOpenedRef.current = true;
    }
  }, [transfer.checkoutUrl, openPayOS]);

  return (
    <div className="w-full grid grid-cols-1 justify-center items-center">
      <div id="embedded-container" className="w-full h-96"></div>
      <Button
        className="w-max mx-auto"
        variant="outline"
        onClick={() => {
          handleWehook(TransactionStatus.CANCELLED);
          closePayOS();
          onUpdate?.();
        }}
        disabled={isLoading}
      >
        Đóng
      </Button>
    </div>
  );
};
