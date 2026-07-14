import { useState } from "react";
import { Copy } from "lucide-react";

import { cn } from "@/lib/utils";

interface CodeSnippetProps {
  code: string;
  language?: string;
  className?: string;
}

export function CodeSnippet({ code, language = "python", className = "" }: CodeSnippetProps) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className={className}>
      <div className="relative overflow-hidden rounded-xl bg-code text-code-foreground ring-1 ring-white/10">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
          <span className="text-xs font-medium uppercase tracking-wide text-code-muted">
            {language}
          </span>
          <button
            type="button"
            onClick={() => void copyCode()}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md p-2 text-xs font-medium text-code-muted",
              "hover:bg-white/5 hover:text-code-foreground",
            )}
          >
            <Copy className="h-3.5 w-3.5" />
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <pre className="max-h-[420px] overflow-auto p-4 text-sm leading-6 text-code-foreground">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
