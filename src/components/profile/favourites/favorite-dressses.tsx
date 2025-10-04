'use client';

import { DressCard } from '@/components/dress-card';
import { PagingComponent } from '@/components/paging-component';
import { isSuccess } from '@/lib/utils';
import { usePaging } from '@/providers/paging.provider';
import { useLazyGetFavoritesQuery } from '@/services/apis';
import { IDress } from '@/services/types';
import { useCallback, useEffect, useState } from 'react';

export const FavoriteDressesTab = () => {
  const [trigger] = useLazyGetFavoritesQuery();
  const { pageIndex, setPaging } = usePaging();
  const [dresses, setDresses] = useState<IDress[]>([]);

  const fetchFavorites = useCallback(async () => {
    try {
      const { statusCode, message, items, ...pagination } = await trigger({
        filter: '',
        page: pageIndex,
        size: 8,
        sort: '',
      }).unwrap();
      if (isSuccess(statusCode)) {
        setDresses(items);
        setPaging(
          pagination.pageIndex,
          pagination.pageSize,
          pagination.totalItems,
          pagination.totalPages,
          pagination.hasNextPage,
          pagination.hasPrevPage,
        );
      } else {
        setDresses([]);
        console.error('Failed to fetch favorite dresses:', message);
      }
    } catch (error) {
      console.error('Failed to fetch favorite dresses:', error);
    }
  }, [trigger, setPaging, pageIndex]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  return dresses.length === 0 ? (
    <div className="w-full text-center">Không có váy yêu thích</div>
  ) : (
    <div className="w-full space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dresses.map((dress) => (
          <DressCard key={dress.id} dress={dress} />
        ))}
      </div>
      <PagingComponent />
    </div>
  );
};
