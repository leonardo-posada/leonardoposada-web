"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { REVEAL, TRANS_OUT } from "@/lib/motion";

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
  return (
    <motion.div
      variants={REVEAL}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      transition={{ ...TRANS_OUT, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
