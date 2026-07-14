import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function TracesPageSkeleton() {
  return (
    <div className="px-10 py-8" aria-busy="true" aria-label="Loading traces">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <Skeleton className="h-10 w-36" />
        <div className="flex flex-wrap items-center gap-3">
          <Skeleton className="h-10 w-72 rounded-lg" />
          <Skeleton className="h-10 w-40 rounded-lg" />
        </div>
      </div>

      <section className="mt-8">
        <Skeleton className="h-4 w-32" />
        <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="shadow-sm">
              <CardContent className="px-4 py-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="mt-3 h-9 w-28" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Card className="mt-8 overflow-hidden shadow-sm">
        <div className="flex flex-wrap items-center gap-3 border-b px-4 py-3">
          <Skeleton className="h-9 w-72" />
          <Skeleton className="h-9 w-36" />
          <Skeleton className="ml-auto h-9 w-28" />
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[1100px]">
            <div className="grid grid-cols-8 gap-4 border-b bg-muted/50 px-4 py-3">
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={index} className="h-3 w-16" />
              ))}
            </div>

            <div className="divide-y">
              {Array.from({ length: 8 }).map((_, row) => (
                <div key={row} className="grid grid-cols-8 items-center gap-4 px-4 py-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="min-w-0 flex-1 space-y-2">
                      <Skeleton className="h-4 w-36" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-28" />
                  <div className="flex gap-1">
                    <Skeleton className="h-5 w-14 rounded-full" />
                    <Skeleton className="h-5 w-14 rounded-full" />
                  </div>
                  <Skeleton className="h-5 w-14 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-2 w-24 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-14" />
                  <Skeleton className="h-4 w-10" />
                  <Skeleton className="h-4 w-8" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 border-t px-4 py-3">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-36" />
        </div>
      </Card>
    </div>
  );
}
