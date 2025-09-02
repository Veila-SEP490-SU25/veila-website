"use client";

import { OrderCollapse } from "@/components/staff/complaints/order-collapse";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { formatDateShort } from "@/lib/order-util";
import { getCoverImage } from "@/lib/products-utils";
import { ComplaintStatus, IComplaint, IUser } from "@/services/types";
import {
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Eye,
  FileText,
  LoaderCircle,
  Mail,
  MapPin,
  Phone,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface IComplaintCardProps {
  complaint: IComplaint;
  onUpdate?: () => void;
}

export const StatusBadge = ({ status }: { status: ComplaintStatus }) => {
  switch (status) {
    case ComplaintStatus.APPROVED:
      return (
        <Badge className="bg-blue-500/10 text-blue-500 border-blue-500 flex items-center gap-2">
          <Check className="size-2" />
          Đã duyệt
        </Badge>
      );
    case ComplaintStatus.REJECTED:
      return (
        <Badge className="bg-rose-500/10 text-rose-500 border-rose-500 flex items-center gap-2">
          <X className="size-2" />
          Đã từ chối
        </Badge>
      );
    case ComplaintStatus.IN_PROGRESS:
      return (
        <Badge className="bg-amber-500/10 text-amber-500 border-amber-500 flex items-center gap-2">
          <LoaderCircle className="size-2" />
          Đợi xử lý
        </Badge>
      );
    case ComplaintStatus.DRAFT:
      return (
        <Badge className="bg-gray-500/10 text-gray-500 border-gray-500 flex items-center gap-2">
          <Check className="size-2" />
          Nháp
        </Badge>
      );
    default:
      return null;
  }
};

export const ComplaintCard = ({ complaint, onUpdate }: IComplaintCardProps) => {
  const [sender, setSender] = useState<IUser>(complaint.sender);
  const [order, setOrder] = useState(complaint.order);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setSender(complaint.sender);
    setOrder(complaint.order);
  }, [complaint, setSender, setOrder]);

  return (
    <Card className="w-full gap-4 overflow-hidden">
      <CardHeader className="w-full">
        <div className="flex items-start justify-between w-full">
          <div className="space-y-2">
            <CardTitle>{complaint.title}</CardTitle>
            <CardDescription>{complaint.reason}</CardDescription>
            <div className="flex items-center gap-2 text-xs">
              <Calendar className="size-4 text-rose-500" />
              {formatDateShort(complaint.createdAt)}
            </div>
          </div>
          <div className="space-y-2 flex flex-col items-end">
            <StatusBadge status={complaint.status} />
            <Button className="w-max flex items-center gap-2" size="sm" variant="outline">
              <Link href={`/staff/complaints/${complaint.id}`} className="flex items-center gap-2">
                <Eye className="size-3" />
                Xem chi tiết
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <Avatar>
              <AvatarImage
                src={sender.avatarUrl || undefined}
                alt={sender.username}
              />
              <AvatarFallback>
                {sender.username.toUpperCase().charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-sm font-medium">{sender.username}</p>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Mail className="size-4 text-rose-500" />
                {sender.email}
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Phone className="size-4 text-rose-500" />
                {sender.phone}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="size-4 text-rose-500" />
                {sender.address}
              </div>
            </div>
          </div>
          <Collapsible open={open} onOpenChange={setOpen}>
            <CollapsibleTrigger asChild>
              <Button
                className="w-full flex items-center justify-between"
                variant="outline"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <FileText className="size-4 text-rose-500" />
                    Đơn hàng #{order.id.slice(-8)}
                  </div>
                </div>
                {open ? (
                  <ChevronUp className="size-4 text-rose-500" />
                ) : (
                  <ChevronDown className="size-4 text-rose-500" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <OrderCollapse order={order} onUpdate={onUpdate} />
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>
    </Card>
  );
};
