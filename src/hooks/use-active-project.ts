"use client";

import { useEffect, useState } from "react";

/**
 * Tracks which project article is currently most-visible in the viewport.
 * Returns the project's slug (e.g. "yuno") or null when no project article
 * is in view.
 *
 * Articles must have a `data-slug` attribute. On the home page, those are
 * rendered by SelectedWork's ProjectRow.
 */
export function useActiveProject(): string | null {
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    const articles = Array.from(
      document.querySelectorAll<HTMLElement>("article[data-slug]"),
    );
    if (articles.length === 0) return;

    const visible = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const s = (e.target as HTMLElement).dataset.slug;
          if (!s) continue;
          if (e.isIntersecting && e.intersectionRatio > 0.15) {
            visible.set(s, e.intersectionRatio);
          } else {
            visible.delete(s);
          }
        }
        if (visible.size === 0) {
          setSlug(null);
          return;
        }
        let best: string | null = null;
        let max = 0;
        for (const [s, r] of visible) {
          if (r > max) {
            max = r;
            best = s;
          }
        }
        setSlug(best);
      },
      { threshold: [0, 0.15, 0.3, 0.5, 0.75, 1] },
    );

    articles.forEach((a) => observer.observe(a));
    return () => observer.disconnect();
  }, []);

  return slug;
}
