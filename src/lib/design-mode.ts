export function isDesignMode(): boolean {
  return import.meta.env.VITE_DESIGN_MODE === "true";
}
