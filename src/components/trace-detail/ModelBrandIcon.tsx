import { ModelIcon } from "@lobehub/icons";

interface ModelBrandIconProps {
  model?: string | null;
  size?: number;
  className?: string;
}

export function ModelBrandIcon({ model, size = 16, className }: ModelBrandIconProps) {
  if (!model) {
    return null;
  }

  return (
    <span className={`inline-flex shrink-0 items-center justify-center ${className ?? ""}`}>
      <ModelIcon model={model} size={size} type="color" />
    </span>
  );
}
