"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import { PILL_GLASS } from "@/lib/glass";
import { smoothScrollTo } from "@/lib/scroll";

/**
 * Floating back-to-top arrow wrapped in a liquid-glass pill (same recipe as
 * the nav toggles pill). Appears when the "Selected Work" section crosses the
 * viewport threshold. Aligned to the site container's horizontal padding
 * (px-6 / lg:px-14) so it never floats over the max-width edge.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const check = () => {
      const target = document.getElementById("selected-work");
      if (!target) {
        // Fallback for pages without a selected-work section (e.g. /work/[slug]).
        setVisible(window.scrollY > 600);
        return;
      }
      const rect = target.getBoundingClientRect();
      setVisible(rect.top <= window.innerHeight * 0.5);
    };

    let frame = 0;
    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        check();
      });
    };

    check();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      className={cn(
        PILL_GLASS,
        "fixed right-6 bottom-6 z-30 flex items-center p-0.5 transition-all duration-500 ease-out-expo lg:right-14 lg:bottom-14",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <button
        type="button"
        onClick={() => smoothScrollTo(0)}
        aria-label="Back to top"
        className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <ArrowUp weight="light" className="size-4" />
      </button>
    </div>
  );
}
