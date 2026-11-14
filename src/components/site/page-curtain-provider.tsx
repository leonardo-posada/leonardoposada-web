"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { resetScrollPosition } from "@/lib/scroll";
import { SITE } from "@/lib/site";

// Interlude's curtain: power2.inOut on cover, power2.out on reveal.
const DURATION = 1000;
const COVER_EASE = "cubic-bezier(0.65, 0, 0.35, 1)";
const REVEAL_EASE = "cubic-bezier(0.215, 0.61, 0.355, 1)";
const DRIFT = 100;
const ENTRANCE_DELAY = 200;

type CurtainCtx = {
  navigate: (href: string) => void;
  /** Page-level cascades start 200ms into the curtain reveal. */
  ready: boolean;
};

const Ctx = createContext<CurtainCtx | null>(null);

export function usePageCurtain() {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error("usePageCurtain must be used inside <PageCurtainProvider>");
  }
  return ctx;
}

export function PageCurtainProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const splashRef = useRef<HTMLSpanElement>(null);
  const hasEntered = useRef(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const busy = useRef(true);
  const direction = useRef(1);
  const animations = useRef<Animation[]>([]);
  const entranceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [ready, setReady] = useState(false);

  const clearAnimations = useCallback(() => {
    animations.current.forEach((animation) => animation.cancel());
    animations.current = [];
    if (entranceTimer.current) clearTimeout(entranceTimer.current);
  }, []);

  // The initial Home visit gets a masked name entrance before the curtain.
  // Internal navigation retains the existing cover/reveal choreography.
  useEffect(() => {
    clearAnimations();
    const panel = panelRef.current;
    if (!panel) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const content = document.getElementById("top");
    const name = splashRef.current;
    const previousOverflow = document.documentElement.style.overflow;
    let restoreScroll: (() => void) | undefined;
    panel.style.transformOrigin = direction.current > 0 ? "50% 0%" : "50% 100%";

    const revealPage = () => {
      if (!hasEntered.current && pathname === "/" && !window.location.hash) resetScrollPosition();
      hasEntered.current = true;
      if (name) name.style.visibility = "hidden";
      panel.dataset.phase = "reveal";
      panel.style.background = "var(--primary)";
      panel.style.pointerEvents = reduced ? "none" : "auto";
      panel.style.transform = "scaleY(0)";
      restoreScroll?.();
      entranceTimer.current = setTimeout(() => setReady(true), reduced ? 0 : ENTRANCE_DELAY);
      if (reduced) {
        panel.dataset.phase = "idle";
        busy.current = false;
        return;
      }
      const options = { duration: DURATION, easing: REVEAL_EASE };
      const reveal = panel.animate([{ transform: "scaleY(1)" }, { transform: "scaleY(0)" }], options);
      animations.current.push(reveal);
      if (content) {
        animations.current.push(content.animate([
          { transform: `translateY(${direction.current * DRIFT}px)`, opacity: 0 },
          { transform: "translateY(0)", opacity: 1 },
        ], options));
      }
      reveal.onfinish = () => {
        panel.dataset.phase = "idle";
        panel.style.pointerEvents = "none";
        busy.current = false;
        clearAnimations();
        setReady(true);
      };
    };

    if (pathname === "/" && !hasEntered.current && !reduced && name) {
      panel.dataset.phase = "splash";
      panel.style.background = "var(--background)";
      panel.style.transform = "scaleY(1)";
      panel.style.pointerEvents = "auto";
      name.style.visibility = "visible";
      document.documentElement.style.overflow = "hidden";
      restoreScroll = () => { document.documentElement.style.overflow = previousOverflow; };
      // Enter gently, hold, then leave through the mask with a quicker exit.
      const intro = name.animate([
        { transform: "translateY(110%)", offset: 0, easing: REVEAL_EASE },
        { transform: "translateY(0)", offset: 0.4 },
        { transform: "translateY(0)", offset: 0.8, easing: COVER_EASE },
        { transform: "translateY(-110%)", offset: 1 },
      ], { duration: 2000, delay: 100, fill: "both" });
      animations.current.push(intro);
      intro.onfinish = revealPage;
    } else {
      revealPage();
    }
    return () => {
      clearAnimations();
      restoreScroll?.();
    };
  }, [pathname, clearAnimations]);

  const navigate = useCallback((href: string) => {
    if (busy.current) return;
    const target = new URL(href, window.location.href);
    if (target.pathname === pathname || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      router.push(href);
      return;
    }
    const panel = panelRef.current;
    if (!panel) {
      router.push(href);
      return;
    }

    busy.current = true;
    setReady(false);
    clearAnimations();
    direction.current = target.pathname === "/" ? -1 : 1;
    panel.style.transformOrigin = direction.current > 0 ? "50% 100%" : "50% 0%";
    panel.style.pointerEvents = "auto";
    panel.style.background = "var(--primary)";
    // Keep the page covered while Next loads the destination.
    panel.style.transform = "scaleY(1)";
    const options = { duration: DURATION, easing: COVER_EASE, fill: "forwards" as const };
    const cover = panel.animate([{ transform: "scaleY(0)" }, { transform: "scaleY(1)" }], options);
    animations.current.push(cover);
    const content = document.getElementById("top");
    if (content) {
      animations.current.push(content.animate([
        { transform: "translateY(0)", opacity: 1 },
        { transform: `translateY(${-direction.current * DRIFT}px)`, opacity: 0 },
      ], options));
    }
    router.prefetch(href);
    cover.onfinish = () => router.push(href);
  }, [pathname, router, clearAnimations]);

  return (
    <Ctx.Provider value={{ navigate, ready }}>
      <div
        ref={panelRef}
        aria-hidden="true"
        className="page-curtain fixed inset-0 z-[200] flex items-center justify-center"
        style={{ background: "var(--background)", transform: "scaleY(1)" }}
      >
        <div className="overflow-hidden px-2 py-1">
          <span ref={splashRef} data-splash-name className="block whitespace-nowrap text-center text-lg font-bold tracking-tight" style={{ color: "var(--foreground)", visibility: "hidden", transform: "translateY(110%)" }}>
            {SITE.name}
          </span>
        </div>
      </div>
      <noscript><style>{".page-curtain { display: none; }"}</style></noscript>
      <div className="contents" inert={!ready}>{children}</div>
    </Ctx.Provider>
  );
}
