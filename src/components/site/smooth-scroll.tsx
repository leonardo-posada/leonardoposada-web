"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { registerLenis } from "@/lib/scroll";
import { consumeHomeScroll } from "@/lib/home-scroll";

/**
 * Global smooth-scroll wrapper.
 *
 * - Honors `prefers-reduced-motion`: no-op if the user asks for reduced motion.
 * - Any INTERNAL scrollable element (dropdowns, modals, drawers) must add
 *   `data-lenis-prevent` so its own wheel events aren't hijacked.
 * - Resets scroll to top on client navigation (unless the URL has a #hash, in
 *   which case the browser's anchor scroll takes over). Lenis maintains its
 *   own internal position, so `router.push` alone does not reliably land at
 *   the top · we drive it via Lenis's scrollTo.
 */
export function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Kill browser's automatic scroll restoration on reload/back-forward.
    // Without this, mobile Safari/Chrome restore the previous scrollY, and the
    // sticky navbar covers the hero — looks like the avatar/title "climbed up".
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    const lenis = new Lenis({
      lerp: 0.12,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });
    lenisRef.current = lenis;
    registerLenis(lenis);

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
      registerLenis(null);
    };
  }, []);

  // On client-side route change, jump back to the top (unless the URL carries
  // a #hash · then the browser's anchor scroll should take precedence).
  // Exception: landing on `/` restores the user's prior home scroll if one
  // was saved (so BackToWork from a detail page returns them to where they
  // were viewing a project).
  useEffect(() => {
    if (window.location.hash) return;
    const target =
      pathname === "/" ? (consumeHomeScroll() ?? 0) : 0;
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(target, { immediate: true });
    } else {
      window.scrollTo(0, target);
    }
  }, [pathname]);

  return null;
}
