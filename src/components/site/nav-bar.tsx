"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, List, X } from "@phosphor-icons/react/dist/ssr";
import { SITE } from "@/lib/site";
import { TRANS_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { PILL_GLASS } from "@/lib/glass";
import { TextLink } from "@/components/ui/text-link";
import { SITE_CONTAINER } from "./section";
import { GridToggle } from "./grid-toggle";
import { ThemeToggle } from "./theme-toggle";
import { MobileMenu } from "./mobile-menu";

const SMOOTH = "transition-all duration-700 ease-out-expo";

/**
 * Site navigation.
 *
 * Idle: full-width header that scrolls away with the page (relative, NOT sticky).
 * When the Hero's bottom edge crosses ~80px from top, a fixed overlay slides
 * down from above with two centered liquid-glass pills: left pill holds the
 * nav links (Intro / Shots / Resume), right pill holds the utility toggles
 * (grid overlay + theme). easeOutExpo over 700ms for an elegant entrance.
 *
 * Mobile · idle keeps the full-width logo + burger. Sticky collapses into a
 * single centered liquid-glass pill with just the burger inside (minimal).
 */
export function NavBar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const check = () => {
      // Re-query on every tick so we always see the current page's #hero
      // (NavBar lives in the layout and is not re-mounted on client nav).
      const hero = document.getElementById("hero");
      if (!hero) {
        setScrolled(window.scrollY > 80);
        return;
      }
      const rect = hero.getBoundingClientRect();
      setScrolled(rect.bottom < 80);
    };

    // rAF-throttle scroll/resize so we run at most once per paint frame.
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

  const navLinks = (
    <>
      <TextLink variant="nav" href="/#top">
        Intro
      </TextLink>
      <TextLink variant="nav" href="/shots">
        Shots
      </TextLink>
      <TextLink
        variant="nav"
        href={SITE.resumeUrl}
        external
        trailingIcon={<ArrowUpRight weight="light" className="size-4" />}
      >
        Resume
      </TextLink>
    </>
  );

  const burgerPill = (
    <div className={cn(PILL_GLASS, "flex items-center p-0.5 md:hidden")}>
      <button
        type="button"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        className="relative inline-flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <List
          weight="light"
          className={cn(
            "absolute size-4 transition-all duration-300 ease-out-expo",
            menuOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100",
          )}
        />
        <X
          weight="light"
          className={cn(
            "absolute size-4 transition-all duration-300 ease-out-expo",
            menuOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0",
          )}
        />
      </button>
    </div>
  );

  const utilityPill = (
    <div className={cn(PILL_GLASS, "flex items-center gap-0.5 p-0.5")}>
      <GridToggle />
      <ThemeToggle />
    </div>
  );

  return (
    <>
      {/* IDLE header · scrolls away with the page (relative, NOT sticky) */}
      <motion.header
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={TRANS_OUT}
        className="relative z-[60] w-full"
      >
        <div className={SITE_CONTAINER}>
          <nav className="flex h-16 items-center justify-between">
            <Link
              href="/"
              className="text-lg font-bold tracking-tight text-foreground transition-opacity hover:opacity-70"
            >
              {SITE.name}
            </Link>
            {burgerPill}
            <div className="hidden items-center gap-6 md:flex">
              {navLinks}
              {utilityPill}
            </div>
          </nav>
        </div>
      </motion.header>

      {/* SCROLLED pills · fixed overlay, slides down from above */}
      <div
        className={cn(
          "fixed inset-x-0 top-0 z-[60] flex h-16 items-center justify-center",
          SMOOTH,
          scrolled
            ? "translate-y-4 opacity-100"
            : "pointer-events-none -translate-y-6 opacity-0",
        )}
        aria-hidden={!scrolled}
      >
        <div className="flex items-center gap-3">
          {/* Left pill · nav links (desktop only) */}
          <div
            className={cn(
              PILL_GLASS,
              "hidden items-center gap-6 px-5 py-1.5 md:flex",
            )}
          >
            {navLinks}
          </div>
          {/* Right pill · toggles (desktop only) */}
          <div className={cn("hidden md:block")}>{utilityPill}</div>
          {/* Mobile · single liquid-glass pill with burger */}
          {burgerPill}
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
