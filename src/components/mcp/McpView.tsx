import { useState } from "react";
import { ChevronRight } from "lucide-react";

import { ConfigCodeBlock } from "@/components/mcp/ConfigCodeBlock";
import {
  MCP_FEEDBACK_URL,
  MCP_INSTALL_TARGETS,
  MCP_TOOLS,
  type McpInstallTarget,
} from "@/components/mcp/mcp-content";
import { cn } from "@/lib/utils";

interface McpViewProps {
  apiKey: string;
}

function InstallPanel({ target, apiKey }: { target: McpInstallTarget; apiKey: string }) {
  const config = target.buildConfig(apiKey);

  return (
    <div className="border-t px-4 pb-4 pt-3">
      {target.intro && <p className="text-sm text-muted-foreground">{target.intro}</p>}

      {target.paths && target.paths.length > 0 && (
        <dl className="mt-3 space-y-2">
          {target.paths.map((entry) => (
            <div key={entry.platform} className="flex flex-wrap gap-x-2 text-sm">
              <dt className="font-medium text-foreground">{entry.platform}:</dt>
              <dd className="font-mono text-muted-foreground">{entry.path}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className="mt-4">
        <ConfigCodeBlock
          filename={target.filename ?? (target.language === "bash" ? "terminal" : "config.json")}
          code={config}
          language={target.language}
        />
      </div>
    </div>
  );
}

export function McpView({ apiKey }: McpViewProps) {
  const [openId, setOpenId] = useState("cursor");

  const toggle = (id: string) => {
    setOpenId((current) => (current === id ? "" : id));
  };

  return (
    <div className="max-w-3xl">
      <div className="rounded-xl border border-primary/30 bg-secondary px-4 py-3 text-sm text-secondary-foreground dark:bg-accent dark:text-accent-foreground">
        The Veritrix MCP Server is currently in beta. We&apos;d love to hear your feedback!{" "}
        <a
          href={MCP_FEEDBACK_URL}
          className="font-medium text-primary underline hover:text-primary/80"
        >
          Share your thoughts here
        </a>
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-foreground">Installation</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose your IDE or tool to get started with the Veritrix MCP server.
        </p>

        <div className="mt-5 divide-y overflow-hidden rounded-xl border-0 bg-card shadow-sm">
          {MCP_INSTALL_TARGETS.map((target) => {
            const isOpen = openId === target.id;
            return (
              <div key={target.id}>
                <button
                  type="button"
                  onClick={() => toggle(target.id)}
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted/60"
                  aria-expanded={isOpen}
                >
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                      isOpen && "rotate-90",
                    )}
                  />
                  {target.label}
                </button>
                {isOpen && <InstallPanel target={target} apiKey={apiKey} />}
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-foreground">Available Tools</h2>

        <ul className="mt-6 space-y-8">
          {MCP_TOOLS.map((tool) => (
            <li key={tool.name}>
              <h3 className="font-mono text-sm font-semibold text-foreground">{tool.name}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {tool.description}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Parameters:</span> {tool.parameters}
              </p>
              {tool.returns && (
                <p className="mt-1 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Returns:</span> {tool.returns}
                </p>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
