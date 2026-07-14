import { useState } from "react";
import { Copy, Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";

interface ApiKeyFieldProps {
  apiKey: string;
  className?: string;
}

function maskApiKey(apiKey: string): string {
  if (apiKey.length <= 8) return apiKey;
  const visibleSuffix = apiKey.slice(-8);
  return `${"•".repeat(Math.min(apiKey.length - 8, 32))}${visibleSuffix}`;
}

export function ApiKeyField({ apiKey, className = "" }: ApiKeyFieldProps) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const displayValue = visible ? apiKey : maskApiKey(apiKey);

  const copyKey = async () => {
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "min-w-0 flex-1 rounded-lg border-0 bg-muted px-3 py-2.5",
            visible && "bg-secondary",
          )}
        >
          <p className="truncate font-mono text-sm text-primary">{displayValue || "No API key yet"}</p>
        </div>

        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label={visible ? "Hide API key" : "Show API key"}
        >
          {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>

        <button
          type="button"
          onClick={() => void copyKey()}
          className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Copy API key"
          disabled={!apiKey}
        >
          <Copy className="h-5 w-5" />
        </button>
      </div>

      {copied && (
        <p className="mt-2 text-right text-xs font-medium text-emerald-600">Copied to clipboard</p>
      )}
    </div>
  );
}
