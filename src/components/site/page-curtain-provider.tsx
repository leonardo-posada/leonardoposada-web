"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

type Phase = "idle" | "falling" | "rising";

/** Same curve + duration as the theme-toggle sheet for consistency. */
const DURATION = 550;
const EASING = "cubic-bezier(0.65, 0, 0.1, 1)";
/** Short pause after router.push to let the new page paint before we rise. */
const SETTLE = 120;

type CurtainCtx = {
  /** Trigger the sheet transition and navigate to href after the fall. */
  navigate: (href: string) => void;
  /** True when no curtain cycle is in progress. Lets page-level cascades
   *  (e.g. DetailHero) wait until the curtain has finished retracting so
   *  the entry animation isn't playing behind the sheet. */
  ready: boolean;
};

const Ctx = createContext<CurtainCtx | null>(null);

/**
 * Must be called inside the PageCurtainProvider (layout.tsx wraps children).
 * Returns a `navigate(href)` function that plays the curtain fall + navigates
 * + plays the rise once the new page is on screen.
 */
export function usePageCurtain() {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error("usePageCurtain must be used inside <PageCurtainProvider>");
  }
  return ctx;
}

export function PageCurtainProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("idle");
  const [color, setColor] = useState<string>("transparent");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const navigate = useCallback(
    (href: string) => {
      if (phase !== "idle") return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reduced) {
        router.push(href);
        return;
      }

      // Contrasting color so the sheet is visible against both pages (which
      // share the same background on same-theme nav). We use --primary (pure
      // black in light, near-white in dark) instead of --foreground, since
      // --foreground is a slightly-tinted dark gray in light mode.
      const primary = getComputedStyle(document.documentElement)
        .getPropertyValue("--primary")
        .trim();
      setColor(primary || "#0a0a0a");
      setPhase("falling");

      setTimeout(() => {
        router.push(href);
        setTimeout(() => {
          setPhase("rising");
          setTimeout(() => setPhase("idle"), DURATION + 60);
        }, SETTLE);
      }, DURATION);
    },
    [phase, router],
  );

  const curtain = (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[200]"
      style={{
        background: color,
        transformOrigin: "top",
        transform: phase === "falling" ? "scaleY(1)" : "scaleY(0)",
        transition:
          phase !== "idle" ? `transform ${DURATION}ms ${EASING}` : "none",
      }}
    />
  );

  return (
    <Ctx.Provider value={{ navigate, ready: phase === "idle" }}>
      {mounted && createPortal(curtain, document.body)}
      {children}
    </Ctx.Provider>
  );
}
