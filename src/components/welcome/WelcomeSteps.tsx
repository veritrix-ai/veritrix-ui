import {
  Building2,
  Check,
  ExternalLink,
  FileText,
  Rocket,
  Sparkles,
  Wrench,
} from "lucide-react";

import {
  COMPANY_SIZES,
  FRAMEWORKS,
  HEARD_FROM,
  HELP_OPTIONS,
  PROVIDERS,
  RESOURCE_DOCS,
  STAGES,
  USAGE_OPTIONS,
} from "@/components/welcome/constants";
import type { UsageType, WelcomeFormData } from "@/components/welcome/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const USAGE_ICONS = {
  rocket: Rocket,
  building: Building2,
  wrench: Wrench,
};

export function UsageStep({
  value,
  onChange,
}: {
  value: UsageType | null;
  onChange: (value: UsageType) => void;
}) {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Getting started</h1>
      <p className="mt-2 text-muted-foreground">What are you using Veritrix for?</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {USAGE_OPTIONS.map((option) => {
          const selected = value === option.id;
          const Icon = USAGE_ICONS[option.icon];
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              className={cn(
                "relative rounded-2xl border bg-card p-5 text-left transition-all",
                selected
                  ? "border-primary shadow-[0_10px_30px_hsl(var(--primary)/0.14)]"
                  : "border-border hover:border-primary/40 hover:bg-accent/50",
              )}
            >
              {selected && (
                <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-3 w-3" />
                </span>
              )}
              <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <span className="block font-semibold text-foreground">{option.title}</span>
              <span className="mt-1 block text-sm leading-5 text-muted-foreground">
                {option.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SelectField({
  value,
  options,
  onChange,
}: {
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
    >
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </select>
  );
}

function ChipGroup({
  options,
  selected,
  onToggle,
}: {
  options: readonly string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = selected.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => onToggle(option)}
            className={cn(
              "rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

export function AboutStep({
  data,
  onChange,
}: {
  data: WelcomeFormData;
  onChange: (updates: Partial<WelcomeFormData>) => void;
}) {
  const toggle = (key: "frameworks" | "providers", value: string) => {
    const selected = data[key];
    onChange({
      [key]: selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value],
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-foreground">About you</h1>
      <p className="mt-2 text-muted-foreground">Help us tailor your workspace and setup guide.</p>

      <div className="mt-8 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="company-name">Company or organization name *</Label>
          <Input
            id="company-name"
            value={data.companyName}
            onChange={(event) => onChange({ companyName: event.target.value })}
            placeholder="Acme AI"
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Company size *</Label>
            <SelectField
              value={data.companySize}
              options={COMPANY_SIZES}
              onChange={(companySize) => onChange({ companySize })}
            />
          </div>
          <div className="space-y-2">
            <Label>Current stage *</Label>
            <SelectField
              value={data.stage}
              options={STAGES}
              onChange={(stage) => onChange({ stage })}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="building-description">What are you trying to build? *</Label>
          <textarea
            id="building-description"
            rows={3}
            value={data.buildingDescription}
            onChange={(event) => onChange({ buildingDescription: event.target.value })}
            placeholder="Describe your agent use case…"
            className="w-full resize-y rounded-lg border border-input bg-background px-3 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="space-y-2">
          <Label>How did you hear about us? *</Label>
          <SelectField
            value={data.heardFrom}
            options={HEARD_FROM}
            onChange={(heardFrom) => onChange({ heardFrom })}
          />
        </div>
        <div className="space-y-3">
          <Label>Frameworks *</Label>
          <ChipGroup
            options={FRAMEWORKS}
            selected={data.frameworks}
            onToggle={(value) => toggle("frameworks", value)}
          />
        </div>
        <div className="space-y-3">
          <Label>Model providers</Label>
          <ChipGroup
            options={PROVIDERS}
            selected={data.providers}
            onToggle={(value) => toggle("providers", value)}
          />
        </div>
      </div>
    </div>
  );
}

export function HelpStep({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-foreground">How can we help?</h1>
      <p className="mt-2 text-muted-foreground">Select one or more goals for your workspace.</p>

      <div className="mt-8 space-y-3">
        {HELP_OPTIONS.map((option) => {
          const active = selected.includes(option.id);
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onToggle(option.id)}
              className={cn(
                "flex w-full items-center gap-4 rounded-2xl border bg-card px-5 py-4 text-left transition-all",
                active
                  ? "border-primary shadow-[0_8px_24px_hsl(var(--primary)/0.12)]"
                  : "border-border hover:border-primary/40",
              )}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-foreground">{option.title}</span>
                {option.description && (
                  <span className="mt-1 block text-sm text-muted-foreground">
                    {option.description}
                  </span>
                )}
              </span>
              {active && (
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-3.5 w-3.5" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ResourcesStep({
  frameworks,
  providers,
}: {
  frameworks: string[];
  providers: string[];
}) {
  const selectedResources = [...frameworks, ...providers]
    .filter((name) => RESOURCE_DOCS[name])
    .map((name) => ({ name, href: RESOURCE_DOCS[name] }));
  const resources =
    selectedResources.length > 0
      ? selectedResources
      : [
          { name: "CrewAI", href: RESOURCE_DOCS.CrewAI },
          { name: "OpenAI", href: RESOURCE_DOCS.OpenAI },
        ];

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-foreground">One last thing…</h1>
      <p className="mt-2 text-muted-foreground">Resources selected for your technology stack.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {resources.map((resource) => (
          <a
            key={resource.name}
            href={resource.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-sm"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileText className="h-5 w-5" />
            </span>
            <span className="mt-4 block font-semibold text-foreground">{resource.name}</span>
            <span className="mt-2 flex items-center gap-1.5 text-sm font-medium text-primary">
              Documentation
              <ExternalLink className="h-3.5 w-3.5" />
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
