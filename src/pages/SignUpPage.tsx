import { Navigate } from "react-router-dom";

import { AuthShell } from "@/components/auth/AuthShell";
import { EmbeddedSignUp } from "@/components/auth/EmbeddedSignUp";
import { isDesignMode } from "@/lib/design-mode";

export function SignUpPage() {
  if (isDesignMode()) {
    return <Navigate to="/projects" replace />;
  }

  return (
    <AuthShell mode="sign-up">
      <EmbeddedSignUp />
    </AuthShell>
  );
}
