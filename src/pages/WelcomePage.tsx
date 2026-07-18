import { Navigate } from "react-router-dom";

import { WelcomeFlow } from "@/components/welcome/WelcomeFlow";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";
import { isDesignMode } from "@/lib/design-mode";

function WelcomeContent() {
  const workspace = useWorkspace();

  if (workspace.provisioned) {
    return <Navigate to="/projects" replace />;
  }

  return <WelcomeFlow />;
}

export function WelcomePage() {
  if (isDesignMode()) {
    return <Navigate to="/projects" replace />;
  }
  return <WelcomeContent />;
}
