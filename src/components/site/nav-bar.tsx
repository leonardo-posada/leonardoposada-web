"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { SITE } from "@/lib/site";
import { TRANS_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { SITE_CONTAINER, SITE_GRID } from "./section";
import { ThemeToggle } from "./theme-toggle";

export function NavBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={TRANS_OUT}
      className={cn(
        "sticky top-0 z-40 w-full transition-colors",
        scrolled
          ? "bg-background/80 backdrop-blur-md"
          : "bg-transparent",
      )}
    >
      <div className={SITE_CONTAINER}>
        <nav className={cn(SITE_GRID, "h-16 items-center")}>
          <Link
            href="/"
            className="col-span-1 justify-self-start text-xl font-bold tracking-tight text-foreground transition-opacity hover:opacity-70"
          >
            {SITE.name}
          </Link>

          <div className="col-span-1 flex items-center justify-end gap-6 md:col-span-1 md:col-start-4">
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
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </motion.header>
  );
}
