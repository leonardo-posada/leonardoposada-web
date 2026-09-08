"use client";

import { useEffect } from "react";
import { SITE_CONTAINER } from "./section";
import { setGridVisible, useGrid } from "@/lib/use-grid";

/**
 * Visual overlay showing the responsive column grid (2 cols mobile, 4 cols
 * desktop). Off by default; controlled globally via `useGrid`. Also supports:
 *   - Press "g" anywhere to toggle
 *   - `?grid=1` / `?grid=0` URL params to force show/hide
 */
export function GridOverlay() {
  const [visible] = useGrid();

  useEffect(() => {
    const url = new URL(window.location.href);
    const q = url.searchParams.get("grid");
    if (q === "1") setGridVisible(true);
    if (q === "0") setGridVisible(false);

    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "g" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const target = e.target as HTMLElement | null;
        if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) return;
        setGridVisible(
          window.localStorage.getItem("leonardoposada:grid-visible") !== "1",
        );
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-30">
      <div className={`${SITE_CONTAINER} h-full`}>
        <div className="grid h-full grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={`relative border-l border-r border-dashed border-primary/25 ${
                i >= 2 ? "hidden md:block" : ""
              }`}
            >
              <span className="absolute left-1 top-20 rounded-sm bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary-text">
                col {i + 1}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
