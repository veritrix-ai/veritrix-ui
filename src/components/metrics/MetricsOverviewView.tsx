import { useState, type ReactNode } from "react";
import { Check, ChevronDown, Lock, RefreshCw } from "lucide-react";

import { HistogramBarChart } from "@/components/metrics/HistogramBarChart";
import {
  CHART_COLORS,
  MetricsChartCard,
  MetricsEmptyChart,
} from "@/components/metrics/MetricsChartCard";
import { SpanEndStatesChart } from "@/components/metrics/SpanEndStatesChart";
import { SpanEndStatesDonut } from "@/components/metrics/SpanEndStatesDonut";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatFailRate, formatTraceCost } from "@/lib/format";
import type { MetricsOverviewData } from "@/lib/types";
import { cn } from "@/lib/utils";

type DatePreset = "today" | "7d" | "30d";

const DATE_PRESETS: Array<{ id: DatePreset; label: string; days: number }> = [
  { id: "today", label: "Today", days: 1 },
  { id: "7d", label: "Last 7 days", days: 7 },
  { id: "30d", label: "Last 30 days", days: 30 },
];

interface MetricsOverviewViewProps {
  data: MetricsOverviewData;
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="shadow-sm">
      <CardContent className="px-4 py-4">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <span>{label}</span>
          <span
            className="inline-flex h-4 w-4 items-center justify-center rounded-full border text-[10px]"
            aria-hidden="true"
          >
            i
          </span>
        </div>
        <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{value}</p>
      </CardContent>
    </Card>
  );
}

function SectionHeading({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        <Lock className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
      </div>
      {action}
    </div>
  );
}

export function MetricsOverviewView({ data }: MetricsOverviewViewProps) {
  const [datePreset, setDatePreset] = useState<DatePreset>("30d");
  const { overview } = data;
  const failedSpans = data.failed_spans ?? [];
  const costDistribution = data.trace_cost_distribution ?? [];
  const selectedPreset =
    DATE_PRESETS.find((preset) => preset.id === datePreset) ?? DATE_PRESETS[2];

  const overviewCards = [
    { label: "Total Cost", value: formatTraceCost(overview.total_cost_usd) },
    {
      label: "Tokens generated",
      value: overview.tokens_generated.toLocaleString("en-US"),
    },
    { label: "Fail Rate", value: formatFailRate(overview.fail_rate) },
    {
      label: "Total Events",
      value: overview.total_events.toLocaleString("en-US"),
    },
    {
      label: "Monthly Spans",
      value: `${overview.monthly_spans.toLocaleString("en-US")} / ${overview.monthly_span_limit.toLocaleString("en-US")}`,
    },
  ];

  return (
    <div className="px-10 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[2rem] font-semibold tracking-tight text-foreground">Metrics</h1>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Refresh metrics"
            className="h-8 w-8 text-muted-foreground"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="outline" size="sm" className="h-8 font-normal">
                {selectedPreset.label}
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[10.5rem]">
              {DATE_PRESETS.map((preset) => (
                <DropdownMenuItem
                  key={preset.id}
                  onSelect={() => setDatePreset(preset.id)}
                  className="justify-between gap-4"
                >
                  {preset.label}
                  <Check
                    className={cn(
                      "h-3.5 w-3.5",
                      datePreset === preset.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button type="button" variant="outline" size="sm" className="h-8 font-normal">
            Default Project
            <ChevronDown className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <section className="mt-8">
        <SectionHeading title="Overview" />
        <div className="mt-3 overflow-hidden rounded-xl border border-primary/30 bg-secondary dark:bg-accent">
          <div className="flex flex-wrap items-start justify-between gap-4 px-4 py-3">
            <div className="flex gap-3">
              <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                <InfoDotIcon />
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {datePreset === "today"
                    ? "Showing today"
                    : `Showing last ${selectedPreset.days} days`}
                </p>
                <p className="mt-1 max-w-3xl text-sm text-primary/90">
                  Your Hobby plan includes 30-day data visibility. Upgrade to Pro for 90-day
                  retention, advanced analytics, and more.
                </p>
              </div>
            </div>
            <button
              type="button"
              className="shrink-0 rounded-lg border-0 bg-card px-3 py-1.5 text-sm text-primary hover:bg-secondary"
            >
              View all with Pro
            </button>
          </div>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {overviewCards.map((card) => (
            <MetricCard key={card.label} label={card.label} value={card.value} />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <SectionHeading
          title="Analytics"
          action={
            <button type="button" className="text-sm text-primary hover:underline">
              {overview.monthly_spans.toLocaleString("en-US")} /{" "}
              {overview.monthly_span_limit.toLocaleString("en-US")} spans this month &gt;
            </button>
          }
        />
        <div className="mt-4 grid gap-4 xl:grid-cols-2">
          <MetricsChartCard title="Span End States">
            <SpanEndStatesChart data={data.span_end_states} />
          </MetricsChartCard>
          <MetricsChartCard title="Span End States Distribution">
            <SpanEndStatesDonut distribution={data.span_end_states_distribution} />
          </MetricsChartCard>
        </div>
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-3">
        <MetricsChartCard title="Failed Spans">
          {failedSpans.some((bucket) => bucket.value > 0) ? (
            <HistogramBarChart data={failedSpans} color={CHART_COLORS.fail} />
          ) : (
            <MetricsEmptyChart />
          )}
        </MetricsChartCard>
        <MetricsChartCard title="Trace Cost Distribution">
          {costDistribution.some((bucket) => bucket.value > 0) ? (
            <HistogramBarChart data={costDistribution} rotateLabels />
          ) : (
            <MetricsEmptyChart />
          )}
        </MetricsChartCard>
        <MetricsChartCard title="Spans Per Trace">
          <HistogramBarChart data={data.spans_per_trace} />
        </MetricsChartCard>
      </section>

      <section className="mt-4">
        <MetricsChartCard title="Trace Duration Distribution">
          <HistogramBarChart data={data.trace_duration_distribution} rotateLabels />
        </MetricsChartCard>
      </section>
    </div>
  );
}

function InfoDotIcon() {
  return (
    <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" aria-hidden="true">
      <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M6 5.25V8M6 3.75v.25"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}
