import { CreateChatButton } from '@/components/chat/create-chat-button';
import { RequestSmartOtpDialog } from '@/components/request-smart-otp-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IOrder } from '@/services/types';
import { MessageSquare, Wallet } from 'lucide-react';

interface QuickActionsCardProps {
  order: IOrder
  onCheckout: (otp: string) => Promise<boolean>;
  isCheckingOut: boolean;
}

export const QuickActionsCard = ({ onCheckout, order }: QuickActionsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thao tác nhanh</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <RequestSmartOtpDialog
          onConfirm={onCheckout}
          message="Vui lòng nhập mã OTP để xác nhận thanh toán"
          trigger={
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <Wallet className="h-4 w-4 mr-2" />
              Thanh toán đơn hàng
            </Button>
          }
        />
      </CardContent>
      <CardContent className="space-y-2">
        <CreateChatButton
          shopId={order.shop.id}
          shopName={order.shop.name}
          shopAvatarUrl={order.shop.logoUrl}
          customerId={order.customer.id}
          customerName={`${order.customer.firstName} ${order.customer.middleName} ${order.customer.lastName}`}
          customerAvatarUrl={order.customer.avatarUrl}
          orderId={order.id}
        />
      </CardContent>
    </Card>
  );
};
