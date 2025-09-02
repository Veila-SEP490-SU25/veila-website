"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Clock,
  CheckCircle,
  PlayCircle,
  XCircle,
  AlertCircle,
  Ban,
} from "lucide-react";
import { IMilestone, MilestoneStatus, ComplaintStatus } from "@/services/types";
import {
  formatDateShort,
  getMilestoneStatusColor,
  getMilestoneStatusText,
} from "@/lib/order-util";
import { MilestoneTask } from "@/components/shops/detail/order/milestone-task";
import {
  useCancelOrderMutation,
  useCreateComplaintMutation,
} from "@/services/apis";
import { useGetComplaintReasonsCustomerQuery } from "@/services/apis/complaint.api";
import { toast } from "sonner";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MilestonesTabProps {
  milestones: IMilestone[];
  isMilestonesLoading: boolean;
  fetchMilestone: () => Promise<void>;
}

const getMilestoneStatusIcon = (status: MilestoneStatus) => {
  switch (status) {
    case MilestoneStatus.COMPLETED:
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    case MilestoneStatus.IN_PROGRESS:
      return <PlayCircle className="h-5 w-5 text-blue-600" />;
    case MilestoneStatus.CANCELLED:
      return <XCircle className="h-5 w-5 text-red-600" />;
    default:
      return <AlertCircle className="h-5 w-5 text-gray-400" />;
  }
};

export const MilestonesTab = ({
  milestones,
  isMilestonesLoading,
  fetchMilestone,
  orderStatus,
  orderId,
}: MilestonesTabProps & { orderStatus?: string; orderId?: string }) => {
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [complaintData, setComplaintData] = useState({
    reasonId: "",
    description: "",
  });

  // Fetch complaint reasons
  const { data: complaintReasons, isLoading: isReasonsLoading } =
    useGetComplaintReasonsCustomerQuery(undefined, {
      skip: !showComplaintForm,
    });

  // Create complaint mutation
  const [createComplaint, { isLoading: isCreatingComplaint }] =
    useCreateComplaintMutation();

  // Kiểm tra xem có thể hủy đơn hàng không
  const canCancelOrder = () => {
    if (!orderId || !milestones.length) return false;

    // Tìm milestone "Đang giao hàng" hoặc tương tự
    const deliveryMilestone = milestones.find(
      (milestone) =>
        milestone.title.toLowerCase().includes("giao hàng") ||
        milestone.title.toLowerCase().includes("delivery") ||
        milestone.title.toLowerCase().includes("shipping")
    );

    // Chỉ cho phép hủy trước khi milestone giao hàng bắt đầu
    if (deliveryMilestone) {
      return deliveryMilestone.status === MilestoneStatus.PENDING;
    }

    // Nếu không tìm thấy milestone giao hàng, cho phép hủy khi đơn hàng còn ở trạng thái PENDING
    return orderStatus === "PENDING";
  };

  // Kiểm tra xem có thể hiển thị form complaint không
  const canShowComplaintForm = () => {
    if (!orderId || !milestones.length) return false;

    // Chỉ hiển thị khi milestone cuối cùng ở trạng thái IN_PROGRESS
    const lastMilestone = milestones[milestones.length - 1];
    return lastMilestone.status === MilestoneStatus.IN_PROGRESS;
  };

  const handleCancelOrder = async () => {
    if (!orderId) return;

    try {
      await cancelOrder(orderId).unwrap();
      toast.success("Đã hủy đơn hàng thành công!");
      // Refresh data
      await fetchMilestone();
    } catch (error: any) {
      console.error("Error cancelling order:", error);
      toast.error(
        error?.data?.message ||
          "Có lỗi xảy ra khi hủy đơn hàng. Vui lòng thử lại sau."
      );
    }
  };

  const handleCreateComplaint = async () => {
    if (!orderId || !complaintData.reasonId) return;

    try {
      const selectedReason = complaintReasons?.items?.find(
        (reason) => reason.id === complaintData.reasonId
      );

      if (!selectedReason) {
        toast.error("Vui lòng chọn lý do khiếu nại");
        return;
      }

      await createComplaint({
        orderId,
        title: selectedReason.code,
        description: complaintData.description,
        reason: complaintData.description,
        images: "",
        status: ComplaintStatus.DRAFT,
      }).unwrap();

      toast.success("Đã tạo khiếu nại thành công!");
      setShowComplaintForm(false);
      setComplaintData({ reasonId: "", description: "" });
      await fetchMilestone();
    } catch (error: any) {
      console.error("Error creating complaint:", error);
      toast.error(
        error?.data?.message ||
          "Có lỗi xảy ra khi tạo khiếu nại. Vui lòng thử lại sau."
      );
    }
  };
  if (isMilestonesLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (milestones.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">Chưa có giai đoạn nào</h3>
          <p className="text-muted-foreground">
            Các giai đoạn sẽ được tạo khi đơn hàng được xử lý.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Nút hủy đơn hàng */}
      {canCancelOrder() && (
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Ban className="h-5 w-5 text-red-600" />
                <div>
                  <h4 className="font-medium text-red-800">Hủy đơn hàng</h4>
                  <p className="text-sm text-red-700">
                    Bạn có thể hủy đơn hàng này trước khi bắt đầu giao hàng
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-50"
                onClick={handleCancelOrder}
                disabled={isCancelling}
              >
                <Ban className="h-4 w-4 mr-2" />
                {isCancelling ? "Đang hủy..." : "Hủy đơn hàng"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form khiếu nại */}
      {canShowComplaintForm() && (
        <Card className="border-orange-200 bg-orange-50/50">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <div>
                  <h4 className="font-medium text-orange-800">
                    Khiếu nại đơn hàng
                  </h4>
                  <p className="text-sm text-orange-700">
                    Bạn có thể tạo khiếu nại nếu có vấn đề với đơn hàng này
                  </p>
                </div>
              </div>

              {!showComplaintForm ? (
                <Button
                  variant="outline"
                  className="border-orange-300 text-orange-700 hover:bg-orange-50"
                  onClick={() => setShowComplaintForm(true)}
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Tạo khiếu nại
                </Button>
              ) : (
                <div className="space-y-4 border-t pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="complaint-reason">Lý do khiếu nại *</Label>
                    <Select
                      value={complaintData.reasonId}
                      onValueChange={(value) =>
                        setComplaintData({ ...complaintData, reasonId: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn lý do khiếu nại" />
                      </SelectTrigger>
                      <SelectContent>
                        {isReasonsLoading ? (
                          <SelectItem value="" disabled>
                            Đang tải...
                          </SelectItem>
                        ) : (
                          complaintReasons?.items?.map((reason) => (
                            <SelectItem key={reason.id} value={reason.id}>
                              {reason.reason}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="complaint-description">
                      Mô tả chi tiết *
                    </Label>
                    <Textarea
                      id="complaint-description"
                      placeholder="Mô tả chi tiết vấn đề bạn gặp phải..."
                      value={complaintData.description}
                      onChange={(e) =>
                        setComplaintData({
                          ...complaintData,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      onClick={handleCreateComplaint}
                      disabled={
                        !complaintData.reasonId ||
                        !complaintData.description ||
                        isCreatingComplaint
                      }
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      {isCreatingComplaint ? "Đang tạo..." : "Gửi khiếu nại"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowComplaintForm(false);
                        setComplaintData({ reasonId: "", description: "" });
                      }}
                    >
                      Hủy
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {milestones.map((milestone, index) => (
        <Card key={milestone.id} className="relative">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getMilestoneStatusIcon(milestone.status)}
                <div>
                  <span className="text-lg">
                    Giai đoạn {milestone.index}: {milestone.title}
                  </span>
                  <p className="text-sm text-muted-foreground font-normal mt-1">
                    Hạn: {formatDateShort(milestone.dueDate)}
                  </p>
                </div>
              </div>
              <Badge
                variant="outline"
                className={getMilestoneStatusColor(milestone.status)}
              >
                {getMilestoneStatusText(milestone.status)}
              </Badge>
            </CardTitle>
            {milestone.description && (
              <CardDescription className="text-base">
                {milestone.description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <MilestoneTask
                milestoneId={milestone.id}
                milestoneTitle={milestone.title}
                _onChange={fetchMilestone}
                orderStatus={orderStatus}
                isLastMilestone={index === milestones.length - 1}
                orderId={orderId}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
