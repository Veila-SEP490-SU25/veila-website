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
  useConfirmNoComplaintMutation,
  useCreateUpdateRequestMutation,
  useLazyGetUpdateRequestsQuery,
  useDeleteUpdateRequestMutation,
  useLazyGetUpdateRequestQuery,
} from "@/services/apis";
import { useGetComplaintReasonsCustomerQuery } from "@/services/apis/complaint.api";
import { toast } from "sonner";
import { useState, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
  orderType,
  orderServiceDetail,
}: MilestonesTabProps & {
  orderStatus?: string;
  orderId?: string;
  orderType?: string;
  orderServiceDetail?: any;
}) => {
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [complaintData, setComplaintData] = useState({
    reasonId: "",
    description: "",
  });

  const [showUpdateRequestForm, setShowUpdateRequestForm] = useState(false);
  const [showUpdateRequestDetail, setShowUpdateRequestDetail] = useState<
    string | null
  >(null);
  const [updateRequestData, setUpdateRequestData] = useState({
    title: "",
    description: "",
    height: 170,
    weight: 55,
    bust: 85,
    waist: 60,
    hip: 90,
    armpit: 40,
    bicep: 30,
    neck: 35,
    shoulderWidth: 40,
    sleeveLength: 60,
    backLength: 40,
    lowerWaist: 20,
    waistToFloor: 60,
    material: "Cotton",
    color: "Đỏ",
    length: "Dài",
    neckline: "Cổ tròn",
    sleeve: "Tay ngắn",
    images: "",
  });

  // Fetch complaint reasons
  const { data: complaintReasons, isLoading: isReasonsLoading } =
    useGetComplaintReasonsCustomerQuery(undefined, {
      skip: !showComplaintForm,
    });

  // Create complaint mutation
  const [createComplaint, { isLoading: isCreatingComplaint }] =
    useCreateComplaintMutation();

  // Confirm no complaint mutation
  const [confirmNoComplaint, { isLoading: isConfirmingNoComplaint }] =
    useConfirmNoComplaintMutation();

  // Update request mutations
  const [createUpdateRequest, { isLoading: isCreatingUpdateRequest }] =
    useCreateUpdateRequestMutation();
  const [
    getUpdateRequests,
    { data: updateRequestsData, isLoading: isUpdateRequestsLoading },
  ] = useLazyGetUpdateRequestsQuery();
  const [deleteUpdateRequest, { isLoading: isDeletingUpdateRequest }] =
    useDeleteUpdateRequestMutation();
  const [
    getUpdateRequest,
    { data: updateRequestDetail, isLoading: isUpdateRequestDetailLoading },
  ] = useLazyGetUpdateRequestQuery();

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

  const handleConfirmNoComplaint = async () => {
    if (!orderId) return;

    try {
      await confirmNoComplaint(orderId).unwrap();
      toast.success("Đã xác nhận không có khiếu nại!");
      setShowComplaintForm(false);
      await fetchMilestone();
    } catch (error: any) {
      console.error("Error confirming no complaint:", error);
      toast.error(
        error?.data?.message ||
          "Có lỗi xảy ra khi xác nhận. Vui lòng thử lại sau."
      );
    }
  };

  const handleCreateUpdateRequest = async () => {
    if (!orderServiceDetail?.request?.id) return;

    try {
      await createUpdateRequest({
        id: orderServiceDetail.request.id,
        ...updateRequestData,
      }).unwrap();
      toast.success("Đã tạo yêu cầu chỉnh sửa thành công!");
      setShowUpdateRequestForm(false);
      setUpdateRequestData({
        title: "",
        description: "",
        height: 170,
        weight: 55,
        bust: 85,
        waist: 60,
        hip: 90,
        armpit: 40,
        bicep: 30,
        neck: 35,
        shoulderWidth: 40,
        sleeveLength: 60,
        backLength: 40,
        lowerWaist: 20,
        waistToFloor: 60,
        material: "Cotton",
        color: "Đỏ",
        length: "Dài",
        neckline: "Cổ tròn",
        sleeve: "Tay ngắn",
        images: "",
      });
      // Refresh update requests
      if (orderServiceDetail?.request?.id) {
        getUpdateRequests({
          requestId: orderServiceDetail.request.id,
          page: 0,
          size: 10,
          filter: "",
          sort: "",
        });
      }
    } catch (error: any) {
      console.error("Error creating update request:", error);
      toast.error(
        error?.data?.message ||
          "Có lỗi xảy ra khi tạo yêu cầu chỉnh sửa. Vui lòng thử lại sau."
      );
    }
  };

  const fetchUpdateRequests = useCallback(() => {
    if (orderServiceDetail?.request?.id) {
      getUpdateRequests({
        requestId: orderServiceDetail.request.id,
        page: 0,
        size: 10,
        filter: "",
        sort: "",
      });
    }
  }, [orderServiceDetail?.request?.id, getUpdateRequests]);

  const handleDeleteUpdateRequest = async (updateRequestId: string) => {
    if (!orderServiceDetail?.request?.id) return;

    try {
      await deleteUpdateRequest({
        requestId: orderServiceDetail.request.id,
        updateRequestId,
      }).unwrap();
      toast.success("Đã xóa yêu cầu chỉnh sửa thành công!");
      // Refresh danh sách
      fetchUpdateRequests();
    } catch (error: any) {
      console.error("Error deleting update request:", error);
      toast.error(
        error?.data?.message ||
          "Có lỗi xảy ra khi xóa yêu cầu chỉnh sửa. Vui lòng thử lại sau."
      );
    }
  };

  const handleViewUpdateRequestDetail = async (updateRequestId: string) => {
    if (!orderServiceDetail?.request?.id) return;

    try {
      await getUpdateRequest({
        requestId: orderServiceDetail.request.id,
        updateRequestId,
      }).unwrap();
      setShowUpdateRequestDetail(updateRequestId);
    } catch (error: any) {
      console.error("Error fetching update request detail:", error);
      toast.error("Có lỗi xảy ra khi tải chi tiết yêu cầu");
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
                      onClick={handleConfirmNoComplaint}
                      disabled={isConfirmingNoComplaint}
                      variant="outline"
                      className="border-green-300 text-green-700 hover:bg-green-50"
                    >
                      {isConfirmingNoComplaint
                        ? "Đang xác nhận..."
                        : "Xác nhận không có khiếu nại"}
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

      {/* Form yêu cầu chỉnh sửa cho đơn hàng custom */}
      {orderType === "CUSTOM" && orderServiceDetail?.request?.id && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                <div>
                  <h4 className="font-medium text-blue-800">
                    Yêu cầu chỉnh sửa thiết kế
                  </h4>
                  <p className="text-sm text-blue-700">
                    Bạn có thể tạo yêu cầu chỉnh sửa thiết kế cho đơn hàng
                    custom này
                  </p>
                </div>
              </div>

              {!showUpdateRequestForm ? (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    className="border-blue-300 text-blue-700 hover:bg-blue-50"
                    onClick={() => setShowUpdateRequestForm(true)}
                  >
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Tạo yêu cầu chỉnh sửa
                  </Button>
                  <Button
                    variant="outline"
                    className="border-blue-300 text-blue-700 hover:bg-blue-50"
                    onClick={fetchUpdateRequests}
                  >
                    Xem danh sách yêu cầu
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 border-t pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="update-title">Tiêu đề *</Label>
                      <Input
                        id="update-title"
                        placeholder="Nhập tiêu đề yêu cầu..."
                        value={updateRequestData.title}
                        onChange={(e) =>
                          setUpdateRequestData({
                            ...updateRequestData,
                            title: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="update-description">Mô tả *</Label>
                      <Textarea
                        id="update-description"
                        placeholder="Mô tả chi tiết yêu cầu chỉnh sửa..."
                        value={updateRequestData.description}
                        onChange={(e) =>
                          setUpdateRequestData({
                            ...updateRequestData,
                            description: e.target.value,
                          })
                        }
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="update-height">Chiều cao (cm)</Label>
                      <Input
                        id="update-height"
                        type="number"
                        value={updateRequestData.height}
                        onChange={(e) =>
                          setUpdateRequestData({
                            ...updateRequestData,
                            height: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="update-weight">Cân nặng (kg)</Label>
                      <Input
                        id="update-weight"
                        type="number"
                        value={updateRequestData.weight}
                        onChange={(e) =>
                          setUpdateRequestData({
                            ...updateRequestData,
                            weight: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="update-bust">Vòng ngực (cm)</Label>
                      <Input
                        id="update-bust"
                        type="number"
                        value={updateRequestData.height}
                        onChange={(e) =>
                          setUpdateRequestData({
                            ...updateRequestData,
                            bust: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="update-waist">Vòng eo (cm)</Label>
                      <Input
                        id="update-waist"
                        type="number"
                        value={updateRequestData.waist}
                        onChange={(e) =>
                          setUpdateRequestData({
                            ...updateRequestData,
                            waist: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="update-hip">Vòng mông (cm)</Label>
                      <Input
                        id="update-hip"
                        type="number"
                        value={updateRequestData.hip}
                        onChange={(e) =>
                          setUpdateRequestData({
                            ...updateRequestData,
                            hip: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="update-material">Chất liệu</Label>
                      <Input
                        id="update-material"
                        value={updateRequestData.material}
                        onChange={(e) =>
                          setUpdateRequestData({
                            ...updateRequestData,
                            material: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="update-color">Màu sắc</Label>
                      <Input
                        id="update-color"
                        value={updateRequestData.color}
                        onChange={(e) =>
                          setUpdateRequestData({
                            ...updateRequestData,
                            color: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="update-length">Độ dài</Label>
                      <Input
                        id="update-length"
                        value={updateRequestData.length}
                        onChange={(e) =>
                          setUpdateRequestData({
                            ...updateRequestData,
                            length: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      onClick={handleCreateUpdateRequest}
                      disabled={
                        !updateRequestData.title ||
                        !updateRequestData.description ||
                        isCreatingUpdateRequest
                      }
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isCreatingUpdateRequest ? "Đang tạo..." : "Gửi yêu cầu"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowUpdateRequestForm(false);
                        setUpdateRequestData({
                          title: "",
                          description: "",
                          height: 170,
                          weight: 55,
                          bust: 85,
                          waist: 60,
                          hip: 90,
                          armpit: 40,
                          bicep: 30,
                          neck: 35,
                          shoulderWidth: 40,
                          sleeveLength: 60,
                          backLength: 40,
                          lowerWaist: 20,
                          waistToFloor: 60,
                          material: "Cotton",
                          color: "Đỏ",
                          length: "Dài",
                          neckline: "Cổ tròn",
                          sleeve: "Tay ngắn",
                          images: "",
                        });
                      }}
                    >
                      Hủy
                    </Button>
                  </div>
                </div>
              )}

              {/* Danh sách yêu cầu chỉnh sửa */}
              {updateRequestsData?.items &&
                updateRequestsData.items.length > 0 && (
                  <div className="border-t pt-4">
                    <h5 className="font-medium text-blue-800 mb-3">
                      Danh sách yêu cầu đã gửi:
                    </h5>
                    <div className="space-y-3">
                      {updateRequestsData.items.map((request) => (
                        <div
                          key={request.id}
                          className="bg-white p-3 rounded-lg border"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h6 className="font-medium">{request.title}</h6>
                              <p className="text-sm text-gray-600">
                                {request.description}
                              </p>
                              <div className="text-xs text-gray-500 mt-2">
                                <span className="mr-4">
                                  Chiều cao: {request.height}cm
                                </span>
                                <span className="mr-4">
                                  Cân nặng: {request.weight}kg
                                </span>
                                <span className="mr-4">
                                  Vòng ngực: {request.bust}cm
                                </span>
                                <span className="mr-4">
                                  Vòng eo: {request.waist}cm
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-2 ml-4">
                              <Badge
                                variant="outline"
                                className={
                                  request.status === "PENDING"
                                    ? "border-yellow-300 text-yellow-700"
                                    : request.status === "ACCEPTED"
                                    ? "border-green-300 text-green-700"
                                    : "border-red-300 text-red-700"
                                }
                              >
                                {request.status === "PENDING"
                                  ? "Chờ xử lý"
                                  : request.status === "ACCEPTED"
                                  ? "Đã chấp nhận"
                                  : "Đã từ chối"}
                              </Badge>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleViewUpdateRequestDetail(request.id)
                                  }
                                  className="text-xs"
                                >
                                  Xem chi tiết
                                </Button>
                                {request.status === "PENDING" && (
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() =>
                                      handleDeleteUpdateRequest(request.id)
                                    }
                                    disabled={isDeletingUpdateRequest}
                                    className="text-xs"
                                  >
                                    {isDeletingUpdateRequest
                                      ? "Đang xóa..."
                                      : "Xóa"}
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialog xem chi tiết yêu cầu cập nhật */}
      {showUpdateRequestDetail && updateRequestDetail?.item && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-blue-800">
                  Chi tiết yêu cầu chỉnh sửa
                </h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowUpdateRequestDetail(null)}
                >
                  Đóng
                </Button>
              </div>

              <div className="bg-white p-4 rounded-lg border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h6 className="font-medium text-lg">
                      {updateRequestDetail.item.title}
                    </h6>
                    <p className="text-gray-600 mt-2">
                      {updateRequestDetail.item.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant="outline"
                      className={
                        updateRequestDetail.item.status === "PENDING"
                          ? "border-yellow-300 text-yellow-700"
                          : updateRequestDetail.item.status === "ACCEPTED"
                          ? "border-green-300 text-green-700"
                          : "border-red-300 text-red-700"
                      }
                    >
                      {updateRequestDetail.item.status === "PENDING"
                        ? "Chờ xử lý"
                        : updateRequestDetail.item.status === "ACCEPTED"
                        ? "Đã chấp nhận"
                        : "Đã từ chối"}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div>
                    <Label className="text-xs text-gray-500">Chiều cao</Label>
                    <p className="font-medium">
                      {updateRequestDetail.item.height} cm
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Cân nặng</Label>
                    <p className="font-medium">
                      {updateRequestDetail.item.weight} kg
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Vòng ngực</Label>
                    <p className="font-medium">
                      {updateRequestDetail.item.bust} cm
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Vòng eo</Label>
                    <p className="font-medium">
                      {updateRequestDetail.item.waist} cm
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Vòng mông</Label>
                    <p className="font-medium">
                      {updateRequestDetail.item.hip} cm
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Chất liệu</Label>
                    <p className="font-medium">
                      {updateRequestDetail.item.material}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Màu sắc</Label>
                    <p className="font-medium">
                      {updateRequestDetail.item.color}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Độ dài</Label>
                    <p className="font-medium">
                      {updateRequestDetail.item.length}
                    </p>
                  </div>
                </div>

                <div className="mt-4 text-xs text-gray-500">
                  <p>
                    Ngày tạo:{" "}
                    {new Date(
                      updateRequestDetail.item.createdAt
                    ).toLocaleDateString("vi-VN")}
                  </p>
                  <p>
                    Cập nhật lần cuối:{" "}
                    {new Date(
                      updateRequestDetail.item.updatedAt
                    ).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>
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
