import { formatFailRate, formatTraceCost } from "@/lib/format";
import type { TraceMetrics } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TraceMetricsSectionProps {
  metrics: TraceMetrics;
  className?: string;
}

export function TraceMetricsSection({ metrics, className }: TraceMetricsSectionProps) {
  const items = [
    { label: "Total Cost", value: formatTraceCost(metrics.total_cost_usd) },
    { label: "Tokens generated", value: metrics.tokens_generated.toLocaleString() },
    { label: "Fail Rate", value: formatFailRate(metrics.fail_rate) },
    { label: "Total Events", value: metrics.total_events.toLocaleString() },
  ];

  return (
    <section className={cn(className)}>
      <h2 className="text-sm font-semibold text-foreground">Overall metrics</h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <Card key={item.label} className="shadow-sm">
            <CardContent className="px-4 py-4">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <span>{item.label}</span>
                <span
                  className="inline-flex h-4 w-4 items-center justify-center rounded-full border text-[10px]"
                  aria-hidden="true"
                >
                  i
                </span>
              </div>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
                {item.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
