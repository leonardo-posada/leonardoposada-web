/**
 * Motion tokens for framer-motion.
 *
 * Reuse `EASE.out` and `DURATION.base` instead of inline arrays / magic numbers,
 * so every animation across the site shares the same rhythm. When you tune one
 * curve, you tune the whole site.
 */

export const EASE = {
  /** Entrance / reveal. Natural land. ease-out-expo in CSS land. */
  out: [0.22, 1, 0.36, 1] as const,
} as const;

export const DURATION = {
  fast: 0.6,
  base: 1.2,
  slow: 1.8,
} as const;

/** Standard fade-up reveal variant. Pair with `EASE.out` + `DURATION.base`. */
export const REVEAL = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
} as const;

/** Transition preset most components use. */
export const TRANS_OUT = {
  duration: DURATION.base,
  ease: EASE.out,
} as const;
