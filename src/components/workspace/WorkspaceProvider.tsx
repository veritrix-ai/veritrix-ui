import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@clerk/react";

import { BackendUnavailable } from "@/components/dashboard/BackendUnavailable";
import { Skeleton } from "@/components/ui/skeleton";
import { configureApiAuth, getMe } from "@/lib/api";
import { isBackendUnavailable } from "@/lib/backend-errors";
import { isDesignMode } from "@/lib/design-mode";
import { getDesignModeWorkspace } from "@/lib/mock-data";
import type { MeResponse } from "@/lib/types";

interface WorkspaceContextValue {
  workspace: MeResponse;
  refreshWorkspace: () => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

function WorkspaceLoading() {
  return (
    <div className="flex h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm space-y-3">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}

/**
 * Wire Clerk's getToken into the API client before any workspace fetch runs.
 * Must configure during render (not only in useEffect) so child effects see it.
 */
function AuthTokenBridge({ children }: { children: ReactNode }) {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [tokenReady, setTokenReady] = useState(false);

  if (isLoaded) {
    configureApiAuth(async () => getToken());
  }

  useEffect(() => {
    if (!isLoaded) {
      setTokenReady(false);
      return;
    }

    configureApiAuth(async () => getToken());

    let cancelled = false;

    async function getTokenSafely() {
      let timeoutId: number | undefined;
      try {
        return await Promise.race([
          getToken(),
          new Promise<null>((resolve) => {
            timeoutId = window.setTimeout(() => resolve(null), 1_000);
          }),
        ]);
      } catch {
        return null;
      } finally {
        if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      }
    }

    async function waitForToken() {
      if (!isSignedIn) {
        if (!cancelled) setTokenReady(true);
        return;
      }

      for (let attempt = 0; attempt < 5; attempt++) {
        const token = await getTokenSafely();
        if (cancelled) return;
        if (token) {
          setTokenReady(true);
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      if (!cancelled) setTokenReady(true);
    }

    setTokenReady(false);
    void waitForToken();

    return () => {
      cancelled = true;
    };
  }, [getToken, isLoaded, isSignedIn]);

  if (!isLoaded || !tokenReady) return <WorkspaceLoading />;

  return <>{children}</>;
}

function useWorkspaceState(enabled: boolean) {
  const [workspace, setWorkspace] = useState<MeResponse | null>(
    enabled ? null : getDesignModeWorkspace(),
  );
  const [error, setError] = useState<unknown>(null);
  const [loading, setLoading] = useState(enabled);

  const load = useCallback(async () => {
    if (!enabled) {
      setWorkspace(getDesignModeWorkspace());
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const me = await getMe();
      setWorkspace(me);
    } catch (err) {
      setError(err);
      setWorkspace(null);
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  return { workspace, error, loading, load };
}

function DesignModeWorkspace({ children }: { children: ReactNode }) {
  const workspace = getDesignModeWorkspace();
  const value = useMemo(
    () => ({
      workspace,
      refreshWorkspace: async () => undefined,
    }),
    [workspace],
  );

  return (
    <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
  );
}

function AuthenticatedWorkspace({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  const { workspace, error, loading, load } = useWorkspaceState(true);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    void load();
  }, [isLoaded, isSignedIn, load]);

  const value = useMemo(
    () => ({
      workspace: workspace!,
      refreshWorkspace: load,
    }),
    [workspace, load],
  );

  if (!isLoaded || (isSignedIn && loading)) return <WorkspaceLoading />;

  if (error && isBackendUnavailable(error)) {
    return (
      <BackendUnavailable
        fullPage
        title="We're getting your workspace ready"
        message="The data service is temporarily unavailable or waking from sleep. This page will reconnect automatically—there is no need to sign in again."
        onRetry={() => void load()}
        autoRetrySeconds={8}
      />
    );
  }

  if (error) {
    return (
      <BackendUnavailable
        fullPage
        title="Could not load workspace"
        message={error instanceof Error ? error.message : "Unexpected error"}
        onRetry={() => void load()}
      />
    );
  }

  if (!isSignedIn || !workspace) return <WorkspaceLoading />;

  return (
    <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
  );
}

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  if (isDesignMode()) {
    return <DesignModeWorkspace>{children}</DesignModeWorkspace>;
  }

  return (
    <AuthTokenBridge>
      <AuthenticatedWorkspace>{children}</AuthenticatedWorkspace>
    </AuthTokenBridge>
  );
}

export function useWorkspace(): MeResponse {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within WorkspaceProvider");
  }
  return context.workspace;
}

export function useWorkspaceActions() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspaceActions must be used within WorkspaceProvider");
  }
  return { refreshWorkspace: context.refreshWorkspace };
}

export function useWorkspaceOptional(): MeResponse | null {
  return useContext(WorkspaceContext)?.workspace ?? null;
}
