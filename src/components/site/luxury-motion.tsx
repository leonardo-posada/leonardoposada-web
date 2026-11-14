"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

import { usePageCurtain } from "./page-curtain-provider";

const EASE = [0.22, 1, 0.36, 1] as const;

// Approved subtle, timed reveal; the scroll-driven experiment remains separate.
export { LuxuryMediaPrevious as LuxuryMedia } from "./luxury-media-previous";

/** Explicit display lines retain their semantic heading and reveal independently. */
export function LuxuryLine({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const visible = useInView(ref, { once: true, amount: "some" });
  const reduced = useReducedMotion();
  const { ready } = usePageCurtain();
  const show = (visible && ready) || reduced;
  return (
    <span ref={ref} className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
      <motion.span
        className="block"
        initial={false}
        animate={{ y: show ? "0%" : "110%" }}
        transition={{ duration: reduced ? 0 : 1.1, ease: EASE, delay: reduced ? 0 : delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}
