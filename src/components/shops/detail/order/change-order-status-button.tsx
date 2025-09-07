import { Button } from '@/components/ui/button';
import { useUpdateOrderStatusMutation } from '@/services/apis';
import { OrderStatus } from '@/services/types';
import { toast } from 'sonner';

interface ChangeOrderStatusButtonProps {
  message: string;
  orderId: string;
  status: OrderStatus;
  onSuccess: () => void;
  className?: string;
}

export const ChangeOrderStatusButton = ({
  message,
  orderId,
  status,
  onSuccess,
  className,
}: ChangeOrderStatusButtonProps) => {
  const [trigger, { isLoading }] = useUpdateOrderStatusMutation();

  const handleChangeStatus = async (orderId: string, status: OrderStatus) => {
    const { statusCode, message } = await trigger({
      id: orderId,
      status: status,
    }).unwrap();
    if ([200, 201, 202, 203, 204].includes(statusCode)) {
      onSuccess();
      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  return (
    <Button
      onClick={() => handleChangeStatus(orderId, status)}
      className={className}
      variant="outline"
      disabled={isLoading}
    >
      {message}
    </Button>
  );
};
