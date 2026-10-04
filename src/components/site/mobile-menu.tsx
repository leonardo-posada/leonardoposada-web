"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { SITE } from "@/lib/site";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { TextLink } from "@/components/ui/text-link";
import { TextArrow } from "@/components/ui/text-arrow";
import { SITE_CONTAINER } from "./section";
import { GridToggle } from "./grid-toggle";
import { ThemeToggle } from "./theme-toggle";

/**
 * Fullscreen mobile navigation. Opened from the navbar's burger button.
 * Locks body scroll while open and closes on Escape or on any nav link tap.
 */
export function MobileMenu({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: EASE.out }}
      className="fixed inset-0 z-50 bg-background md:hidden"
    >
      <div className={cn(SITE_CONTAINER, "flex h-full flex-col pt-16")}>
        {/* nav items (pt-16 above leaves room for the navbar's toggle button) */}
        <nav className="flex flex-col gap-6 pt-4">
          <TextLink href="/#top" onClick={onClose}>
            Intro
          </TextLink>
          <TextLink href="/shots" onClick={onClose}>
            Shots
          </TextLink>
          <TextLink
            href={SITE.resumeUrl}
            external
            onClick={onClose}
            trailingIcon={<ArrowUpRight weight="light" className="size-4" />}
          >
            Resume
          </TextLink>
        </nav>

        {/* utility icons */}
        <div className="mt-6 flex items-center gap-2">
          <GridToggle />
          <ThemeToggle />
        </div>

        {/* socials · pinned to bottom */}
        <div className="mt-auto flex flex-col gap-6 pt-16 pb-10">
          <p className="text-lg font-light text-foreground">Socials</p>
          <div className="flex flex-col gap-4">
            <TextLink href={SITE.socials.linkedin} external>
              LinkedIn
            </TextLink>
            <TextLink href={SITE.socials.dribbble} external>
              Dribbble
            </TextLink>
            <TextLink href={SITE.socials.instagram} external>
              Instagram
            </TextLink>
            <TextLink
              href={`mailto:${SITE.email}`}
              external
              onClick={onClose}
              leadingIcon={<TextArrow />}
            >
              Let&apos;s talk
            </TextLink>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
