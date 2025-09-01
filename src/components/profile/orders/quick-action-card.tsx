import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

interface QuickActionsCardProps {
  onCheckout: (otp: string) => Promise<boolean>;
  isCheckingOut: boolean;
}

export const QuickActionsCard = ({}: QuickActionsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thao tác nhanh</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button
          className="w-full justify-start bg-transparent"
          variant="outline"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Nhắn tin cửa hàng
        </Button>
      </CardContent>
    </Card>
  );
};
