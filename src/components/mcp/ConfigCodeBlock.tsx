import { useState } from "react";
import { Check, Copy } from "lucide-react";

import { cn } from "@/lib/utils";

interface ConfigCodeBlockProps {
  filename: string;
  code: string;
  language?: string;
}

export function ConfigCodeBlock({ filename, code, language = "json" }: ConfigCodeBlockProps) {
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
    <div className="overflow-hidden rounded-xl bg-slate-900 text-white">
      <div className="flex items-center justify-between border-b border-white/15 px-4 py-2.5">
        <span className="font-mono text-xs text-white/60">{filename}</span>
        <button
          type="button"
          onClick={copyCode}
          className={cn(
            "inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-xs text-white/70",
            "hover:bg-white/10 hover:text-white",
          )}
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="max-h-80 overflow-auto p-4 text-sm leading-6 text-white/90">
        <code>{code}</code>
      </pre>
      <span className="sr-only">{language}</span>
    </div>
  );
}
