"use client";

import { useEffect, useState } from "react";

/** Prefer the latest project whose heading has entered; hide when the footer enters. */
export function useActiveProject(): string | null {
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    const articles = Array.from(document.querySelectorAll<HTMLElement>("article[data-slug]"));
    if (!articles.length) return;
    const footer = document.querySelector("footer");
    let frame = 0;
    const update = () => {
      frame = 0;
      const footerBounds = footer?.getBoundingClientRect();
      if (footerBounds && footerBounds.top < window.innerHeight && footerBounds.bottom > 0) {
        setSlug(null);
        return;
      }
      const active = articles.find((article, index) => {
        const image = article.querySelector('[data-home-slot="hero"]')?.getBoundingClientRect();
        const nextLine = articles[index + 1]?.getBoundingClientRect();
        return image && image.top < window.innerHeight && article.getBoundingClientRect().bottom > 0
          && (!nextLine || nextLine.top >= window.innerHeight);
      });
      setSlug(active?.dataset.slug ?? null);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return slug;
}
