import { cn } from "@/lib/utils";

/**
 * Liquid-glass pill recipe · simulates Apple's iOS 26 glass surface.
 * Used by the nav pills (idle utility + sticky) and the back-to-top floater.
 *
 * - Strong backdrop blur (40px) + saturation boost → bends and enriches the
 *   content behind.
 * - Uniform semi-transparent fill → flat surface, no fake "chrome" edges.
 * - Soft outer drop shadow → makes the pill feel lifted / floating.
 * - Semi-transparent light border → subtle rim.
 */
export const PILL_GLASS = cn(
  "relative rounded-full border backdrop-blur-2xl backdrop-saturate-150",
  "border-white/20 dark:border-white/10",
  "bg-white/12 dark:bg-white/[0.04]",
  "shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)]",
  "dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]",
);
