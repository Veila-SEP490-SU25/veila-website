import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  formatDateShort,
  getStatusColor,
  getStatusText,
  getTypeColor,
  getTypeText,
} from "@/lib/order-util";
import { formatPrice } from "@/lib/products-utils";
import { IOrder, OrderStatus, OrderType } from "@/services/types";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  Mail,
  MapPin,
  Phone,
  XCircle,
} from "lucide-react";
import Link from "next/link";

interface IOrderCardProps {
  order: IOrder;
  onUpdate?: () => void;
}

const getStatusIcon = (status: OrderStatus) => {
  switch (status) {
    case "PENDING":
      return <Clock className="h-4 w-4 text-yellow-600" />;
    case "IN_PROCESS":
      return <AlertCircle className="h-4 w-4 text-blue-600" />;
    case "COMPLETED":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case "CANCELLED":
      return <XCircle className="h-4 w-4 text-red-600" />;
    default:
      return <Clock className="h-4 w-4 text-gray-600" />;
  }
};

export const OrderCard = ({ order, onUpdate }: IOrderCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-4">
            {/* Order Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {getStatusIcon(order.status)}
                  <h3 className="font-semibold text-lg">
                    Đơn hàng #{order.id.slice(-8)}
                  </h3>
                </div>
                <Badge className={getTypeColor(order.type)} variant="outline">
                  {getTypeText(order.type)}
                </Badge>
                <Badge
                  className={getStatusColor(order.status)}
                  variant="outline"
                >
                  {getStatusText(order.status)}
                </Badge>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-rose-600">
                  {formatPrice(order.amount)}
                </p>
                <p className="text-sm text-gray-600">
                  {formatDateShort(order.createdAt)}
                </p>
              </div>
            </div>

            {/* Customer Info */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={order.customer.avatarUrl || undefined} />
                  <AvatarFallback>
                    {order.customer.firstName?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{order.customer.firstName}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3 text-rose-400" />
                      <span>{order.phone}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3 text-rose-400" />
                      <span>{order.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-rose-400" />
                <div>
                  <p className="text-gray-600">Ngày giao hàng</p>
                  <p className="font-medium">
                    {formatDateShort(order.dueDate)}
                  </p>
                </div>
              </div>
              {order.returnDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-rose-400" />
                  <div>
                    <p className="text-gray-600">Ngày trả</p>
                    <p className="font-medium">
                      {formatDateShort(order.returnDate)}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-rose-400" />
                <div>
                  <p className="text-gray-600">Địa chỉ giao hàng</p>
                  <p className="font-medium truncate">{order.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-4">
            <Button variant={"outline"} size="icon" asChild>
              <Link href={`/staff/orders/${order.id}`}>
                <Eye className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
