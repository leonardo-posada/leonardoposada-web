/** One catalog ID per design; each screen controls optional information. */
export type StudioCardVariant = "v1" | "v2" | "v3" | "v4" | "v5" | "v6" | "v7";
export type StudioCardDesign = StudioCardVariant;

export function resolveStudioCard(variant: StudioCardVariant, options: { hideAmount?: boolean; hideKindLabel?: boolean } = {}) {
  return {
    design: variant,
    hideAmount: options.hideAmount ?? variant === "v7",
    hideKindLabel: options.hideKindLabel ?? variant === "v7",
  };
}
