import { useState } from "react";
import {
  CreditCard,
  ExternalLink,
  FileText,
  Loader2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BillingSettingsPanelProps {
  organizationName: string;
  billingEmail?: string | null;
}

type PlanId = "hobby" | "pro";

const PLANS: Array<{
  id: PlanId;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  featured?: boolean;
}> = [
  {
    id: "hobby",
    name: "Hobby",
    price: "$0",
    period: "forever",
    description: "For prototypes and small teams getting started.",
    features: [
      "30-day span retention",
      "10,000 spans / month",
      "1 project",
      "Community support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$49",
    period: "/ month",
    description: "For production agent fleets that need retention and seats.",
    features: [
      "90-day span retention",
      "500,000 spans / month",
      "Unlimited projects",
      "Stripe invoices & receipts",
      "Priority support",
    ],
    featured: true,
  },
];

/**
 * Stripe-ready billing UI. Checkout + Customer Portal will plug into:
 * POST /v1/billing/checkout-session
 * POST /v1/billing/portal-session
 */
export function BillingSettingsPanel({
  organizationName,
  billingEmail,
}: BillingSettingsPanelProps) {
  const [currentPlan] = useState<PlanId>("hobby");
  const [busyAction, setBusyAction] = useState<"checkout" | "portal" | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const plan = PLANS.find((entry) => entry.id === currentPlan) ?? PLANS[0];
  const usagePercent = 18;
  const spansUsed = 1_842;
  const spansLimit = 10_000;

  const openStripeCheckout = async () => {
    setBusyAction("checkout");
    setNotice(null);
    try {
      // Placeholder until Stripe Checkout Session API lands.
      await new Promise((resolve) => setTimeout(resolve, 600));
      setNotice(
        "Stripe Checkout is not connected yet. We'll redirect to a Checkout Session here.",
      );
    } finally {
      setBusyAction(null);
    }
  };

  const openStripePortal = async () => {
    setBusyAction("portal");
    setNotice(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setNotice(
        "Stripe Customer Portal is not connected yet. Card updates and invoices will open there.",
      );
    } finally {
      setBusyAction(null);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border-0 bg-card p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Billing</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage plan, payment method, and invoices for{" "}
              <span className="font-medium text-foreground">{organizationName}</span>.
              Payments are processed securely by Stripe.
            </p>
          </div>
          <Badge variant="muted" className="gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" />
            Powered by Stripe
          </Badge>
        </div>

        {notice && (
          <p className="mt-4 rounded-lg border-0 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
            {notice}
          </p>
        )}

        <div className="mt-5 rounded-xl border-0 bg-muted/30 p-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-foreground">{plan.name} plan</p>
                <Badge className="bg-primary/15 text-primary hover:bg-primary/15">Current</Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
              <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
                {plan.price}
                <span className="ml-1 text-sm font-medium text-muted-foreground">
                  {plan.period}
                </span>
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {currentPlan === "hobby" ? (
                <Button
                  type="button"
                  onClick={() => void openStripeCheckout()}
                  disabled={busyAction !== null}
                >
                  {busyAction === "checkout" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  Upgrade with Stripe
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => void openStripePortal()}
                  disabled={busyAction !== null}
                >
                  {busyAction === "portal" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ExternalLink className="h-4 w-4" />
                  )}
                  Manage in Stripe
                </Button>
              )}
            </div>
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Monthly spans</span>
              <span>
                {spansUsed.toLocaleString()} / {spansLimit.toLocaleString()}
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${usagePercent}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Resets on the 1st of each month · tracked in Stripe metered billing later
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {PLANS.map((entry) => {
          const active = entry.id === currentPlan;
          return (
            <div
              key={entry.id}
              className={cn(
                "rounded-xl border-0 bg-card p-5 shadow-sm",
                entry.featured && "border-primary/40 ring-1 ring-primary/20",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-semibold text-foreground">{entry.name}</h3>
                {active && <Badge variant="secondary">Active</Badge>}
                {!active && entry.featured && (
                  <Badge className="bg-primary text-primary-foreground">Recommended</Badge>
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{entry.description}</p>
              <p className="mt-4 text-2xl font-semibold text-foreground">
                {entry.price}
                <span className="ml-1 text-sm font-medium text-muted-foreground">
                  {entry.period}
                </span>
              </p>
              <ul className="mt-4 space-y-2">
                {entry.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-5">
                {active ? (
                  <Button type="button" variant="outline" className="w-full" disabled>
                    Current plan
                  </Button>
                ) : (
                  <Button
                    type="button"
                    className="w-full"
                    onClick={() => void openStripeCheckout()}
                    disabled={busyAction !== null}
                  >
                    {busyAction === "checkout" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : null}
                    Switch to {entry.name}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </section>

      <section className="rounded-xl border-0 bg-card p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-foreground">Payment method</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Cards and SEPA methods are stored in Stripe — we never keep raw card numbers.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void openStripePortal()}
            disabled={busyAction !== null}
          >
            {busyAction === "portal" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ExternalLink className="h-4 w-4" />
            )}
            Open Stripe portal
          </Button>
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-xl border-0 bg-muted/30 px-4 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border-0 bg-card">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground">No payment method on file</p>
            <p className="text-sm text-muted-foreground">
              {billingEmail
                ? `Stripe receipts will go to ${billingEmail}`
                : "Add a card when you upgrade to Pro via Stripe Checkout."}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-xl border-0 bg-card p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-foreground">Invoices</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Paid invoices and PDFs will sync from Stripe after your first charge.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void openStripePortal()}
            disabled={busyAction !== null}
          >
            View in Stripe
          </Button>
        </div>

        <div className="mt-4 flex flex-col items-center justify-center rounded-xl border-0 bg-muted/20 px-4 py-10 text-center">
          <FileText className="h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm font-medium text-foreground">No invoices yet</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Hobby is free. Upgrade to Pro and Stripe will email invoices to your billing
            contact automatically.
          </p>
        </div>
      </section>
    </div>
  );
}
