"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

import { usePageCurtain } from "./page-curtain-provider";

const EASE = [0.22, 1, 0.36, 1] as const;

/** A gentle opacity-only entrance, triggered once when the image enters view. */
export function LuxuryMediaPrevious({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: true, amount: "some", margin: "0px 0px -6% 0px" });
  const reduced = useReducedMotion();
  const { ready } = usePageCurtain();
  const show = (visible && ready) || reduced;
  return (
    <div ref={ref} data-luxury-media>
      <motion.div
        className="overflow-hidden rounded-lg"
        initial={false}
        animate={{ opacity: show ? 1 : 0 }}
        transition={{ duration: reduced ? 0 : 1.2, ease: EASE }}
      >
        {children}
      </motion.div>
    </div>
  );
}

