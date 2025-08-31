import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

// Loading skeleton cho dress card
export const DressCardSkeleton = () => (
  <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden bg-white border-0 shadow-md">
    <div className="relative aspect-[3/4] overflow-hidden">
      <Skeleton className="w-full h-full" />

      {/* Top Actions Skeleton */}
      <div className="absolute top-4 right-4 space-y-2">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <Skeleton className="h-10 w-10 rounded-lg" />
      </div>

      {/* Badge Skeleton */}
      <div className="absolute top-4 left-4">
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>

    <CardContent className="p-6">
      <div className="space-y-4">
        {/* Title */}
        <Skeleton className="h-6 w-3/4" />

        {/* Designer Info */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-20" />
        </div>

        {/* Dress Details */}
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="space-y-1">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-10 w-24 rounded-lg" />
        </div>
      </div>
    </CardContent>
  </Card>
);

// Loading skeleton cho shop card
export const ShopCardSkeleton = () => (
  <Card className="overflow-hidden">
    <Skeleton className="w-full h-48" />
    <CardContent className="p-4">
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <Skeleton className="h-12 w-12 rounded-full -mt-8 relative z-10" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
        <Skeleton className="h-8 w-full" />
      </div>
    </CardContent>
  </Card>
);

// Loading skeleton cho blog card
export const BlogCardSkeleton = () => (
  <Card className="overflow-hidden">
    <Skeleton className="w-full h-48" />
    <CardContent className="p-4">
      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex items-center gap-2 pt-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </CardContent>
  </Card>
);

// Loading skeleton cho profile stats
export const ProfileStatsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
    {[...Array(4)].map((_, index) => (
      <Card key={index}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-12" />
            </div>
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

// Loading skeleton cho table rows
export const TableRowSkeleton = ({ columns = 4 }: { columns?: number }) => (
  <div className="flex items-center space-x-4 p-4">
    {[...Array(columns)].map((_, index) => (
      <Skeleton key={index} className="h-4 flex-1" />
    ))}
  </div>
);

// Loading skeleton cho form
export const FormSkeleton = () => (
  <div className="space-y-4">
    <div className="space-y-2">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-10 w-full" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-10 w-full" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-10 w-full" />
    </div>
    <Skeleton className="h-10 w-full" />
  </div>
);

// Loading skeleton cho navigation
export const NavigationSkeleton = () => (
  <div className="flex items-center space-x-4">
    {[...Array(5)].map((_, index) => (
      <Skeleton key={index} className="h-4 w-16" />
    ))}
  </div>
);

// Loading skeleton cho page header
export const PageHeaderSkeleton = () => (
  <div className="mb-8 space-y-2">
    <Skeleton className="h-8 w-1/3" />
    <Skeleton className="h-4 w-2/3" />
  </div>
);
