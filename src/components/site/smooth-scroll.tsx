"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Global smooth-scroll wrapper.
 *
 * - Honors `prefers-reduced-motion`: no-op if the user asks for reduced motion.
 * - Any INTERNAL scrollable element (dropdowns, modals, drawers) must add
 *   `data-lenis-prevent` so its own wheel events aren't hijacked.
 */
export function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    const lenis = new Lenis({
      lerp: 0.12,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
