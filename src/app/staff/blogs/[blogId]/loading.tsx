import { PageLoading } from "@/components/ui/page-loading";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-full">
      <PageLoading type="blog" />
    </div>
  );
}
