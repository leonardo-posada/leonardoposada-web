"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { SITE } from "@/lib/site";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { SITE_CONTAINER } from "./section";
import { GridToggle } from "./grid-toggle";
import { ThemeToggle } from "./theme-toggle";

/**
 * Shared recipe for every tappable text row in the menu. Same size + weight
 * we already use for hero title (mobile), same color tokens as the hero /
 * footer links (muted → foreground on hover).
 */
const MENU_ROW =
  "text-lg font-light text-muted-foreground transition-colors hover:text-foreground";

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
          <Link href="/#top" onClick={onClose} className={MENU_ROW}>
            Intro
          </Link>
          <Link href="/shots" onClick={onClose} className={MENU_ROW}>
            Shots
          </Link>
          <a
            href={SITE.resumeUrl}
            target="_blank"
            rel="noreferrer"
            onClick={onClose}
            className={cn(MENU_ROW, "inline-flex w-fit items-center gap-1")}
          >
            Resume
            <ArrowUpRight weight="light" className="size-4" />
          </a>
        </nav>

        {/* utility icons */}
        <div className="mt-6 flex items-center gap-2">
          <GridToggle />
          <ThemeToggle />
        </div>

        {/* socials — pinned to bottom */}
        <div className="mt-auto flex flex-col gap-6 pt-16 pb-10">
          <p className="text-lg font-light text-foreground">Socials</p>
          <div className="flex flex-col gap-4">
            <a
              href={SITE.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className={cn(MENU_ROW, "w-fit")}
            >
              LinkedIn
            </a>
            <a
              href={SITE.socials.dribbble}
              target="_blank"
              rel="noreferrer"
              className={cn(MENU_ROW, "w-fit")}
            >
              Dribbble
            </a>
            <a
              href={SITE.socials.instagram}
              target="_blank"
              rel="noreferrer"
              className={cn(MENU_ROW, "w-fit")}
            >
              Instagram
            </a>
            <a
              href={`mailto:${SITE.email}`}
              onClick={onClose}
              className={cn(MENU_ROW, "inline-flex w-fit items-center gap-2")}
            >
              <span aria-hidden>→</span>
              Let&apos;s talk
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
