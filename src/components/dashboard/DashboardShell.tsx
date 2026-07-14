import type { ReactNode } from "react";

import { PatchNotesModalProvider } from "@/components/dashboard/PatchNotesModalProvider";
import { Sidebar } from "@/components/dashboard/Sidebar";

interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <PatchNotesModalProvider>
      <div className="flex h-screen overflow-hidden bg-surface text-foreground">
        <Sidebar />
        <main className="min-h-0 flex-1 overflow-y-auto bg-surface">{children}</main>
      </div>
    </PatchNotesModalProvider>
  );
}
