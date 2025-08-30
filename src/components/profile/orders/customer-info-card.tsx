import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IUser } from "@/services/types";
import { User } from "lucide-react";

interface CustomerInfoCardProps {
  customer: IUser;
}

export const CustomerInfoCard = ({ customer }: CustomerInfoCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="h-5 w-5" />
          <span>Khách hàng</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={customer.avatarUrl || ""} />
            <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
              {customer.firstName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="font-semibold truncate">
              {customer.firstName} {customer.middleName} {customer.lastName}
            </p>
            <p className="text-sm text-muted-foreground truncate">
              {customer.email}
            </p>
            <p className="text-sm text-muted-foreground">{customer.phone}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
