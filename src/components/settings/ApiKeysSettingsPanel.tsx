import { useState } from "react";
import { Check, Copy, Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";

export interface ApiKeyEntry {
  projectName: string;
  apiKey: string;
}

interface ApiKeysSettingsPanelProps {
  organizationName: string;
  orgId: string;
  apiKeys: ApiKeyEntry[];
}

function maskApiKey(apiKey: string): string {
  if (apiKey.length <= 8) return apiKey;
  const visibleSuffix = apiKey.slice(-8);
  return `${"•".repeat(Math.min(apiKey.length - 8, 24))}${visibleSuffix}`;
}

export function ApiKeysSettingsPanel({
  organizationName,
  orgId,
  apiKeys,
}: ApiKeysSettingsPanelProps) {
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [copiedProject, setCopiedProject] = useState<string | null>(null);
  const [copiedOrgId, setCopiedOrgId] = useState(false);

  const toggleVisibility = (projectName: string) => {
    setVisibleKeys((current) => ({
      ...current,
      [projectName]: !current[projectName],
    }));
  };

  const copyKey = async (projectName: string, apiKey: string) => {
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopiedProject(projectName);
      window.setTimeout(() => setCopiedProject(null), 2000);
    } catch {
      setCopiedProject(null);
    }
  };

  const copyOrgId = async () => {
    try {
      await navigator.clipboard.writeText(orgId);
      setCopiedOrgId(true);
      window.setTimeout(() => setCopiedOrgId(false), 2000);
    } catch {
      setCopiedOrgId(false);
    }
  };

  return (
    <section className="rounded-xl border-0 bg-card p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">API Keys</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Access keys across your organizations and projects.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">{organizationName}</h3>
          <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">
            Hobby
          </span>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <div className="rounded-lg border-0 bg-muted/40 px-3 py-2.5">
          <p className="mb-1.5 text-xs font-medium text-muted-foreground">Organization ID</p>
          <div className="flex items-center gap-1.5">
            <div className="min-w-0 flex-1 rounded-md border-0 bg-card px-2.5 py-1.5">
              <p className="truncate font-mono text-xs text-foreground/80">{orgId}</p>
            </div>
            <button
              type="button"
              onClick={copyOrgId}
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
              aria-label="Copy organization ID"
            >
              {copiedOrgId ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {apiKeys.map((entry) => {
          const isVisible = visibleKeys[entry.projectName] ?? false;
          const displayValue = isVisible ? entry.apiKey : maskApiKey(entry.apiKey);

          return (
            <div
              key={entry.projectName}
              className="rounded-lg border-0 bg-muted/40 px-3 py-2.5"
            >
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">
                {entry.projectName}
              </p>
              <div className="flex items-center gap-1.5">
                <div
                  className={cn(
                    "min-w-0 flex-1 rounded-md border-0 bg-card px-2.5 py-1.5",
                    isVisible && "bg-[#f0fafc]",
                  )}
                >
                  <p className="truncate font-mono text-xs text-primary">{displayValue}</p>
                </div>

                <button
                  type="button"
                  onClick={() => toggleVisibility(entry.projectName)}
                  className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
                  aria-label={isVisible ? "Hide API key" : "Show API key"}
                >
                  {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => copyKey(entry.projectName, entry.apiKey)}
                  className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
                  aria-label="Copy API key"
                >
                  {copiedProject === entry.projectName ? (
                    <Check className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
