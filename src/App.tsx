import { ClerkProvider } from "@clerk/react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";

import { RequireAuth } from "@/components/auth/RequireAuth";
import { RequireProvisioned } from "@/components/auth/RequireProvisioned";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { WorkspaceProvider } from "@/components/workspace/WorkspaceProvider";
import { getClerkAppearance, useDarkTheme } from "@/lib/clerk-theme";
import { isDesignMode } from "@/lib/design-mode";
import { LoginPage } from "@/pages/LoginPage";
import { GetStartedPage } from "@/pages/GetStartedPage";
import { McpPage } from "@/pages/McpPage";
import { MetricsPage } from "@/pages/MetricsPage";
import { ProjectsPage } from "@/pages/ProjectsPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { SignUpPage } from "@/pages/SignUpPage";
import { TraceDetailPage } from "@/pages/TraceDetailPage";
import { TracesPage } from "@/pages/TracesPage";
import { WelcomePage } from "@/pages/WelcomePage";

function DashboardLayout() {
  return (
    <DashboardShell>
      <Outlet />
    </DashboardShell>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/projects" replace />} />
      <Route path="/login" element={<Navigate to="/sign-in" replace />} />
      <Route path="/sign-in/*" element={<LoginPage />} />
      <Route path="/sign-up/*" element={<SignUpPage />} />

      <Route element={<RequireAuth />}>
        <Route
          element={
            <WorkspaceProvider>
              <RequireProvisioned />
            </WorkspaceProvider>
          }
        >
          <Route path="/welcome" element={<WelcomePage />} />
          <Route element={<DashboardLayout />}>
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/get-started" element={<GetStartedPage />} />
            <Route path="/traces" element={<TracesPage />} />
            <Route path="/traces/:traceId" element={<TraceDetailPage />} />
            <Route path="/agents" element={<Navigate to="/projects" replace />} />
            <Route path="/metrics" element={<MetricsPage />} />
            <Route path="/mcp" element={<McpPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/projects" replace />} />
    </Routes>
  );
}

export default function App() {
  const isDarkTheme = useDarkTheme();

  if (isDesignMode()) {
    return <AppRoutes />;
  }

  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  if (!publishableKey) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 text-center text-sm text-muted-foreground">
        Missing <code className="mx-1 rounded bg-muted px-1.5 py-0.5">VITE_CLERK_PUBLISHABLE_KEY</code>.
        Set it in <code className="mx-1 rounded bg-muted px-1.5 py-0.5">.env</code>, or enable{" "}
        <code className="mx-1 rounded bg-muted px-1.5 py-0.5">VITE_DESIGN_MODE=true</code>.
      </div>
    );
  }

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/projects"
      signUpFallbackRedirectUrl="/welcome"
      afterSignOutUrl="/sign-in"
      appearance={getClerkAppearance(isDarkTheme)}
    >
      <AppRoutes />
    </ClerkProvider>
  );
}
