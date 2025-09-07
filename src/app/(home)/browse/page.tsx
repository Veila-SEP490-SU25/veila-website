'use client';

import { useEffect, useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Search,
  ShoppingBag,
  Filter,
  Grid3X3,
  List,
  Star,
  Clock,
  ChevronDown,
  X,
} from 'lucide-react';
import { IDress } from '@/services/types';
import { useLazyGetDressesQuery } from '@/services/apis';
import { formatPrice, parseNumber } from '@/lib/products-utils';
import { useDebounce } from '@/hooks/use-debounce';
import { usePaging } from '@/providers/paging.provider';
import { PagingComponent } from '@/components/paging-component';
import { DressCard } from '@/components/dress-card';
import { RequireAuth } from '@/components/auth/require-auth';
import { DressCardSkeleton } from '@/components/ui/loading-skeleton';

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dresses, setDresses] = useState<IDress[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('name:asc');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [, setSelectedCategories] = useState<string[]>([]);
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');

  const [getDresses, { isLoading }] = useLazyGetDressesQuery();
  const { pageIndex, pageSize, totalItems, setPaging, resetPaging } = usePaging();

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const fetchDresses = useCallback(async () => {
    try {
      // Tạo filter string theo format đúng: [field]:[operator]:[value]
      const filters: string[] = [];

      if (debouncedSearchQuery) {
        filters.push(`name:like:${debouncedSearchQuery}`);
      }

      if (priceRange.min) {
        filters.push(`sellPrice:gte:${priceRange.min}`);
      }

      if (priceRange.max) {
        filters.push(`sellPrice:lte:${priceRange.max}`);
      }

      if (availabilityFilter !== 'all') {
        if (availabilityFilter === 'sellable') {
          filters.push(`isSellable:eq:true`);
        } else if (availabilityFilter === 'rentable') {
          filters.push(`isRentable:eq:true`);
        }
      }

      // Kết hợp các filter bằng dấu phẩy
      const filter = filters.join(',');

      const { statusCode, message, items, ...pagination } = await getDresses({
        filter,
        page: pageIndex,
        size: pageSize,
        sort: sortBy,
      }).unwrap();
      if (statusCode === 200) {
        setDresses(items);
        setPaging(
          pagination.pageIndex,
          pagination.pageSize,
          pagination.totalItems,
          pagination.totalPages,
          pagination.hasNextPage,
          pagination.hasPrevPage,
        );
      }
    } catch {}
  }, [
    getDresses,
    debouncedSearchQuery,
    pageIndex,
    pageSize,
    setPaging,
    sortBy,
    priceRange,
    availabilityFilter,
  ]);

  useEffect(() => {
    resetPaging();
  }, [debouncedSearchQuery, resetPaging]);

  useEffect(() => {
    fetchDresses();
  }, [
    pageIndex,
    pageSize,
    debouncedSearchQuery,
    sortBy,
    priceRange,
    availabilityFilter,
    fetchDresses,
  ]);

  const clearFilters = () => {
    setSearchQuery('');
    setPriceRange({ min: '', max: '' });
    setSelectedCategories([]);
    setAvailabilityFilter('all');
    setSortBy('name:asc');
  };

  const sortOptions = [
    { value: 'name:asc', label: 'Tên A-Z' },
    { value: 'name:desc', label: 'Tên Z-A' },
    { value: 'sellPrice:asc', label: 'Giá thấp đến cao' },
    { value: 'sellPrice:desc', label: 'Giá cao đến thấp' },
    { value: 'ratingAverage:desc', label: 'Đánh giá cao nhất' },
    { value: 'createdAt:desc', label: 'Mới nhất' },
  ];

  return (
    <RequireAuth>
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              Duyệt Váy Cưới
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Khám phá chiếc váy cưới hoàn hảo từ bộ sưu tập được tuyển chọn của chúng tôi
            </p>
          </div>

          {/* Search and Filters Bar */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm váy, nhà thiết kế, phong cách..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-lg border-2 border-gray-200 focus:border-rose-500 rounded-xl"
                />
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-12 px-4 pr-10 border-2 border-gray-200 focus:border-rose-500 rounded-xl appearance-none bg-white cursor-pointer"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>

              {/* Filter Toggle */}
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="h-12 px-6 border-2 border-gray-200 hover:border-rose-500 rounded-xl"
              >
                <Filter className="h-5 w-5 mr-2" />
                Bộ lọc
              </Button>

              {/* View Mode Toggle */}
              <div className="flex border-2 border-gray-200 rounded-xl overflow-hidden">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('grid')}
                  className="h-12 px-4 rounded-none"
                >
                  <Grid3X3 className="h-5 w-5" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('list')}
                  className="h-12 px-4 rounded-none"
                >
                  <List className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Active Filters */}
            {(searchQuery || priceRange.min || priceRange.max || availabilityFilter !== 'all') && (
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-600">Bộ lọc:</span>
                {searchQuery && (
                  <Badge variant="secondary" className="gap-2">
                    Tìm kiếm: {searchQuery}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchQuery('')} />
                  </Badge>
                )}
                {priceRange.min && (
                  <Badge variant="secondary" className="gap-2">
                    Giá từ: {priceRange.min}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setPriceRange((prev) => ({ ...prev, min: '' }))}
                    />
                  </Badge>
                )}
                {priceRange.max && (
                  <Badge variant="secondary" className="gap-2">
                    Giá đến: {priceRange.max}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setPriceRange((prev) => ({ ...prev, max: '' }))}
                    />
                  </Badge>
                )}
                {availabilityFilter !== 'all' && (
                  <Badge variant="secondary" className="gap-2">
                    {availabilityFilter === 'sellable' ? 'Chỉ bán' : 'Chỉ thuê'}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setAvailabilityFilter('all')}
                    />
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-rose-600 hover:text-rose-700"
                >
                  Xóa tất cả
                </Button>
              </div>
            )}
          </div>

          {/* Filters Sidebar */}
          {showFilters && (
            <div className="mb-8">
              <Card className="border-2 border-gray-200">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Price Range */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-900">Khoảng giá</h3>
                      <div className="space-y-2">
                        <Input
                          placeholder="Giá tối thiểu"
                          value={priceRange.min}
                          onChange={(e) =>
                            setPriceRange((prev) => ({
                              ...prev,
                              min: e.target.value,
                            }))
                          }
                          className="border-gray-300"
                        />
                        <Input
                          placeholder="Giá tối đa"
                          value={priceRange.max}
                          onChange={(e) =>
                            setPriceRange((prev) => ({
                              ...prev,
                              max: e.target.value,
                            }))
                          }
                          className="border-gray-300"
                        />
                      </div>
                    </div>

                    {/* Availability */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-900">Tình trạng</h3>
                      <div className="space-y-2">
                        {[
                          { value: 'all', label: 'Tất cả' },
                          { value: 'sellable', label: 'Chỉ bán' },
                          { value: 'rentable', label: 'Chỉ thuê' },
                        ].map((option) => (
                          <label
                            key={option.value}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <input
                              type="radio"
                              value={option.value}
                              checked={availabilityFilter === option.value}
                              onChange={(e) => setAvailabilityFilter(e.target.value)}
                              className="text-rose-600"
                            />
                            <span className="text-sm text-gray-700">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Quick Filters */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-900">Lọc nhanh</h3>
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => setSortBy('ratingAverage:desc')}
                        >
                          <Star className="h-4 w-4 mr-2" />
                          Đánh giá cao nhất
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => setSortBy('sellPrice:asc')}
                        >
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          Giá tốt nhất
                        </Button>
                      </div>
                    </div>

                    {/* Clear Filters */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-900">Thao tác</h3>
                      <Button variant="outline" onClick={clearFilters} className="w-full">
                        Xóa bộ lọc
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Results Count */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <p className="text-gray-600">
                {isLoading
                  ? 'Đang tải...'
                  : `Hiển thị ${dresses.length} trong số ${totalItems} váy cưới`}
              </p>
              {!isLoading && dresses.length > 0 && (
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span>
                      Đánh giá cao nhất:{' '}
                      {Math.max(...dresses.map((d) => parseNumber(d.ratingAverage))).toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ShoppingBag className="h-4 w-4 text-green-500" />
                    <span>
                      Giá từ:{' '}
                      {formatPrice(Math.min(...dresses.map((d) => parseNumber(d.sellPrice))))}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Cập nhật gần đây</span>
            </div>
          </div>

          {isLoading && (
            <div
              className={`grid gap-6 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                  : 'grid-cols-1'
              }`}
            >
              {[...Array(12)].map((_, index) => (
                <DressCardSkeleton key={index} />
              ))}
            </div>
          )}

          {!isLoading && dresses.length > 0 && (
            <div
              className={`grid gap-6 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                  : 'grid-cols-1'
              }`}
            >
              {dresses.map((dress) => (
                <DressCard key={dress.id} dress={dress} />
              ))}
            </div>
          )}

          {!isLoading && dresses.length === 0 && (
            <div className="text-center py-16">
              <div className="mx-auto w-32 h-32 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mb-6">
                <ShoppingBag className="h-16 w-16 text-rose-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy váy cưới nào</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Không có váy cưới nào phù hợp với tiêu chí tìm kiếm của bạn. Hãy thử điều chỉnh bộ
                lọc hoặc từ khóa tìm kiếm.
              </p>
              <Button
                onClick={clearFilters}
                className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700"
              >
                Xóa bộ lọc
              </Button>
            </div>
          )}

          {!isLoading && <PagingComponent />}

          {!isLoading && dresses.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-0 py-0 shadow-lg bg-gradient-to-br from-rose-50 to-pink-50">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-rose-600 mb-2">{totalItems}</div>
                    <div className="text-gray-600">Tổng số váy cưới</div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {dresses.filter((d) => d.isSellable).length}
                    </div>
                    <div className="text-gray-600">Váy có thể mua</div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {dresses.filter((d) => d.isRentable).length}
                    </div>
                    <div className="text-gray-600">Váy có thể thuê</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </RequireAuth>
  );
}
