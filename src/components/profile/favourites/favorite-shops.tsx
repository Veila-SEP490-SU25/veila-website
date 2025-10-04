'use client';

import { PagingComponent } from '@/components/paging-component';
import { ShopCard } from '@/components/profile/favourites/shop-card';
import { isSuccess } from '@/lib/utils';
import { usePaging } from '@/providers/paging.provider';
import { useLazyGetFavoriteShopsQuery } from '@/services/apis';
import { IShop } from '@/services/types';
import { useCallback, useEffect, useState } from 'react';

export const FavoriteShopsTab = () => {
  const [trigger] = useLazyGetFavoriteShopsQuery();
  const [shops, setShops] = useState<IShop[]>([]);
  const { pageIndex, setPaging } = usePaging();

  const fetchFavorites = useCallback(async () => {
    try {
      const { statusCode, message, items, ...pagination } = await trigger({
        filter: '',
        page: pageIndex,
        size: 8,
        sort: '',
      }).unwrap();
      if (isSuccess(statusCode)) {
        setShops(items);
        setPaging(
          pagination.pageIndex,
          pagination.pageSize,
          pagination.totalItems,
          pagination.totalPages,
          pagination.hasNextPage,
          pagination.hasPrevPage,
        );
      } else {
        setShops([]);
        console.error('Failed to fetch favorite shops:', message);
      }
    } catch (error) {
      console.error('Failed to fetch favorite shops:', error);
    }
  }, [trigger, setPaging, pageIndex]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  return shops.length === 0 ? (
    <div className="w-full text-center">Không có cửa hàng yêu thích</div>
  ) : (
    <div className="w-full space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {shops.map((shop) => (
          <ShopCard key={shop.id} shop={shop} />
        ))}
      </div>
      <PagingComponent />
    </div>
  );
};
