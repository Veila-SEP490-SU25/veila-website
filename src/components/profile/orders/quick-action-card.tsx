import { ConfirmDialog } from "@/components/confirm-dialog.tsx";
import { RequestSmartOtpDialog } from "@/components/request-smart-otp-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Phone, Wallet } from "lucide-react";

interface QuickActionsCardProps {
  onCheckout: (otp: string) => Promise<boolean>;
  isCheckingOut: boolean;
}

export const QuickActionsCard = ({
  onCheckout,
  isCheckingOut,
}: QuickActionsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thao tác nhanh</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <RequestSmartOtpDialog onConfirm={onCheckout} 
          message="Vui lòng nhập mã OTP để xác nhận thanh toán"
          trigger={
            <Button
              className="w-full justify-start bg-transparent"
              variant="outline"
            >
              <Wallet className="h-4 w-4 mr-2" />
              Thanh toán đơn hàng
            </Button>
          }
        />

        <Button
          className="w-full justify-start bg-transparent"
          variant="outline"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Nhắn tin cửa hàng
        </Button>
        <Button
          className="w-full justify-start bg-transparent"
          variant="outline"
        >
          <Phone className="h-4 w-4 mr-2" />
          Gọi điện
        </Button>
      </CardContent>
    </Card>
  );
};
