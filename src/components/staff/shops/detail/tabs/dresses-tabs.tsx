'use client';

import { ErrorCard } from '@/components/error-card';
import { GoBackButton } from '@/components/go-back-button';
import { LoadingItem } from '@/components/loading-item';
import { PagingComponent } from '@/components/paging-component';
import { DressDetailDialog } from '@/components/shops/my/dresses/dress-detail-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TabsContent } from '@/components/ui/tabs';
import { useDebounce } from '@/hooks/use-debounce';
import {
  dressStatusColors,
  dressStatusLabels,
  formatPrice,
  getCoverImage,
} from '@/lib/products-utils';
import { usePaging } from '@/providers/paging.provider';
import { useLazyGetShopDressesQuery } from '@/services/apis';
import { IDress, IShop } from '@/services/types';
import { Eye, RefreshCw, Search } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface DressesTabsProps {
  shop: IShop;
  onUpdate?: () => void;
}

export const DressesTabs = ({ shop }: DressesTabsProps) => {
  const [dresses, setDresses] = useState<IDress[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [trigger, { isLoading }] = useLazyGetShopDressesQuery();
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const debouncedSearchTerm = useDebounce<string>(searchTerm, 300);
  const { setPaging, pageSize, pageIndex, totalItems, resetPaging } = usePaging();

  const fetchDresses = useCallback(async () => {
    try {
      const { statusCode, message, items, ...paging } = await trigger({
        id: shop.id,
        filter: debouncedSearchTerm ? `name:like:${debouncedSearchTerm}` : '',
        sort: `updatedAt:desc`,
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
        setError('');
        setIsError(false);
      } else {
        setIsError(true);
        setError(message);
      }
    } catch (error) {
      console.error(error);
      setIsError(true);
      setError('Đã xảy ra lỗi khi tải dữ liệu sản phẩm của cửa hàng');
    }
  }, [shop, trigger, debouncedSearchTerm, pageIndex, pageSize, setPaging, setIsError, setError]);

  useEffect(() => {
    resetPaging();
    fetchDresses();
  }, [debouncedSearchTerm, fetchDresses, resetPaging]);

  useEffect(() => {
    fetchDresses();
  }, [debouncedSearchTerm, pageIndex, pageSize, fetchDresses]);

  if (isError) {
    return (
      <TabsContent value="dresses">
        <Card>
          <CardHeader className="items-center justify-center">
            <CardTitle className="text-red-500">Đã có lỗi xảy ra khi tải dữ liệu</CardTitle>
            <CardDescription className="flex items-center justify-center gap-4">
              <GoBackButton />
              <Button
                className="flex items-center justify-center gap-2 bg-rose-500 text-white"
                onClick={fetchDresses}
              >
                <RefreshCw className={`size-4 ${isLoading ? 'animate-spin' : ''}`} />
                Thử lại
              </Button>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ErrorCard message={error} />
          </CardContent>
        </Card>
      </TabsContent>
    );
  }

  if (isLoading) {
    return (
      <TabsContent value="dresses">
        <LoadingItem />
      </TabsContent>
    );
  }

  return (
    <TabsContent value="dresses">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center justify-between space-x-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm váy..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <CardDescription>
              Hiển thị {dresses.length}/{totalItems} váy cưới
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
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
                    <TableCell className="text-right flex item-center justify-end">
                      <DressDetailDialog
                        dress={dress}
                        trigger={
                          <Button
                            className="flex items-center cursor-pointer justify-center"
                            variant="outline"
                            size="icon"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <PagingComponent />
        </CardContent>
      </Card>
    </TabsContent>
  );
};
