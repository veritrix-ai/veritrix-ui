import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useWorkspace } from "@/components/workspace/WorkspaceProvider";
import { isDesignMode } from "@/lib/design-mode";

export function RequireProvisioned() {
  const location = useLocation();
  const workspace = useWorkspace();

  if (isDesignMode()) return <Outlet />;

  if (!workspace.provisioned && location.pathname !== "/welcome") {
    return <Navigate to="/welcome" replace />;
  }

  if (workspace.provisioned && location.pathname === "/welcome") {
    return <Navigate to="/projects" replace />;
  }

  return <Outlet />;
}
