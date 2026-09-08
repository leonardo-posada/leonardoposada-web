"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, List, X } from "@phosphor-icons/react/dist/ssr";
import { SITE } from "@/lib/site";
import { TRANS_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { SITE_CONTAINER, SITE_GRID } from "./section";
import { GridToggle } from "./grid-toggle";
import { ThemeToggle } from "./theme-toggle";
import { MobileMenu } from "./mobile-menu";

export function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={TRANS_OUT}
        className={cn(
          "sticky top-0 z-[60] w-full transition-colors",
          scrolled ? "bg-background/80 backdrop-blur-md" : "bg-transparent",
        )}
      >
        <div className={SITE_CONTAINER}>
          <nav className={cn(SITE_GRID, "h-16 items-center")}>
            <Link
              href="/"
              className="col-span-1 justify-self-start text-lg font-bold tracking-tight text-foreground transition-opacity hover:opacity-70"
            >
              {SITE.name}
            </Link>

            {/* Mobile: single toggle button that morphs List ↔ X */}
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="col-span-1 relative inline-flex size-9 shrink-0 items-center justify-center justify-self-end rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:hidden"
            >
              <List
                weight="light"
                className={cn(
                  "absolute size-4 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  menuOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100",
                )}
              />
              <X
                weight="light"
                className={cn(
                  "absolute size-4 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  menuOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0",
                )}
              />
            </button>

            {/* Desktop nav — hidden on mobile, occupies col 4 on desktop */}
            <div className="hidden md:col-span-1 md:col-start-4 md:flex md:items-center md:justify-end md:gap-6">
              <Link
                href="/#top"
                className="text-base font-normal text-muted-foreground transition-colors hover:text-foreground"
              >
                Intro
              </Link>
              <Link
                href="/shots"
                className="text-base font-normal text-muted-foreground transition-colors hover:text-foreground"
              >
                Shots
              </Link>
              <a
                href={SITE.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-base font-normal text-muted-foreground transition-colors hover:text-foreground"
              >
                Resume
                <ArrowUpRight weight="light" className="size-4" />
              </a>
              <GridToggle />
              <ThemeToggle />
            </div>
          </nav>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
