import { useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";

import { VeritrixLogo } from "@/components/auth/VeritrixLogo";
import { CircuitBackground } from "@/components/auth/CircuitBackground";
import "@/components/auth/auth.css";

interface AuthShellProps {
  children: ReactNode;
  mode?: "sign-in" | "sign-up" | "welcome";
}

export function AuthShell({ children, mode = "sign-in" }: AuthShellProps) {
  const isWelcome = mode === "welcome";
  const isSignUp = mode === "sign-up";

  // Clerk inherits document `.dark` styles — keep auth pages light.
  useEffect(() => {
    const root = document.documentElement;
    const wasDark = root.classList.contains("dark");
    root.classList.remove("dark");
    return () => {
      if (wasDark) root.classList.add("dark");
    };
  }, []);

  const headline = isWelcome
    ? "You're in. Set up your workspace."
    : "The platform for agent observability.";
  const subhead = isWelcome
    ? "Name your organization to get an API key and start sending traces."
    : "Trace every handoff, evaluate every run, and debug multi-agent failures before they reach production.";

  return (
    <div className="auth-page relative min-h-screen bg-surface text-foreground">
      <CircuitBackground />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8 lg:px-10">
        <div className="grid flex-1 items-center gap-12 lg:grid-cols-[1.05fr_440px] lg:gap-20">
          <section className="hidden lg:block">
            <VeritrixLogo />

            <h1 className="mt-14 max-w-xl text-5xl font-bold leading-[1.08] tracking-tight text-foreground">
              {headline}
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
              {subhead}
            </p>

            {!isWelcome && (
              <>
                <div className="mt-12" aria-hidden="true">
                  <AgentFlowGraphic />
                </div>

                <div className="mt-14">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Built for teams shipping agents
                  </p>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                    From research prototypes to production fleets — see latency, cost, and
                    errors across every span in the chain.
                  </p>
                </div>
              </>
            )}
          </section>

          <section className="mx-auto w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <VeritrixLogo />
              <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground">
                {headline}
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {isWelcome
                  ? subhead
                  : "Trace, evaluate, and debug your multi-agent systems."}
              </p>
            </div>

            <div className="rounded-2xl border-0 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <div className="p-8">
                {!isWelcome && (
                  <div className="mb-6">
                    <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                      {isSignUp ? "Create account" : "Welcome"}
                    </h2>
                    <p className="mt-1.5 text-sm text-muted-foreground">
                      {isSignUp
                        ? "Start tracing your agent runs in minutes."
                        : "Sign in to open your agent dashboard."}
                    </p>
                  </div>
                )}

                {children}

                {!isWelcome && (
                  <p className="mt-6 text-center text-sm text-muted-foreground">
                    {isSignUp ? (
                      <>
                        Already have an account?{" "}
                        <Link
                          to="/sign-in"
                          className="font-medium text-foreground underline underline-offset-2"
                        >
                          Log in
                        </Link>
                      </>
                    ) : (
                      <>
                        Don&apos;t have an account?{" "}
                        <Link
                          to="/sign-up"
                          className="font-medium text-foreground underline underline-offset-2"
                        >
                          Sign up
                        </Link>
                      </>
                    )}
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>

        <footer className="mt-10 pb-4 text-center text-sm text-muted-foreground">
          By continuing, you agree to our{" "}
          <Link to="#" className="font-medium text-foreground underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="#" className="font-medium text-foreground underline">
            Privacy Policy
          </Link>
          .
        </footer>
      </div>
    </div>
  );
}

function AgentFlowGraphic() {
  return (
    <svg viewBox="0 0 520 72" className="w-full max-w-lg" fill="none" aria-hidden="true">
      <path
        d="M8 36H120"
        stroke="#A5F3FC"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M8 20C40 20 56 36 88 36H120"
        stroke="#67E8F9"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.45"
      />
      <path
        d="M8 52C40 52 56 36 88 36H120"
        stroke="#67E8F9"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.45"
      />
      <path
        d="M120 36H500"
        stroke="#2AABEE"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.85"
      />
      {[120, 220, 320, 420, 500].map((x) => (
        <circle key={x} cx={x} cy="36" r="6" fill="#2AABEE" />
      ))}
      {[120, 220, 320, 420, 500].map((x) => (
        <circle
          key={`${x}-ring`}
          cx={x}
          cy="36"
          r="10"
          stroke="#67E8F9"
          strokeWidth="1.5"
          opacity="0.5"
        />
      ))}
    </svg>
  );
}
