import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

interface SidebarPlanBannerProps {
  collapsed?: boolean;
}

export function SidebarPlanBanner({ collapsed = false }: SidebarPlanBannerProps) {
  if (collapsed) {
    return (
      <div className="px-2 pb-2">
        <Button asChild size="sm" className="w-full" title="Hobby Plan — Upgrade">
          <Link to="/settings?tab=billing">↑</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="px-3 pb-2">
      <Link
        to="/settings?tab=billing"
        className="flex w-full items-center justify-between rounded-lg bg-primary px-3 py-2.5 text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <span className="text-sm font-semibold leading-none">Hobby Plan</span>
        <span className="text-xs font-medium leading-none">Upgrade &gt;</span>
      </Link>
    </div>
  );
}
