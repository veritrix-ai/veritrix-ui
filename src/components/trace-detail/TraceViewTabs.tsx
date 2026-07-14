import { ChevronDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type TraceViewMode = "waterfall" | "tree" | "graph";
export type TraceDetailTab = "view" | "agents" | "terminal";

interface TraceViewTabsProps {
  activeTab: TraceDetailTab;
  activeView: TraceViewMode;
  onTabChange: (tab: TraceDetailTab) => void;
  onViewChange: (view: TraceViewMode) => void;
}

const VIEW_OPTIONS: { id: TraceViewMode; label: string }[] = [
  { id: "waterfall", label: "Waterfall View" },
  { id: "tree", label: "Tree View" },
  { id: "graph", label: "Graph View" },
];

export function TraceViewTabs({
  activeTab,
  activeView,
  onTabChange,
  onViewChange,
}: TraceViewTabsProps) {
  const viewLabel =
    VIEW_OPTIONS.find((option) => option.id === activeView)?.label ?? "Waterfall View";

  return (
    <div className="mt-8 flex items-center gap-6 border-b">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={cn(
              "inline-flex items-center gap-1.5 border-b-2 pb-3 text-sm font-medium transition-colors",
              activeTab === "view"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {viewLabel}
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {VIEW_OPTIONS.map((option) => (
            <DropdownMenuItem
              key={option.id}
              onClick={() => {
                onTabChange("view");
                onViewChange(option.id);
              }}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <button
        type="button"
        onClick={() => onTabChange("agents")}
        className={cn(
          "border-b-2 pb-3 text-sm font-medium transition-colors",
          activeTab === "agents"
            ? "border-primary text-foreground"
            : "border-transparent text-muted-foreground hover:text-foreground",
        )}
      >
        Agents
      </button>

      <button
        type="button"
        onClick={() => onTabChange("terminal")}
        className={cn(
          "border-b-2 pb-3 text-sm font-medium transition-colors",
          activeTab === "terminal"
            ? "border-primary text-foreground"
            : "border-transparent text-muted-foreground hover:text-foreground",
        )}
      >
        Terminal Logs
      </button>
    </div>
  );
}
