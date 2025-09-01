import { Button } from "@/components/ui/button";
import { usePaging } from "@/providers/paging.provider";

export const PagingComponent = () => {
  const {
    pageIndex,
    totalPages,
    hasNext,
    hasPrevious,
    goNext,
    goPrevious,
    gotoPage,
  } = usePaging();

  return (
    <div className="flex items-center justify-between mt-8">
      <div className="text-sm text-gray-600">
        Trang {pageIndex + 1} / {totalPages}
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={pageIndex == 0}
          onClick={goPrevious}
        >
          Trước
        </Button>

        <div className="hidden md:flex gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = pageIndex - 2 + i;
            if (pageNum < 0 || pageNum >= totalPages) return null;

            return (
              <Button
                key={pageNum}
                variant={pageNum === pageIndex ? "default" : "outline"}
                size="sm"
                onClick={() => gotoPage(pageNum)}
                className="w-10"
              >
                {pageNum + 1}
              </Button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={!hasNext}
          onClick={goNext}
        >
          Sau
        </Button>
      </div>
    </div>
  );
};
