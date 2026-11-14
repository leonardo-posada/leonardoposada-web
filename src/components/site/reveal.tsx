"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { usePageCurtain } from "./page-curtain-provider";
import { TRANS_OUT } from "@/lib/motion";

/**
 * Scroll-triggered fade-up. Uses the same REVEAL + TRANS_OUT motion tokens as
 * the on-mount Hero cascade, so the feel is consistent across the site.
 * Animates once per element (never re-plays on scroll-back).
 */
export function Reveal({
  children,
  delay = 0,
  /** How much of the element must be visible before firing (0–1). */
  amount = 0.15,
  className,
}: {
  children: ReactNode;
  delay?: number;
  amount?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: true, amount });
  const reduced = useReducedMotion();
  const { ready } = usePageCurtain();
  const show = (ready && visible) || reduced;
  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : 24, clipPath: show ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 15% 0%)" }}
      transition={{ ...TRANS_OUT, delay: reduced ? 0 : delay, duration: reduced ? 0 : 1.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
