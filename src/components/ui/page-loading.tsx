import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

interface PageLoadingProps {
  type?: "default" | "profile" | "blog" | "shops" | "browse";
}

export const PageLoading: React.FC<PageLoadingProps> = ({
  type = "default",
}) => {
  const renderLoadingContent = () => {
    switch (type) {
      case "profile":
        return (
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8 space-y-2">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
            </div>

            {/* Stats Grid */}
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

            {/* User Cards */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
              <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
            </div>
          </div>
        );

      case "blog":
        return (
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8 space-y-2">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
            </div>

            {/* Search and Filters */}
            <div className="mb-8 space-y-4">
              <Skeleton className="h-10 w-full" />
              <div className="flex gap-4">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>

            {/* Blog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <Card key={index} className="overflow-hidden">
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
              ))}
            </div>
          </div>
        );

      case "shops":
        return (
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8 space-y-2">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
            </div>

            {/* Filters */}
            <div className="mb-6 flex justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>

            {/* Shop Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <Card key={index} className="overflow-hidden">
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
              ))}
            </div>
          </div>
        );

      case "browse":
        return (
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8 space-y-2">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
            </div>

            {/* Search */}
            <div className="mb-8">
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Dress Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(12)].map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <Skeleton className="w-full h-64" />
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-6 rounded-full" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <Skeleton className="h-8 w-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8 space-y-2">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
            </div>

            {/* Content */}
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">{renderLoadingContent()}</div>
  );
};
