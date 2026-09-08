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
      className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <CircleHalfTilt
        weight="light"
        className={cn(
          "size-5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          theme === "dark" ? "rotate-180" : "rotate-0",
        )}
      />
    </button>
  );
}

/**
 * Inline script for `<head>` that applies the correct theme class BEFORE
 * React hydrates, preventing a flash of the wrong mode. Reads localStorage
 * first, then falls back to prefers-color-scheme.
 */
export const themeInitScript = `
(function(){try{
  var t=localStorage.getItem('theme');
  if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches)){
    document.documentElement.classList.add('dark');
  }
}catch(e){}})();
`;
