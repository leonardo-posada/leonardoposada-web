"use client";

import { useEffect, useState } from "react";
import { SITE_CONTAINER } from "./section";

/**
 * Dev-time visual overlay showing the 4-column grid.
 *
 * Toggle:
 *   - Press "g" to show/hide.
 *   - Add ?grid=1 to force show, ?grid=0 to force hide.
 *   - Off by default.
 */
export function GridOverlay() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    const q = url.searchParams.get("grid");
    if (q === "1") setVisible(true);
    if (q === "0") setVisible(false);

    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "g" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const target = e.target as HTMLElement | null;
        if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) return;
        setVisible((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-30 hidden md:block">
      <div className={`${SITE_CONTAINER} h-full`}>
        <div className="grid h-full grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="relative border-l border-r border-dashed border-primary/25"
            >
              <span className="absolute left-1 top-20 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary-text">
                col {i}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="pointer-events-none fixed bottom-4 right-4 rounded-md border border-border/70 bg-background/80 px-2 py-1 text-[10px] font-medium text-muted-foreground backdrop-blur">
        grid on · press <kbd className="font-semibold">g</kbd> to hide
      </div>
    </div>
  );
}
