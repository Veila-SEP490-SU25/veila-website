'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Ruler, Clock, EyeOff, CheckCircle, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  useGetCustomRequestByIdQuery,
  useDeleteCustomRequestMutation,
  ICustomRequest,
} from '@/services/apis';
import { formatDateShort } from '@/lib/order-util';

interface CustomRequestDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestId: string;
  onEdit?: (request: ICustomRequest) => void;
  onDelete?: () => void;
}

export const CustomRequestDetail = ({
  open,
  onOpenChange,
  requestId,
  onEdit,
  onDelete,
}: CustomRequestDetailProps) => {
  const { data: requestData, isLoading } = useGetCustomRequestByIdQuery(requestId, {
    skip: !open || !requestId,
  });
  const [deleteCustomRequest] = useDeleteCustomRequestMutation();

  const request = requestData?.item;

  const getStatusBadge = (status: string, isPrivate: boolean) => {
    if (isPrivate) {
      return {
        text: 'Riêng tư',
        className: 'bg-gray-600 text-white',
        icon: EyeOff,
      };
    }

    switch (status) {
      case 'DRAFT':
        return {
          text: 'Nháp',
          className: 'bg-yellow-600 text-white',
          icon: FileText,
        };
      case 'SUBMIT':
        return {
          text: 'Đã đăng',
          className: 'bg-green-600 text-white',
          icon: CheckCircle,
        };
      case 'ACCEPTED':
        return {
          text: 'Đang đặt may',
          className: 'bg-gray-600 text-white',
          icon: CheckCircle,
        };
      default:
        return {
          text: status,
          className: 'bg-gray-600 text-white',
          icon: FileText,
        };
    }
  };

  const handleDelete = async () => {
    if (confirm('Bạn có chắc chắn muốn xóa yêu cầu này?')) {
      try {
        const result = await deleteCustomRequest(requestId).unwrap();
        if (result.statusCode === 200) {
          toast.success('Xóa yêu cầu thành công!');
          onOpenChange(false);
          onDelete?.();
        } else {
          toast.error('Xóa yêu cầu thất bại', { description: result.message });
        }
      } catch (error) {
        toast.error('Có lỗi xảy ra khi xóa yêu cầu');
        console.error('Delete request error:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="min-w-2xl max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết yêu cầu</DialogTitle>
          </DialogHeader>
          <div className="text-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-rose-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!request) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="min-w-2xl max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết yêu cầu</DialogTitle>
          </DialogHeader>
          <div className="text-center py-12">
            <p className="text-gray-600">Không tìm thấy yêu cầu</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const statusBadge = getStatusBadge(request.status, request.isPrivate);
  const Icon = statusBadge.icon;

  const measurementFields = [
    { key: 'height', label: 'Chiều cao', unit: 'cm', value: request.height },
    { key: 'weight', label: 'Cân nặng', unit: 'kg', value: request.weight },
    { key: 'bust', label: 'Vòng ngực', unit: 'cm', value: request.bust },
    { key: 'waist', label: 'Vòng eo', unit: 'cm', value: request.waist },
    { key: 'hip', label: 'Vòng hông', unit: 'cm', value: request.hip },
    { key: 'armpit', label: 'Nách', unit: 'cm', value: request.armpit },
    { key: 'bicep', label: 'Vòng tay', unit: 'cm', value: request.bicep },
    { key: 'neck', label: 'Vòng cổ', unit: 'cm', value: request.neck },
    {
      key: 'shoulderWidth',
      label: 'Rộng vai',
      unit: 'cm',
      value: request.shoulderWidth,
    },
    {
      key: 'sleeveLength',
      label: 'Dài tay áo',
      unit: 'cm',
      value: request.sleeveLength,
    },
    {
      key: 'backLength',
      label: 'Dài lưng',
      unit: 'cm',
      value: request.backLength,
    },
    {
      key: 'lowerWaist',
      label: 'Eo dưới',
      unit: 'cm',
      value: request.lowerWaist,
    },
    {
      key: 'waistToFloor',
      label: 'Eo xuống sàn',
      unit: 'cm',
      value: request.waistToFloor,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-2xl max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Chi tiết yêu cầu đặt may
          </DialogTitle>
          <DialogDescription>Thông tin chi tiết về yêu cầu đặt may của bạn</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{request.title}</h3>
                    <Badge className={statusBadge.className}>
                      <Icon className="h-3 w-3 mr-1" />
                      {statusBadge.text}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Tạo: {formatDateShort(request.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Cập nhật: {formatDateShort(request.updatedAt)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {onEdit && (
                    <Button variant="outline" size="sm" onClick={() => onEdit(request)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Chỉnh sửa
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDelete}
                    className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Xóa
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Mô tả</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{request.description}</p>
                </div>

                {request.images && (
                  <div>
                    <h4 className="font-medium mb-2">Hình ảnh tham khảo</h4>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg text-sm">
                      {request.images}
                    </p>
                  </div>
                )}

                {/* Optional fields */}
                {(request.material ||
                  request.color ||
                  request.length ||
                  request.neckline ||
                  request.sleeve) && (
                  <div>
                    <h4 className="font-medium mb-2">Thông tin bổ sung</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {request.material && (
                        <div>
                          <span className="text-sm text-gray-600">Chất liệu:</span>
                          <p className="font-medium">{request.material}</p>
                        </div>
                      )}
                      {request.color && (
                        <div>
                          <span className="text-sm text-gray-600">Màu sắc:</span>
                          <p className="font-medium">{request.color}</p>
                        </div>
                      )}
                      {request.length && (
                        <div>
                          <span className="text-sm text-gray-600">Độ dài:</span>
                          <p className="font-medium">{request.length}</p>
                        </div>
                      )}
                      {request.neckline && (
                        <div>
                          <span className="text-sm text-gray-600">Kiểu cổ:</span>
                          <p className="font-medium">{request.neckline}</p>
                        </div>
                      )}
                      {request.sleeve && (
                        <div>
                          <span className="text-sm text-gray-600">Kiểu tay:</span>
                          <p className="font-medium">{request.sleeve}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Measurements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ruler className="h-5 w-5" />
                Số đo cơ thể
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {measurementFields.map(({ key, label, unit, value }) => (
                  <div key={key} className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-gray-600">{label}</p>
                    <p className="font-medium text-blue-900">
                      {value}
                      {unit}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
