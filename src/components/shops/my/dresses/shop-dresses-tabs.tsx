'use client';

import { LoadingItem } from '@/components/loading-item';
import { PagingComponent } from '@/components/paging-component';
import { CreateDressDialog } from '@/components/shops/my/dresses/create-dress-dialog';
import { DeleteDressDialog } from '@/components/shops/my/dresses/delete-dress-dialog';
import { DressDetailDialog } from '@/components/shops/my/dresses/dress-detail-dialog';
import { UpdateDressDialog } from '@/components/shops/my/dresses/update-dress-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useDebounce } from '@/hooks/use-debounce';
import {
  dressStatusColors,
  dressStatusLabels,
  formatPrice,
  getCoverImage,
} from '@/lib/products-utils';
import { usePaging } from '@/providers/paging.provider';
import { useLazyGetMyShopDressesQuery, useUpdateDressMutation } from '@/services/apis';
import { IDress, DressStatus } from '@/services/types';
import {
  AlertCircleIcon,
  Edit,
  Eye,
  MoreHorizontal,
  Search,
  Trash2,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

export const ShopDressesTabs = () => {
  const [dresses, setDresses] = useState<IDress[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [trigger, { isLoading }] = useLazyGetMyShopDressesQuery();
  const [updateDress, { isLoading: isUpdating }] = useUpdateDressMutation();
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [updateTrigger, setUpdateTrigger] = useState<number>(0);

  const debouncedSearchTerm = useDebounce<string>(searchTerm, 300);
  const { setPaging, pageSize, pageIndex, resetPaging } = usePaging();

  const fetchDresses = useCallback(async () => {
    try {
      let filter = '';
      if (debouncedSearchTerm) {
        filter += `name:like:${debouncedSearchTerm}`;
      }
      if (statusFilter !== 'ALL') {
        if (filter) filter += ',';
        filter += `status:eq:${statusFilter}`;
      }

      const { statusCode, message, items, ...paging } = await trigger({
        filter: filter,
        sort: `name:desc`,
        page: pageIndex,
        size: pageSize,
      }).unwrap();
      if (statusCode === 200) {
        setDresses(items);
        setPaging(
          paging.pageIndex,
          paging.pageSize,
          paging.totalItems,
          paging.totalPages,
          paging.hasNextPage,
          paging.hasPrevPage,
        );
      } else {
        setIsError(true);
        setError(message);
      }
    } catch {
      toast.error('Đã xảy ra lỗi khi tải dữ liệu sản phẩm của cửa hàng');
    }
  }, [
    debouncedSearchTerm,
    statusFilter,
    pageIndex,
    pageSize,
    setPaging,
    setIsError,
    setError,
    trigger,
  ]);

  const handleStatusUpdate = useCallback(
    async (dressId: string, newStatus: string, dress: IDress) => {
      try {
        const { statusCode, message } = await updateDress({
          id: dressId,
          categoryId: dress.categoryId,
          name: dress.name,
          description: dress.description || '',
          sellPrice:
            typeof dress.sellPrice === 'string'
              ? parseFloat(dress.sellPrice) || 0
              : dress.sellPrice,
          rentalPrice:
            typeof dress.rentalPrice === 'string'
              ? parseFloat(dress.rentalPrice) || 0
              : dress.rentalPrice,
          isSellable: dress.isSellable,
          isRentable: dress.isRentable,
          status: newStatus as DressStatus,
          images: dress.images || '',
          bust: dress.bust || 0,
          waist: dress.waist || 0,
          hip: dress.hip || 0,
          material: dress.material || '',
          color: dress.color || '',
          length: dress.length || '',
          neckline: dress.neckline || '',
          sleeve: dress.sleeve || '',
        }).unwrap();
        if (statusCode === 200) {
          // Force update state ngay lập tức
          setDresses((prevDresses) => {
            const updatedDresses = prevDresses.map((d) =>
              d.id === dressId ? { ...d, status: newStatus as DressStatus } : d,
            );
            console.log('🔄 Updating dress status:', {
              dressId,
              newStatus,
              updatedDresses,
            });
            return updatedDresses;
          });

          // Force re-render bằng cách trigger update
          setUpdateTrigger((prev) => prev + 1);

          toast.success('Cập nhật trạng thái váy thành công!');
        } else {
          toast.error(message || 'Có lỗi xảy ra khi cập nhật trạng thái');
        }
      } catch {
        toast.error('Có lỗi xảy ra khi cập nhật trạng thái váy');
      }
    },
    [updateDress],
  );

  useEffect(() => {
    resetPaging();
    fetchDresses();
  }, [debouncedSearchTerm, resetPaging, fetchDresses]);

  useEffect(() => {
    fetchDresses();
  }, [debouncedSearchTerm, pageIndex, pageSize, fetchDresses]);

  // Debug: Log khi dresses state thay đổi
  useEffect(() => {
    console.log('🔄 Dresses state updated:', dresses);
  }, [dresses]);

  // Debug: Log khi updateTrigger thay đổi
  useEffect(() => {
    console.log('🔄 Update trigger changed:', updateTrigger);
  }, [updateTrigger]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 items-center justify-between space-x-2">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm váy..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                  <SelectItem value="AVAILABLE">Có sẵn</SelectItem>
                  <SelectItem value="UNAVAILABLE">Không có sẵn</SelectItem>
                  <SelectItem value="OUT_OF_STOCK">Hết hàng</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <CreateDressDialog onSuccess={fetchDresses} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <LoadingItem />
        ) : isError ? (
          <Alert variant={'destructive'} className="mb-4 h-full">
            <AlertCircleIcon />
            <AlertTitle>Đã có lỗi xảy ra trong quá trình lấy dữ liệu</AlertTitle>
            <AlertDescription>
              <p>Chi tiết lỗi:</p>
              <ul className="list-inside list-disc text-sm">
                <li>{error}</li>
              </ul>
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Váy</TableHead>
                    <TableHead>Giá bán</TableHead>
                    <TableHead>Giá thuê</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Số đo</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dresses.map((dress) => (
                    <TableRow key={dress.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-12 w-12 rounded-lg">
                            <AvatarImage
                              src={getCoverImage(dress.images) || '/placeholder.svg'}
                              alt={dress.name}
                            />
                            <AvatarFallback className="rounded-lg">
                              {dress.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{dress.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {dress.color} • {dress.material}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {dress.isSellable && dress.sellPrice ? (
                          <span className="font-medium">
                            {formatPrice(
                              typeof dress.sellPrice === 'string'
                                ? parseFloat(dress.sellPrice) || 0
                                : dress.sellPrice || 0,
                            )}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">Không bán</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {dress.isRentable && dress.rentalPrice ? (
                          <span className="font-medium">
                            {formatPrice(
                              typeof dress.rentalPrice === 'string'
                                ? parseFloat(dress.rentalPrice) || 0
                                : dress.rentalPrice || 0,
                            )}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">Không cho thuê</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            dressStatusColors[dress.status as keyof typeof dressStatusColors]
                          }
                        >
                          {dressStatusLabels[dress.status as keyof typeof dressStatusLabels]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {dress.bust && dress.waist && dress.hip ? (
                            <span>
                              {dress.bust}-{dress.waist}-{dress.hip}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">Chưa có</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <DressDetailDialog
                                dress={dress}
                                trigger={
                                  <Button
                                    className="flex items-center cursor-pointer w-full justify-start"
                                    variant="ghost"
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    Xem chi tiết
                                  </Button>
                                }
                              />
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <UpdateDressDialog
                                dress={dress}
                                trigger={
                                  <Button
                                    className="flex items-center cursor-pointer w-full justify-start"
                                    variant="ghost"
                                  >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Chỉnh sửa
                                  </Button>
                                }
                                onSuccess={fetchDresses}
                              />
                            </DropdownMenuItem>

                            {/* Status Update Options */}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusUpdate(dress.id, DressStatus.AVAILABLE, dress)
                              }
                              className="text-green-600"
                              disabled={isUpdating}
                            >
                              {isUpdating ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <CheckCircle className="h-4 w-4 mr-2" />
                              )}
                              Đặt trạng thái: Có sẵn
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusUpdate(dress.id, DressStatus.UNAVAILABLE, dress)
                              }
                              className="text-orange-600"
                              disabled={isUpdating}
                            >
                              {isUpdating ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <XCircle className="h-4 w-4 mr-2" />
                              )}
                              Đặt trạng thái: Không có sẵn
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusUpdate(dress.id, DressStatus.OUT_OF_STOCK, dress)
                              }
                              className="text-red-600"
                              disabled={isUpdating}
                            >
                              {isUpdating ? (
                                <Loader2 className="h-4 w-2 mr-2 animate-spin" />
                              ) : (
                                <XCircle className="h-4 w-4 mr-2" />
                              )}
                              Đặt trạng thái: Hết hàng
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <DeleteDressDialog
                                dress={dress}
                                onSuccess={fetchDresses}
                                trigger={
                                  <Button
                                    variant="ghost"
                                    className="flex items-center cursor-pointer w-full text-red-600 justify-start"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Xóa
                                  </Button>
                                }
                              />
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <PagingComponent />
          </>
        )}
      </CardContent>
    </Card>
  );
};
