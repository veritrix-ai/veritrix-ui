import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";

import { VeritrixMark } from "@/components/dashboard/DashboardLogo";
import {
  PATCH_NOTES,
  PATCH_NOTES_CHANGELOG_URL,
  PATCH_NOTES_VERSION,
} from "@/components/dashboard/patch-notes";
import { Button } from "@/components/ui/button";

interface PatchNotesModalProps {
  open: boolean;
  onClose: () => void;
}

export function PatchNotesModal({ open, onClose }: PatchNotesModalProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 py-12 sm:items-center sm:py-8">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px]"
        aria-label="Close what's new dialog"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="patch-notes-title"
        className="relative flex max-h-[min(520px,calc(100vh-3rem))] w-full max-w-md flex-col overflow-hidden rounded-xl border-0 bg-card shadow-2xl"
      >
        <div className="flex items-center gap-2.5 border-b px-5 py-4">
          <VeritrixMark size={22} />
          <h2 id="patch-notes-title" className="text-lg font-semibold text-foreground">
            What&apos;s New in {PATCH_NOTES_VERSION}
          </h2>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <ul className="space-y-4">
            {PATCH_NOTES.map((entry) => {
              const Icon = entry.icon;
              return (
                <li key={entry.id} className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-foreground">{entry.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {entry.description}
                    </p>
                    {entry.link && (
                      <Link
                        to={entry.link.href}
                        onClick={onClose}
                        className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                      >
                        {entry.link.label}
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex items-center justify-between border-t px-5 py-3.5">
          <a
            href={PATCH_NOTES_CHANGELOG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            View Changelog
            <ExternalLink className="h-3 w-3" />
          </a>
          <Button type="button" onClick={onClose} className="h-9 px-4">
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
