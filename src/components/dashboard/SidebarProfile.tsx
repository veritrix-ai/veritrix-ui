import { useClerk, useUser } from "@clerk/react";
import { useNavigate } from "react-router-dom";

import { useWorkspaceOptional } from "@/components/workspace/WorkspaceProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { isDesignMode } from "@/lib/design-mode";

interface SidebarProfileProps {
  collapsed?: boolean;
}

function initialsFrom(name: string, email: string): string {
  const source = name.trim() || email.trim();
  const parts = source.split(/[\s@_.-]+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
  }
  return source.slice(0, 2).toUpperCase() || "AO";
}

function ProfileMenu({
  collapsed,
  name,
  email,
  imageUrl,
  onManage,
  onSignOut,
}: {
  collapsed: boolean;
  name: string;
  email: string;
  imageUrl?: string;
  onManage?: () => void;
  onSignOut: () => void;
}) {
  const initials = initialsFrom(name, email);

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            title={collapsed ? name : undefined}
            className={
              collapsed
                ? "h-auto w-full justify-center px-0 py-1"
                : "h-auto w-full justify-start gap-3 px-1 py-1"
            }
          >
            <Avatar>
              {imageUrl && <AvatarImage src={imageUrl} alt={name} />}
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="min-w-0 flex-1 text-left">
                <p className="truncate text-sm font-medium text-foreground">{name}</p>
                <p className="truncate text-xs text-muted-foreground">{email}</p>
              </div>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align={collapsed ? "start" : "center"}
          side={collapsed ? "right" : "top"}
          className="w-44"
        >
          {onManage && (
            <DropdownMenuItem onClick={onManage}>Manage account</DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={onSignOut}>Sign out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {!collapsed && <p className="mt-3 text-[11px] text-muted-foreground">v0.4.21</p>}
    </div>
  );
}

function DesignModeProfile({ collapsed }: { collapsed: boolean }) {
  const navigate = useNavigate();
  const workspace = useWorkspaceOptional();
  const email = workspace?.email ?? "design@veritrix.local";
  const name = workspace?.org_name ?? "Demo User";

  return (
    <ProfileMenu
      collapsed={collapsed}
      name={name}
      email={email}
      onSignOut={() => navigate("/sign-in")}
    />
  );
}

function ClerkProfile({ collapsed }: { collapsed: boolean }) {
  const { user } = useUser();
  const clerk = useClerk();
  const workspace = useWorkspaceOptional();

  const email =
    user?.primaryEmailAddress?.emailAddress ?? workspace?.email ?? "user@veritrix.ai";
  const name = user?.fullName ?? user?.firstName ?? email.split("@")[0] ?? "Veritrix User";

  return (
    <ProfileMenu
      collapsed={collapsed}
      name={name}
      email={email}
      imageUrl={user?.imageUrl}
      onManage={() => clerk.openUserProfile()}
      onSignOut={() => void clerk.signOut({ redirectUrl: "/sign-in" })}
    />
  );
}

export function SidebarProfile({ collapsed = false }: SidebarProfileProps) {
  if (isDesignMode()) {
    return <DesignModeProfile collapsed={collapsed} />;
  }
  return <ClerkProfile collapsed={collapsed} />;
}
