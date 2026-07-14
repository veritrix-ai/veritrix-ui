import { Navigate } from "react-router-dom";

import { AuthShell } from "@/components/auth/AuthShell";
import { EmbeddedSignIn } from "@/components/auth/EmbeddedSignIn";
import { isDesignMode } from "@/lib/design-mode";

export function LoginPage() {
  if (isDesignMode()) {
    return <Navigate to="/projects" replace />;
  }

  return (
    <AuthShell mode="sign-in">
      <EmbeddedSignIn />
    </AuthShell>
  );
}
