"use client";

import { useEffect, useState } from "react";
import { CircleHalfTilt } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(
      document.documentElement.classList.contains("dark") ? "dark" : "light",
    );
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("theme", next);
    } catch {}
    setTheme(next);
  };

  if (!theme) {
    return <span aria-hidden className="size-9" />;
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
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
