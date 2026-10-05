"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { PILL_GLASS } from "@/lib/glass";
import { cn } from "@/lib/utils";
import { TextLink } from "@/components/ui/text-link";
import { usePageCurtain } from "@/components/site/page-curtain-provider";
import { hasHomeScroll } from "@/lib/home-scroll";

/* Match the nav sticky pills exactly: 700ms with easeOutExpo. */
const SMOOTH = "transition-all duration-700 ease-out-expo";

/**
 * Sticky "All work" back pill for /work/[slug] pages. Slides down from above
 * at the same Y position as the nav sticky pills, triggered the same way
 * (once the Hero's bottom edge crosses ~80px from the viewport top).
 */
/** Default landing when the user has no saved scroll (direct visitor). */
const WORK_HREF_FALLBACK = "/#work";

export function BackToWorkPill() {
  const pathname = usePathname();
  const { navigate } = usePageCurtain();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const check = () => {
      const hero = document.getElementById("hero");
      if (!hero) {
        setVisible(window.scrollY > 80);
        return;
      }
      const rect = hero.getBoundingClientRect();
      setVisible(rect.bottom < 80);
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
  }, [pathname]);

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-[60] flex h-16 items-center px-4 md:px-6 lg:px-14",
        SMOOTH,
        visible
          ? "translate-y-4 opacity-100"
          : "-translate-y-6 opacity-0",
      )}
      aria-hidden={!visible}
    >
      <div
        className={cn(
          PILL_GLASS,
          "pointer-events-auto flex items-center px-5 py-1.5",
        )}
      >
        <TextLink
          variant="nav"
          href={WORK_HREF_FALLBACK}
          onClick={(e) => {
            e.preventDefault();
            // If the user came from the home page, go back to `/` and let
            // SmoothScroll restore the scroll position. Otherwise fall back
            // to the work section anchor.
            navigate(hasHomeScroll() ? "/" : WORK_HREF_FALLBACK);
          }}
          aria-label="Back to all work"
          leadingIcon={<ArrowLeft weight="light" className="size-4" />}
        >
          All work
        </TextLink>
      </div>
    </div>
  );
}
