import {
  Component,
  useEffect,
  useRef,
  useState,
  type ErrorInfo,
  type ReactNode,
} from "react";
import {
  PricingTable,
  useClerk,
  useOrganization,
  useOrganizationList,
} from "@clerk/react";
import { ExternalLink, Loader2 } from "lucide-react";

import { useWorkspaceActions } from "@/components/workspace/WorkspaceProvider";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { linkClerkOrganization } from "@/lib/api";
import { getClerkAppearance, useDarkTheme } from "@/lib/clerk-theme";
import { isDesignMode } from "@/lib/design-mode";

interface BillingSettingsPanelProps {
  orgId: string;
  clerkOrganizationId?: string | null;
  organizationName: string;
  billingEmail?: string | null;
}

class BillingErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Billing component failed to load", error, info);
  }

  render() {
    if (this.state.failed) {
      return (
        <section className="rounded-xl bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground">
            Plans are temporarily unavailable
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            We could not load subscription plans right now. Your workspace and data are
            unaffected.
          </p>
          <Button type="button" className="mt-6" onClick={() => window.location.reload()}>
            Try again
          </Button>
        </section>
      );
    }

    return this.props.children;
  }
}

function BillingPreview() {
  return (
    <section className="rounded-xl bg-card p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-foreground">Plans and billing</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Choose a plan and manage invoices and payment methods.
      </p>
    </section>
  );
}

function ClerkBillingPanel({
  orgId,
  clerkOrganizationId,
  organizationName,
  billingEmail,
}: BillingSettingsPanelProps) {
  const clerk = useClerk();
  const isDarkTheme = useDarkTheme();
  const { organization, isLoaded: activeOrganizationLoaded } = useOrganization();
  const {
    isLoaded: organizationListLoaded,
    createOrganization,
    setActive,
  } = useOrganizationList();
  const { refreshWorkspace } = useWorkspaceActions();
  const [error, setError] = useState<string | null>(null);
  const connectionStarted = useRef(false);
  const activationStarted = useRef(false);

  const isReady = organizationListLoaded && activeOrganizationLoaded;
  const isActive =
    Boolean(clerkOrganizationId) && organization?.id === clerkOrganizationId;

  const connectOrganization = async () => {
    if (!createOrganization || !setActive) return;
    setError(null);
    try {
      const pendingKey = `veritrix.billing.pendingClerkOrg.${orgId}`;
      let clerkOrgId = window.sessionStorage.getItem(pendingKey);
      if (!clerkOrgId) {
        const created = await createOrganization({ name: organizationName });
        clerkOrgId = created.id;
        window.sessionStorage.setItem(pendingKey, clerkOrgId);
      }
      await linkClerkOrganization(orgId, clerkOrgId);
      await setActive({ organization: clerkOrgId });
      window.sessionStorage.removeItem(pendingKey);
      await refreshWorkspace();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not connect this organization to Clerk Billing.",
      );
    }
  };

  useEffect(() => {
    if (!isReady || clerkOrganizationId || connectionStarted.current) return;
    connectionStarted.current = true;
    void connectOrganization();
    // The connection is intentionally started once for each mounted organization.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clerkOrganizationId, isReady, orgId]);

  const activateOrganization = async () => {
    if (!setActive || !clerkOrganizationId) return;
    setError(null);
    try {
      await setActive({ organization: clerkOrganizationId });
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "You are not a member of the linked Clerk organization.",
      );
    }
  };

  useEffect(() => {
    if (
      !isReady ||
      !clerkOrganizationId ||
      isActive ||
      activationStarted.current
    ) {
      return;
    }
    activationStarted.current = true;
    void activateOrganization();
    // Activation is intentionally started once for each mounted organization.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clerkOrganizationId, isActive, isReady]);

  if (!isReady) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-80 rounded-xl" />
      </div>
    );
  }

  if (!clerkOrganizationId) {
    if (error) {
      return (
        <section className="rounded-xl bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground">
            Billing is temporarily unavailable
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            We could not prepare billing for this workspace. Your account and data are
            unaffected.
          </p>
          <p className="mt-3 text-sm text-destructive">{error}</p>
          <Button
            type="button"
            className="mt-6"
            onClick={() => {
              connectionStarted.current = true;
              void connectOrganization();
            }}
          >
            Try again
          </Button>
        </section>
      );
    }
    return (
      <section className="flex min-h-48 items-center justify-center rounded-xl bg-card p-6 shadow-sm">
        <div className="text-center">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
          <h2 className="mt-4 text-lg font-semibold text-foreground">Preparing billing</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Loading available plans for your workspace…
          </p>
        </div>
      </section>
    );
  }

  if (!isActive) {
    if (error) {
      return (
        <section className="rounded-xl bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground">Billing is unavailable</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Ask the workspace owner to open billing once, or try again.
          </p>
          <p className="mt-3 text-sm text-destructive">{error}</p>
        </section>
      );
    }
    return (
      <section className="flex min-h-48 items-center justify-center rounded-xl bg-card p-6 shadow-sm">
        <div className="text-center">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
          <h2 className="mt-4 text-lg font-semibold text-foreground">Loading billing</h2>
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl bg-card p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Plans and billing</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Subscription for <span className="font-medium text-foreground">{organizationName}</span>
              {billingEmail ? ` · Billing contact: ${billingEmail}` : ""}.
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          className="mt-5"
          onClick={() => clerk.openOrganizationProfile()}
        >
          <ExternalLink className="h-4 w-4" />
          Manage invoices and payment methods
        </Button>
      </section>

      <section className="overflow-hidden rounded-xl bg-card p-4 shadow-sm sm:p-6">
        <PricingTable
          key={isDarkTheme ? "dark" : "light"}
          for="organization"
          highlightedPlan="pro"
          collapseFeatures={false}
          newSubscriptionRedirectUrl="/settings?tab=billing"
          fallback={<Skeleton className="h-96 rounded-xl" />}
          appearance={getClerkAppearance(isDarkTheme)}
        />
      </section>
    </div>
  );
}

export function BillingSettingsPanel(props: BillingSettingsPanelProps) {
  if (isDesignMode()) return <BillingPreview />;
  return (
    <BillingErrorBoundary>
      <ClerkBillingPanel {...props} />
    </BillingErrorBoundary>
  );
}
