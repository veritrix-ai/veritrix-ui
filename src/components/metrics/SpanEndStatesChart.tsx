import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  CHART_COLORS,
  ChartLegend,
  chartYDomain,
} from "@/components/metrics/MetricsChartCard";
import type { SpanEndStatePoint } from "@/lib/types";

interface SpanEndStatesChartProps {
  data: SpanEndStatePoint[];
}

function formatAxisDate(date: string) {
  const [, month, day] = date.split("-");
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${monthNames[Number(month) - 1]} ${Number(day)}`;
}

export function SpanEndStatesChart({ data }: SpanEndStatesChartProps) {
  const chartData = data.map((point) => ({
    ...point,
    label: formatAxisDate(point.date),
  }));

  const maxValue = Math.max(
    0,
    ...chartData.flatMap((point) => [point.success, point.indeterminate, point.fail]),
  );
  const [, yMax] = chartYDomain(maxValue);

  return (
    <div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={chartData} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
          <CartesianGrid stroke={CHART_COLORS.grid} strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: CHART_COLORS.axis, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
            minTickGap={28}
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
          <Line
            type="monotone"
            dataKey="success"
            name="Success"
            stroke={CHART_COLORS.success}
            strokeWidth={2}
            dot={{ r: 3, fill: CHART_COLORS.success, strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="indeterminate"
            name="Indeterminate"
            stroke={CHART_COLORS.indeterminate}
            strokeWidth={2}
            dot={{ r: 3, fill: CHART_COLORS.indeterminate, strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="fail"
            name="Fail"
            stroke={CHART_COLORS.fail}
            strokeWidth={2}
            dot={{ r: 3, fill: CHART_COLORS.fail, strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
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
