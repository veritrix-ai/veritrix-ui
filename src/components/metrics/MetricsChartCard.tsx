import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Explicit hex — CSS var colors break in Recharts SVG fills. */
export const CHART_COLORS = {
  success: "#2AABEE",
  indeterminate: "#7dd3e8",
  fail: "#dc2626",
  bar: "#2AABEE",
  grid: "#e6e7e9",
  axis: "#6b6e73",
} as const;

export function ChartLegend({
  items,
}: {
  items: Array<{ label: string; color: string }>;
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2 text-xs text-muted-foreground">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: item.color }}
            aria-hidden="true"
          />
          {item.label}
        </div>
      ))}
    </div>
  );
}

export function MetricsChartCard({
  title,
  children,
  action,
  className,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("overflow-hidden rounded-xl border-0 bg-card shadow-sm", className)}>
      <div className="flex flex-row items-center justify-between border-b px-5 py-4">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

export function MetricsEmptyChart() {
  return (
    <div className="relative flex min-h-[220px] items-center justify-center overflow-hidden rounded-lg bg-muted/50">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden="true"
        style={{
          backgroundImage: "radial-gradient(circle, #c5e8f0 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />
      <p className="relative z-10 max-w-[220px] text-center text-sm text-muted-foreground">
        No results found. Try adjusting your filter.
      </p>
    </div>
  );
}

/** Nice Y-axis upper bound from a max data value. */
export function chartYDomain(maxValue: number): [number, number] {
  if (maxValue <= 0) return [0, 1];
  if (maxValue <= 1) return [0, 1];
  const padded = maxValue * 1.15;
  const magnitude = 10 ** Math.floor(Math.log10(padded));
  const normalized = padded / magnitude;
  const nice =
    normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return [0, nice * magnitude];
}
