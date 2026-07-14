export type GetStartedStep = "choose" | "install" | "plans" | "verify";

export type IntegrationPath = "existing" | "fresh" | "colab";

export type ExampleTab = "frameworks" | "providers";

export interface ExampleItem {
  id: string;
  tab: ExampleTab;
  name: string;
  subtitle: string;
  framework: string;
  bullets: string[];
  colabUrl: string;
  examplesUrl: string;
  accentClass: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  cta: string;
  highlighted?: boolean;
  features: string[];
}
