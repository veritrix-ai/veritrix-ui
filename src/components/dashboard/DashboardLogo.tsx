import { Link } from "react-router-dom";

export function VeritrixMark({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d="M8 28L16 8" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M14 28L22 8" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M20 28L28 8" stroke="#2AABEE" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function DashboardLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/projects" className="flex items-center gap-2.5">
      <VeritrixMark size={compact ? 28 : 32} />
      <span className="text-lg font-semibold tracking-tight text-foreground">Veritrix</span>
    </Link>
  );
}
