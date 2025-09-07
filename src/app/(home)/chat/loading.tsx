import { Skeleton } from '@/components/ui/skeleton';

export default function ChatFirestoreLoading() {
  return (
    <div className="h-screen flex">
      {/* Sidebar Loading */}
      <div className="w-80 border-r bg-background flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-8 w-8" />
          </div>
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="p-2 space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-3 rounded-lg">
              <div className="flex items-start gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Loading */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </div>
        <div className="flex-1 p-4 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-16 w-64 rounded-lg" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>
      </div>
    </div>
  );
}
