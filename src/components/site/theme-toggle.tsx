"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CircleHalfTilt } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark";
type Phase = "idle" | "falling" | "rising";

/** Curtain fall/rise duration · also the toggle lockout window. */
const DURATION = 550;
const EASING = "cubic-bezier(0.22, 1, 0.36, 1)";

/**
 * Theme toggle with a "sheet" transition. A fullscreen overlay tinted with
 * the TARGET theme's background (read live from the --background DS token)
 * slides down from the top, the theme switches while covered, then it
 * slides back up revealing the new theme.
 *
 * Rendered via portal to document.body so the fixed overlay escapes the
 * backdrop-filter stacking context of the parent liquid-glass pill.
 * Respects prefers-reduced-motion (skips the sheet, switches directly).
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [curtainColor, setCurtainColor] = useState<string>("transparent");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(
      document.documentElement.classList.contains("dark") ? "dark" : "light",
    );
    setMounted(true);
  }, []);

  const toggle = () => {
    if (phase !== "idle" || !theme) return;
    const next: Theme = theme === "dark" ? "light" : "dark";

    const applyTheme = (t: Theme) => {
      document.documentElement.classList.toggle("dark", t === "dark");
      try {
        localStorage.setItem("theme", t);
      } catch {}
      setTheme(t);
    };

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) {
      applyTheme(next);
      return;
    }

    // Read the TARGET theme's --background DS token live · toggle the class
    // in a single JS tick (no paint between), measure, revert. The curtain
    // color stays in sync with the design-system palette.
    const el = document.documentElement;
    const wasDark = el.classList.contains("dark");
    el.classList.toggle("dark", next === "dark");
    const nextBg =
      getComputedStyle(el).getPropertyValue("--background").trim() ||
      (next === "dark" ? "#0a0a0a" : "#ffffff");
    el.classList.toggle("dark", wasDark);

    setCurtainColor(nextBg);
    setPhase("falling");

    setTimeout(() => {
      applyTheme(next);
      setPhase("rising");
      setTimeout(() => setPhase("idle"), DURATION + 60);
    }, DURATION);
  };

  if (!theme) {
    return <span aria-hidden className="size-9" />;
  }

  const curtain = (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[200]"
      style={{
        background: curtainColor,
        transformOrigin: "top",
        transform: phase === "falling" ? "scaleY(1)" : "scaleY(0)",
        transition:
          phase !== "idle" ? `transform ${DURATION}ms ${EASING}` : "none",
      }}
    />
  );

  return (
    <>
      {mounted && createPortal(curtain, document.body)}
      <button
        type="button"
        onClick={toggle}
        aria-label={
          theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
        }
        className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <CircleHalfTilt
          weight="light"
          className={cn(
            "size-4 transition-transform duration-500 ease-out-expo",
            theme === "dark" ? "rotate-180" : "rotate-0",
          )}
        />
      </button>
    </>
  );
}

/**
 * Inline script for `<head>` that applies the correct theme class BEFORE
 * React hydrates, preventing a flash of the wrong mode.
 *
 * Priority: explicit user choice (localStorage) → time of day (dark 18:00–05:00,
 * light 05:00–18:00 in the visitor's local time). The old prefers-color-scheme
 * fallback is intentionally dropped so the "natural light" experience is
 * consistent regardless of the visitor's OS setting.
 */
export const themeInitScript = `
(function(){try{
  var t=localStorage.getItem('theme');
  if(t==='dark'){
    document.documentElement.classList.add('dark');
  } else if(!t){
    var h=new Date().getHours();
    if(h>=18||h<5) document.documentElement.classList.add('dark');
  }
}catch(e){}})();
`;
