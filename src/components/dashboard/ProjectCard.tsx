import { Link } from "react-router-dom";
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProjectCardProps {
  name: string;
  organization: string;
  traceCount: number;
  isNew?: boolean;
  onRename?: () => void;
  onRemove?: () => void;
}

export function ProjectCard({
  name,
  organization,
  traceCount,
  isNew,
  onRename,
  onRemove,
}: ProjectCardProps) {
  return (
    <div className="relative max-w-xl">
      {isNew && <Badge className="absolute -top-3 left-5 shadow-sm">New Project</Badge>}

      <Card className="border-0 shadow-none">
        <CardContent className="px-5 py-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-foreground">{name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">Organization: {organization}</p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground"
                  aria-label="Project options"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="min-w-[11rem] border border-border bg-popover shadow-lg"
              >
                <DropdownMenuItem
                  className="gap-2"
                  onClick={() => {
                    onRename?.();
                  }}
                >
                  <Pencil className="h-4 w-4" />
                  Rename project
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
                  onClick={() => {
                    onRemove?.();
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-8 flex items-end justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              {traceCount} {traceCount === 1 ? "Trace" : "Traces"}
            </p>

            <Button asChild>
              <Link to="/get-started">
                <Plus className="h-4 w-4" />
                Start
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
