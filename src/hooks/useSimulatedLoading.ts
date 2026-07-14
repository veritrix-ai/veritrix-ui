import { useEffect, useState } from "react";

/** Simulates async fetch until real API wiring lands. */
export function useSimulatedLoading(key: string | number = "default", delayMs = 500) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = window.setTimeout(() => setLoading(false), delayMs);
    return () => window.clearTimeout(timer);
  }, [key, delayMs]);

  return loading;
}
