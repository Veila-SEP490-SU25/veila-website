"use client";

import { ErrorCard } from "@/components/error-card";
import { GoBackButton } from "@/components/go-back-button";
import { ImageGallery } from "@/components/image-gallery";
import { StaffNotFound } from "@/components/staff-not-found";
import { StatusBadge } from "@/components/staff/complaints/complaint-card";
import { OrderCollapse } from "@/components/staff/complaints/order-collapse";
import { ResponseComplaintDialog } from "@/components/staff/complaints/response-complaint-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageLoading } from "@/components/ui/page-loading";
import { Textarea } from "@/components/ui/textarea";
import { formatDateShort } from "@/lib/order-util";
import { getImages } from "@/lib/products-utils";
import { isSuccess } from "@/lib/utils";
import { useLazyGetComplaintStaffQuery } from "@/services/apis";
import { ComplaintStatus, IComplaint } from "@/services/types";
import {
  Calendar,
  Check,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  X,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function ComplaintDetailPage() {
  const { id: complaintId } = useParams() as { id: string };
  const [trigger, { isLoading }] = useLazyGetComplaintStaffQuery();
  const [complaint, setComplaint] = useState<IComplaint>();
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isNotFound, setIsNotFound] = useState<boolean>(false);

  const fetchComplaint = useCallback(async () => {
    try {
      const { statusCode, message, item } = await trigger(complaintId).unwrap();
      if (isSuccess(statusCode)) {
        setComplaint(item);
        setIsError(false);
        setError("");
        setIsNotFound(false);
      } else if (statusCode === 404) {
        setIsNotFound(true);
      } else {
        setError(message);
        setIsError(true);
        setIsNotFound(false);
      }
    } catch (error) {
      setIsError(true);
      setError(
        "Đã có lỗi xảy ra khi tải dữ liệu của khiếu nại. Vui lòng thử lại sau."
      );
    }
  }, [complaintId, trigger, setComplaint, setIsError, setError, setIsNotFound]);
  useEffect(() => {
    fetchComplaint();
  }, [fetchComplaint]);

  if (isNotFound)
    return (
      <div className="space-y-6 max-w-full h-full">
        <StaffNotFound />
      </div>
    );

  if (isError)
    return (
      <div className="p-6 space-y-6 max-w-full">
        <Card>
          <CardHeader className="items-center justify-center">
            <CardTitle className="text-red-500">
              Đã có lỗi xảy ra khi tải dữ liệu
            </CardTitle>
            <CardDescription>
              <GoBackButton />
              <Button
                className="flex items-center justify-center gap-2 bg-rose-500 text-white"
                onClick={fetchComplaint}
              >
                <RefreshCw
                  className={`size-4 ${isLoading ? "animate-spin" : ""}`}
                />
                Thử lại
              </Button>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ErrorCard message={error} />
          </CardContent>
        </Card>
      </div>
    );

  if (isLoading)
    return (
      <div className="p-6 space-y-6 max-w-full">
        <PageLoading type="blog" />
      </div>
    );

  return (
    complaint && (
      <div className="p-6 space-y-6 max-w-full">
        <Card>
          <CardHeader>
            <GoBackButton />
            <div className="flex items-start justify-between w-full">
              <div className="space-y-2">
                <CardTitle className="text-lg font-bold">
                  Khiếu nại #{complaint.id}
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Calendar className="size-4 text-rose-500" />
                  <span className="text-sm text-muted-foreground">
                    Ngày tạo: {formatDateShort(complaint.createdAt)}
                  </span>
                </CardDescription>
              </div>
              <div className="flex flex-col items-end gap-2">
                <StatusBadge status={complaint.status} />
                {complaint.status === ComplaintStatus.IN_PROGRESS && (
                  <div className="flex items-center gap-2">
                    <ResponseComplaintDialog
                      complaintId={complaint.id}
                      isApproved={ComplaintStatus.REJECTED}
                      onSuccess={fetchComplaint}
                      successMessage="Đã từ chối khiếu nại thành công."
                      trigger={
                        <Button
                          className="flex items-center justify-start gap-2"
                          size="sm"
                          variant="outline"
                        >
                          <X className="size-4" />
                          Từ chối
                        </Button>
                      }
                    />
                    <ResponseComplaintDialog
                      complaintId={complaint.id}
                      isApproved={ComplaintStatus.APPROVED}
                      onSuccess={fetchComplaint}
                      successMessage="Đã chấp nhận khiếu nại thành công."
                      trigger={
                        <Button
                          className="flex items-center justify-start gap-2"
                          size="sm"
                          variant="outline"
                        >
                          <Check className="size-4" />
                          Phê duyệt
                        </Button>
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Sender */}
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage
                    src={complaint.sender.avatarUrl || undefined}
                    alt={complaint.sender.username}
                  />
                  <AvatarFallback>
                    {complaint.sender.username.toUpperCase().charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    {complaint.sender.username}
                  </p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Mail className="size-4 text-rose-500" />
                    {complaint.sender.email}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Phone className="size-4 text-rose-500" />
                    {complaint.sender.phone}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="size-4 text-rose-500" />
                    {complaint.sender.address}
                  </div>
                </div>
              </div>
              {/* Complain Detail */}
              <div className="space-y-2 w-full">
                <CardTitle>{complaint.title}</CardTitle>
                <CardDescription>{complaint.reason}</CardDescription>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Textarea
                    value={complaint.description}
                    className="w-full cursor-text"
                  />
                  <ImageGallery
                    images={getImages(complaint.images) || []}
                    alt="Hình ảnh khiếu nại"
                  />
                </div>
              </div>

              <OrderCollapse order={complaint.order} />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  );
}
