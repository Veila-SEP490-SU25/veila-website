import { ConfirmDialog } from "@/components/confirm-dialog.tsx"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Phone, Wallet } from "lucide-react"

interface QuickActionsCardProps {
  onCheckout: () => void
  isCheckingOut: boolean
}

export const QuickActionsCard = ({ onCheckout, isCheckingOut }: QuickActionsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thao tác nhanh</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <ConfirmDialog
          children={
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <Wallet className="h-4 w-4 mr-2" />
              Thanh toán đơn hàng
            </Button>
          }
          onConfirm={onCheckout}
          confirmText="Xác nhận thanh toán"
          cancelText="Hủy"
          description="Bạn có chắc chắn muốn thanh toán đơn hàng này không?"
          disabled={isCheckingOut}
          loading={isCheckingOut}
          title="Xác nhận thanh toán"
        />

        <Button className="w-full justify-start bg-transparent" variant="outline">
          <MessageSquare className="h-4 w-4 mr-2" />
          Nhắn tin cửa hàng
        </Button>
        <Button className="w-full justify-start bg-transparent" variant="outline">
          <Phone className="h-4 w-4 mr-2" />
          Gọi điện
        </Button>
      </CardContent>
    </Card>
  )
}
