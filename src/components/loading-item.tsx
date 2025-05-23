import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";

export const LoadingItem = () => {
  return (
    <div className="w-full grid grid-cols-6 gap-2">
      <div className="col-span-1">
        <AspectRatio ratio={1 / 1} className="w-full">
          <Skeleton className="w-full h-full rounded-full" />
        </AspectRatio>
      </div>
      <div className="col-span-5 w-full">
        <div className="flex flex-col gap-2">
          <Skeleton className="w-full h-8 rounded-md" />
          <Skeleton className="w-full h-4 rounded-md" />
          <Skeleton className="w-full h-4 rounded-md" />
        </div>
      </div>
    </div>
  );
};
