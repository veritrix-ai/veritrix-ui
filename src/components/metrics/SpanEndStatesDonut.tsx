import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

import { CHART_COLORS, ChartLegend } from "@/components/metrics/MetricsChartCard";
import type { SpanEndStateDistribution } from "@/lib/types";

interface SpanEndStatesDonutProps {
  distribution: SpanEndStateDistribution;
}

export function SpanEndStatesDonut({ distribution }: SpanEndStatesDonutProps) {
  const total = distribution.success + distribution.indeterminate + distribution.fail;
  const chartData = [
    { name: "Success", value: distribution.success, color: CHART_COLORS.success },
    {
      name: "Indeterminate",
      value: distribution.indeterminate,
      color: CHART_COLORS.indeterminate,
    },
    { name: "Fail", value: distribution.fail, color: CHART_COLORS.fail },
  ].filter((item) => item.value > 0);

  return (
    <div>
      <div className="relative">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={62}
              outerRadius={88}
              paddingAngle={chartData.length > 1 ? 2 : 0}
              strokeWidth={0}
            >
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold text-foreground">
            {total.toLocaleString()}
          </span>
          <span className="text-xs text-muted-foreground">Spans</span>
        </div>
      </div>
      <ChartLegend
        items={[
          { label: "Success", color: CHART_COLORS.success },
          { label: "Indeterminate", color: CHART_COLORS.indeterminate },
          { label: "Fail", color: CHART_COLORS.fail },
        ]}
      />
    </div>
  );
}
