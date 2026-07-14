import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@clerk/react";

import { Skeleton } from "@/components/ui/skeleton";
import { isDesignMode } from "@/lib/design-mode";

function ClerkRequireAuth() {
  const location = useLocation();
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Skeleton className="h-8 w-40" />
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

export function RequireAuth() {
  if (isDesignMode()) return <Outlet />;
  return <ClerkRequireAuth />;
}
