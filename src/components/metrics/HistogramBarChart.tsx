import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { CHART_COLORS, chartYDomain } from "@/components/metrics/MetricsChartCard";
import type { MetricsHistogramBucket } from "@/lib/types";

interface HistogramBarChartProps {
  data: MetricsHistogramBucket[];
  rotateLabels?: boolean;
  color?: string;
}

export function HistogramBarChart({
  data,
  rotateLabels = false,
  color = CHART_COLORS.bar,
}: HistogramBarChartProps) {
  const maxValue = Math.max(0, ...data.map((bucket) => bucket.value));
  const [, yMax] = chartYDomain(maxValue);

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={data}
        margin={{ top: 8, right: 12, left: -8, bottom: rotateLabels ? 24 : 0 }}
      >
        <CartesianGrid stroke={CHART_COLORS.grid} strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: CHART_COLORS.axis, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          interval={0}
          angle={rotateLabels ? -35 : 0}
          textAnchor={rotateLabels ? "end" : "middle"}
          height={rotateLabels ? 48 : 30}
        />
        <YAxis
          domain={[0, yMax]}
          allowDecimals={false}
          tick={{ fill: CHART_COLORS.axis, fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={36}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: "1px solid #e6e7e9",
            background: "#ffffff",
            color: "#0c0f14",
            fontSize: 12,
          }}
        />
        <Bar dataKey="value" fill={color} radius={[6, 6, 0, 0]} maxBarSize={32} />
      </BarChart>
    </ResponsiveContainer>
  );
}
