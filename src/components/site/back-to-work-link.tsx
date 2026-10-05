"use client";

import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { TextLink } from "@/components/ui/text-link";
import { usePageCurtain } from "@/components/site/page-curtain-provider";
import { hasHomeScroll } from "@/lib/home-scroll";

const WORK_HREF_FALLBACK = "/#work";

/**
 * In-flow "All work" back link for /work/[slug] pages. Lives at the top of
 * the hero. Triggers the same curtain transition as the sticky BackToWorkPill
 * when clicked. Mirrors the TextLink nav variant used elsewhere.
 */
export function BackToWorkLink() {
  const { navigate } = usePageCurtain();
  return (
    <TextLink
      variant="nav"
      href={WORK_HREF_FALLBACK}
      onClick={(e) => {
        e.preventDefault();
        navigate(hasHomeScroll() ? "/" : WORK_HREF_FALLBACK);
      }}
      leadingIcon={<ArrowLeft weight="light" className="size-4" />}
    >
      All work
    </TextLink>
  );
}
