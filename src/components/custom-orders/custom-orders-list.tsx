'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useLazyGetCustomOrderRequestsQuery } from '@/services/apis/custom-order.api';
import type { ICustomOrderRequest } from '@/services/types/custom-order.type';
import { customOrderStatusLabels } from '@/services/types/custom-order.type';
import { formatDateShort } from '@/utils/format';
import { Search, Filter, Eye, Calendar, User, Ruler, MessageCircle } from 'lucide-react';

export function CustomOrdersList() {
  const router = useRouter();
  const [requests, setRequests] = useState<ICustomOrderRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  });

  const [getRequests] = useLazyGetCustomOrderRequestsQuery();

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getRequests({
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        filter: searchTerm,
        sort: 'createdAt:desc',
      }).unwrap();

      if (response.items) {
        setRequests(response.items);
        setPagination((prev) => ({
          ...prev,
          totalItems: response.totalItems || 0,
          totalPages: response.totalPages || 0,
        }));
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  }, [getRequests, pagination.pageIndex, pagination.pageSize, searchTerm]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const filteredRequests = requests.filter((request) => {
    if (statusFilter !== 'all' && request.status !== statusFilter) return false;
    return true;
  });

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, pageIndex: newPage }));
  };

  const handlePageSizeChange = (newSize: number) => {
    setPagination((prev) => ({ ...prev, pageSize: newSize, pageIndex: 0 }));
  };

  const handleChat = (request: ICustomOrderRequest) => {
    // Navigate to chat page
    router.push(`/chat?requestId=${request.id}`);
  };

  const handleViewDetail = (requestId: string) => {
    router.push(`/custom-orders/${requestId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="h-12 w-12 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-lg font-medium">Đang tải yêu cầu đặt may...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Bộ lọc
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm theo tiêu đề hoặc mô tả..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={handleStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  {Object.entries(customOrderStatusLabels).map(([status, label]) => (
                    <SelectItem key={status} value={status}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredRequests.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="text-muted-foreground">
                <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Không có yêu cầu đặt may nào</p>
                <p className="text-sm">Hãy thử thay đổi bộ lọc hoặc tìm kiếm</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredRequests.map((request) => (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{request.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDateShort(request.createdAt)}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleChat(request)}
                      className="flex items-center gap-2"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Nhắn tin ngay
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetail(request.id)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Xem chi tiết
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Customer Information */}
                <div className="flex items-center gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      KH
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900">Khách hàng</h4>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>Yêu cầu đặt may</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">{request.description}</p>

                {/* Measurements */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Ruler className="h-4 w-4 text-muted-foreground" />
                    <span>Chiều cao: {request.height}cm</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Ruler className="h-4 w-4 text-muted-foreground" />
                    <span>Cân nặng: {request.weight}kg</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Ruler className="h-4 w-4 text-muted-foreground" />
                    <span>Ngực: {request.bust}cm</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Ruler className="h-4 w-4 text-muted-foreground" />
                    <span>Eo: {request.waist}cm</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Ruler className="h-4 w-4 text-muted-foreground" />
                    <span>Mông: {request.hip}cm</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Ruler className="h-4 w-4 text-muted-foreground" />
                    <span>Nách: {request.armpit}cm</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Ruler className="h-4 w-4 text-muted-foreground" />
                    <span>Bắp tay: {request.bicep}cm</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Ruler className="h-4 w-4 text-muted-foreground" />
                    <span>Cổ: {request.neck}cm</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Ruler className="h-4 w-4 text-muted-foreground" />
                    <span>Vai: {request.shoulderWidth}cm</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Ruler className="h-4 w-4 text-muted-foreground" />
                    <span>Tay áo: {request.sleeveLength}cm</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Ruler className="h-4 w-4 text-muted-foreground" />
                    <span>Lưng: {request.backLength}cm</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Ruler className="h-4 w-4 text-muted-foreground" />
                    <span>Eo dưới: {request.lowerWaist}cm</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Ruler className="h-4 w-4 text-muted-foreground" />
                    <span>Eo đến sàn: {request.waistToFloor}cm</span>
                  </div>
                </div>

                {/* Style Details - Only show if not null */}
                {(request.material ||
                  request.color ||
                  request.length ||
                  request.neckline ||
                  request.sleeve) && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {request.material && <Badge variant="outline">{request.material}</Badge>}
                    {request.color && <Badge variant="outline">{request.color}</Badge>}
                    {request.length && <Badge variant="outline">{request.length}</Badge>}
                    {request.neckline && <Badge variant="outline">{request.neckline}</Badge>}
                    {request.sleeve && <Badge variant="outline">{request.sleeve}</Badge>}
                  </div>
                )}

                {/* Images - Only show if available */}
                {request.images && (
                  <div className="mt-4">
                    <h5 className="font-medium text-gray-900 mb-2">Hình ảnh tham khảo:</h5>
                    <div className="flex gap-2 overflow-x-auto">
                      {request.images.split(',').map((image, index) => (
                        <Image
                          key={index}
                          src={image.trim()}
                          alt={`Hình ảnh ${index + 1}`}
                          width={80}
                          height={80}
                          className="object-cover rounded-lg border"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Hiển thị {pagination.pageIndex * pagination.pageSize + 1} -{' '}
                {Math.min((pagination.pageIndex + 1) * pagination.pageSize, pagination.totalItems)}{' '}
                trong tổng số {pagination.totalItems} yêu cầu
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={pagination.pageSize.toString()}
                  onValueChange={(value) => handlePageSizeChange(parseInt(value))}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.pageIndex - 1)}
                    disabled={pagination.pageIndex === 0}
                  >
                    Trước
                  </Button>
                  <span className="px-3 py-2 text-sm">
                    {pagination.pageIndex + 1} / {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.pageIndex + 1)}
                    disabled={pagination.pageIndex >= pagination.totalPages - 1}
                  >
                    Sau
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
