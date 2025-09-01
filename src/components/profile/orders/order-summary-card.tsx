import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  formatCurrency,
  formatDateShort,
  getTypeColor,
  getTypeText,
} from "@/lib/order-util";
import { IOrder } from "@/services/types";

interface OrderSummaryCardProps {
  order: IOrder;
  progress: number;
}

export const OrderSummaryCard = ({
  order,
  progress,
}: OrderSummaryCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tóm tắt đơn hàng</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Loại:</span>
          <Badge className={getTypeColor(order.type)} variant="outline">
            {getTypeText(order.type)}
          </Badge>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tổng tiền:</span>
          <span className="font-bold">{formatCurrency(order.amount)}</span>
        </div>

        <Separator />
        <div className="flex justify-between">
          <span className="text-muted-foreground">Ngày giao:</span>
          <span className="font-medium">{formatDateShort(order.dueDate)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tiến độ:</span>
          <span className="font-medium">{Math.round(progress)}%</span>
        </div>
      </CardContent>
    </Card>
  );
};
