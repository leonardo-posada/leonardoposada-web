"use client";

import { Angle } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import { useGrid } from "@/hooks/use-grid";

/**
 * Navbar button that toggles the 4-column grid overlay. When on, the icon
 * flips to `text-foreground` so you can tell at a glance that the overlay
 * is active.
 */
export function GridToggle() {
  const [visible, toggle] = useGrid();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={visible ? "Hide grid overlay" : "Show grid overlay"}
      aria-pressed={visible}
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-accent hover:text-foreground",
        visible ? "text-foreground" : "text-muted-foreground",
      )}
    >
      <Angle
        weight="light"
        className={cn(
          "size-4 transition-transform duration-500 ease-out-expo",
          visible ? "rotate-180" : "rotate-0",
        )}
      />
    </button>
  );
}
