import { format } from "date-fns";

export function formatTraceDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) return `${seconds}s`;
  return `${minutes}m ${seconds}s`;
}

export function formatTraceTimestamp(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatTraceTime(iso: string): string {
  return format(new Date(iso), "HH:mm:ss.SSS");
}

export function formatTraceCost(costUsd: number): string {
  if (costUsd === 0) return "$0.00";
  if (costUsd >= 1) {
    return `$${costUsd.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  return `$${costUsd.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  })}`;
}

export function formatFailRate(rate: number | null): string {
  if (rate === null) return "N/A";
  return `${(rate * 100).toFixed(2)}%`;
}
