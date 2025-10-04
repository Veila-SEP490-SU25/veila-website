'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, FileText, Clock, CheckCircle, EyeOff, Search, Filter } from 'lucide-react';
import { CreateCustomRequestDialog } from '@/components/profile/custom-requests/create-custom-request-dialog';
import { CustomRequestDetail } from '@/components/profile/custom-requests/custom-request-detail';
import {
  useGetMyCustomRequestsQuery,
  useDeleteCustomRequestMutation,
  ICustomRequest,
} from '@/services/apis';
import { formatDateShort } from '@/lib/order-util';
import { toast } from 'sonner';

export const CustomRequestsTab = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [editRequest, setEditRequest] = useState<ICustomRequest | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Fetch custom requests
  const { data: requestsData, isLoading, refetch } = useGetMyCustomRequestsQuery();
  const [deleteCustomRequest] = useDeleteCustomRequestMutation();

  // Memoize requests to prevent unnecessary re-renders
  const requests = useMemo(() => requestsData?.items || [], [requestsData?.items]);

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

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa yêu cầu này?')) {
      try {
        const result = await deleteCustomRequest(id).unwrap();
        if (result.statusCode === 200) {
          toast.success('Xóa yêu cầu thành công!');
          refetch();
        } else {
          toast.error('Xóa yêu cầu thất bại', { description: result.message });
        }
      } catch (error) {
        toast.error('Có lỗi xảy ra khi xóa yêu cầu');
        console.error('Delete request error:', error);
      }
    }
  };

  // Filter and search requests
  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      // Search filter
      const matchesSearch =
        searchTerm === '' ||
        request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.description.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus = statusFilter === 'all' || request.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [requests, searchTerm, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Yêu cầu đặt may</h2>
          <p className="text-gray-600 mt-1">Quản lý các yêu cầu đặt may tùy chỉnh của bạn</p>
        </div>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-rose-600 hover:bg-rose-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Đăng yêu cầu mới
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm theo tiêu đề hoặc mô tả..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="DRAFT">Nháp</SelectItem>
                  <SelectItem value="SUBMIT">Đã đăng</SelectItem>
                  <SelectItem value="ACCEPTED">Đang đặt may</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Reset Filter Button */}
            {(searchTerm || statusFilter !== 'all') && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
                className="whitespace-nowrap"
              >
                <Filter className="h-4 w-4 mr-2" />
                Xóa bộ lọc
              </Button>
            )}
          </div>

          {/* Results Count */}
          {(searchTerm || statusFilter !== 'all') && (
            <div className="mt-3 text-sm text-gray-600">
              Hiển thị {filteredRequests.length} trong tổng số {requests.length} yêu cầu
            </div>
          )}
        </CardContent>
      </Card>

      {/* Content */}
      <div className="space-y-4">
        {isLoading ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-rose-600 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải yêu cầu...</p>
            </CardContent>
          </Card>
        ) : filteredRequests.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Yêu cầu đặt may
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có yêu cầu nào</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || statusFilter !== 'all'
                    ? 'Không tìm thấy yêu cầu nào phù hợp với bộ lọc của bạn.'
                    : 'Bạn chưa có yêu cầu đặt may nào. Hãy tạo yêu cầu đầu tiên!'}
                </p>
                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="bg-rose-600 hover:bg-rose-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tạo yêu cầu đầu tiên
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request: ICustomRequest) => {
              const statusBadge = getStatusBadge(request.status, request.isPrivate);
              const Icon = statusBadge.icon;

              return (
                <Card key={request.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{request.title}</h3>
                          <Badge className={statusBadge.className}>
                            <Icon className="h-3 w-3 mr-1" />
                            {statusBadge.text}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-3 line-clamp-2">{request.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatDateShort(request.createdAt)}
                          </span>
                          <span>Chiều cao: {request.height}cm</span>
                          <span>Cân nặng: {request.weight}kg</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedRequestId(request.id)}
                        >
                          Xem chi tiết
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(request.id)}
                          className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
                        >
                          Xóa
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Custom Request Dialog */}
      <CreateCustomRequestDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        _onSuccess={() => {
          refetch();
          setIsCreateDialogOpen(false);
        }}
      />

      {/* Edit Custom Request Dialog */}
      <CreateCustomRequestDialog
        open={!!editRequest}
        onOpenChange={(open) => !open && setEditRequest(null)}
        _editData={editRequest}
        _onSuccess={() => {
          refetch();
          setEditRequest(null);
        }}
      />

      {/* Custom Request Detail Dialog */}
      {selectedRequestId && (
        <CustomRequestDetail
          open={!!selectedRequestId}
          onOpenChange={(open) => !open && setSelectedRequestId(null)}
          requestId={selectedRequestId}
          onEdit={(request) => {
            setSelectedRequestId(null);
            setEditRequest(request);
          }}
          onDelete={() => {
            setSelectedRequestId(null);
            refetch();
          }}
        />
      )}
    </div>
  );
};
