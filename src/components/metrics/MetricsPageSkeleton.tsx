import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function MetricsPageSkeleton() {
  return (
    <div className="px-10 py-8" aria-busy="true" aria-label="Loading metrics">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <Skeleton className="h-10 w-36" />
        <div className="flex flex-wrap items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-lg" />
          <Skeleton className="h-10 w-80 rounded-lg" />
          <Skeleton className="h-10 w-40 rounded-lg" />
        </div>
      </div>

      <section className="mt-8">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-3 h-20 w-full rounded-xl" />
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <Card key={index} className="shadow-sm">
              <CardContent className="px-4 py-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="mt-3 h-9 w-28" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-44" />
        </div>
        <div className="mt-4 grid gap-4 xl:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <Card key={index} className="overflow-hidden shadow-sm">
              <div className="border-b px-5 py-4">
                <Skeleton className="h-4 w-36" />
              </div>
              <div className="p-4">
                <Skeleton className="h-[220px] w-full rounded-lg" />
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="overflow-hidden shadow-sm">
            <div className="border-b px-5 py-4">
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="p-4">
              <Skeleton className="h-[220px] w-full rounded-lg" />
            </div>
          </Card>
        ))}
      </section>

      <section className="mt-4">
        <Card className="overflow-hidden shadow-sm">
          <div className="border-b px-5 py-4">
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="p-4">
            <Skeleton className="h-[220px] w-full rounded-lg" />
          </div>
        </Card>
      </section>
    </div>
  );
}
