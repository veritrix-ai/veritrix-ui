import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BookOpen,
  ChartColumn,
  FolderKanban,
  Moon,
  Network,
  PanelLeftClose,
  PanelLeftOpen,
  ScrollText,
  Settings,
  Sparkles,
  Sun,
} from "lucide-react";

import { VeritrixMark, DashboardLogo } from "@/components/dashboard/DashboardLogo";
import { usePatchNotesModal } from "@/components/dashboard/PatchNotesModalProvider";
import { SidebarPlanBanner } from "@/components/dashboard/SidebarPlanBanner";
import { SidebarProfile } from "@/components/dashboard/SidebarProfile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SIDEBAR_COLLAPSED_KEY = "veritrix-sidebar-collapsed";
const THEME_KEY = "veritrix-theme";

const primaryNav = [
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/traces", label: "Traces", icon: ScrollText },
  { href: "/metrics", label: "Metrics", icon: ChartColumn },
  { href: "/mcp", label: "MCP", icon: Network, badge: "Beta" },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

const secondaryNav = [
  { href: "https://docs.veritrix.ai", label: "Docs", icon: BookOpen, external: true },
] as const;

function isPathActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar() {
  const location = useLocation();
  const { openPatchNotesModal } = usePatchNotesModal();
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setCollapsed(window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true");
    const stored = window.localStorage.getItem(THEME_KEY);
    const initial = stored === "dark" ? "dark" : "light";
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((current) => {
      const next = !current;
      window.localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next));
      return next;
    });
  };

  const toggleTheme = () => {
    setTheme((current) => {
      const next = current === "dark" ? "light" : "dark";
      window.localStorage.setItem(THEME_KEY, next);
      document.documentElement.classList.toggle("dark", next === "dark");
      return next;
    });
  };

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen shrink-0 flex-col border-0 bg-card transition-[width] duration-200 ease-in-out",
        collapsed ? "w-[72px]" : "w-[260px]",
      )}
    >
      {collapsed ? (
        <div className="group relative flex h-[68px] items-center justify-center px-3">
          <Link
            to="/projects"
            className="flex items-center justify-center transition-opacity group-hover:pointer-events-none group-hover:opacity-0"
            aria-label="Veritrix home"
          >
            <VeritrixMark size={28} />
          </Link>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleCollapsed}
            className="absolute inset-x-3 inset-y-4 h-auto w-auto text-muted-foreground opacity-0 group-hover:opacity-100"
            aria-label="Expand sidebar"
          >
            <PanelLeftOpen className="h-5 w-5" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between px-5 py-5">
          <DashboardLogo compact />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleCollapsed}
            className="h-8 w-8 text-muted-foreground"
            aria-label="Collapse sidebar"
          >
            <PanelLeftClose className="h-5 w-5" />
          </Button>
        </div>
      )}

      <nav className={cn("space-y-1", collapsed ? "px-2" : "px-3")}>
        {primaryNav.map((item) => {
          const active = isPathActive(location.pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              to={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center rounded-lg text-sm font-medium transition-colors",
                collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {"badge" in item && item.badge && (
                    <Badge
                      variant={active ? "secondary" : "secondary"}
                      className={cn(
                        "px-2 py-0 text-[10px] uppercase tracking-wide",
                        active && "bg-primary-foreground/20 text-primary-foreground",
                      )}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      <div className={cn("mt-6 space-y-1", collapsed ? "px-2" : "px-3")}>
        <Button
          type="button"
          variant="ghost"
          onClick={openPatchNotesModal}
          title={collapsed ? "Patch Notes" : undefined}
          className={cn(
            "w-full text-muted-foreground",
            collapsed ? "justify-center px-0" : "justify-start gap-3",
          )}
        >
          <Sparkles className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Patch Notes</span>}
        </Button>
        {secondaryNav.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center rounded-lg text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2",
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </a>
          );
        })}
      </div>

      <div className={cn("mt-auto space-y-1 pb-3", collapsed ? "px-2" : "px-3")}>
        <Button
          type="button"
          variant="ghost"
          onClick={toggleTheme}
          title={collapsed ? (theme === "dark" ? "Light Mode" : "Dark Mode") : undefined}
          className={cn("w-full", collapsed ? "justify-center px-0" : "justify-start gap-3")}
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5 shrink-0" />
          ) : (
            <Moon className="h-5 w-5 shrink-0" />
          )}
          {!collapsed && <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>}
        </Button>
      </div>

      <SidebarPlanBanner collapsed={collapsed} />

      <div className={collapsed ? "px-2 py-3" : "px-4 py-4"}>
        <SidebarProfile collapsed={collapsed} />
      </div>
    </aside>
  );
}
