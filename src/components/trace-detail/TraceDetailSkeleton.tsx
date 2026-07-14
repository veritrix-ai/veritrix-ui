import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function TraceDetailSkeleton() {
  return (
    <div className="px-10 py-8" aria-busy="true" aria-label="Loading trace details">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-8 w-56" />
          </div>
          <Skeleton className="mt-3 h-4 w-80" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9 rounded-lg" />
          <Skeleton className="h-9 w-9 rounded-lg" />
          <Skeleton className="h-9 w-32 rounded-lg" />
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-28" />
          <div className="ml-auto flex gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-24 rounded-md" />
          <Skeleton className="h-6 w-28 rounded-md" />
          <Skeleton className="h-6 w-36 rounded-md" />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3 border-b pb-3">
        <Skeleton className="h-9 w-28 rounded-lg" />
        <Skeleton className="h-9 w-24 rounded-lg" />
        <Skeleton className="h-9 w-28 rounded-lg" />
        <div className="ml-auto flex gap-2">
          <Skeleton className="h-8 w-28 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
      </div>

      <Card className="mt-6 flex min-h-[640px] overflow-hidden shadow-sm">
        <div className="min-w-0 flex-1 border-0 bg-muted/20">
          <div className="flex flex-wrap items-center gap-2 border-b px-5 py-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-8 w-20 rounded-full" />
            ))}
          </div>

          <div className="space-y-3 px-5 py-5">
            {Array.from({ length: 10 }).map((_, index) => {
              const left = 4 + (index % 4) * 12;
              const width = 18 + ((index * 7) % 28);
              return (
                <div key={index} className="relative h-10 border-b border-dashed border-border/40">
                  <Skeleton
                    className="absolute top-1/2 h-6 -translate-y-1/2 rounded-md"
                    style={{ left: `${left}%`, width: `${width}%` }}
                  />
                  <Skeleton
                    className="absolute top-1/2 h-3 w-28 -translate-y-1/2"
                    style={{ left: `calc(${left}% + ${width}% + 12px)` }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-[420px] shrink-0 xl:w-[460px]">
          <div className="border-b px-5 py-5">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-14 rounded-full" />
              <Skeleton className="h-5 w-10 rounded-full" />
            </div>
            <Skeleton className="mt-3 h-3 w-56" />
            <Skeleton className="mt-3 h-3 w-44" />
          </div>
          <div className="border-b px-5">
            <div className="flex gap-6 py-3">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
          <div className="space-y-4 p-5">
            <div>
              <Skeleton className="mb-2 h-3 w-12" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>
            <div>
              <Skeleton className="mb-2 h-3 w-14" />
              <Skeleton className="h-32 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
