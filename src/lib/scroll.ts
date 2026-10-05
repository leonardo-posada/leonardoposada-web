import type Lenis from "lenis";

/**
 * Module-level reference to the active Lenis instance.
 * SmoothScroll registers it on mount / clears it on unmount. Any component can
 * then call `smoothScrollTo(0)` to animate the page back to the top without
 * depending on anchor hashes or the native scroll (which Lenis hijacks).
 */

let lenis: Lenis | null = null;

export function registerLenis(instance: Lenis | null) {
  lenis = instance;
}

export function smoothScrollTo(target: number | string, duration = 1.2) {
  if (typeof window === "undefined") return;
  if (lenis) {
    lenis.scrollTo(target, { duration });
    return;
  }
  // Fallback for reduced-motion users (Lenis is not initialized).
  const y = typeof target === "number" ? target : 0;
  window.scrollTo({ top: y, behavior: "smooth" });
}
