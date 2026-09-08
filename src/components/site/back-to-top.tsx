"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

/**
 * Floating back-to-top arrow. Appears when the "Selected Work" section
 * (id="selected-work") crosses the viewport threshold, and stays fixed
 * bottom-right afterwards. Aligned to the site container's horizontal
 * padding (px-6 / lg:px-14) so it never floats over the max-width edge.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById("selected-work");
    if (!target) return;

    const check = () => {
      const rect = target.getBoundingClientRect();
      setVisible(rect.top <= window.innerHeight * 0.5);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  return (
    <a
      href="#top"
      aria-label="Back to top"
      className={cn(
        "fixed right-6 bottom-6 z-30 inline-flex size-10 items-center justify-center rounded-full text-muted-foreground transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-accent hover:text-foreground lg:right-14 lg:bottom-14",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <ArrowUp weight="light" className="size-4" />
    </a>
  );
}
