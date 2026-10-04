"use client";

import { useEffect, useState } from "react";

/**
 * Shared visibility state for the 4-column grid overlay. Used by both
 * `<GridOverlay />` (renders the overlay) and `<GridToggle />` in the navbar
 * (flips it on/off). Persists in localStorage so it survives page reloads,
 * and syncs across mounted subscribers via a custom event.
 */

const STORAGE_KEY = "leonardoposada:grid-visible";
const EVENT_NAME = "leonardoposada:grid-toggle";

function readInitial(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function setGridVisible(next: boolean) {
  try {
    window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
  } catch {}
  window.dispatchEvent(new CustomEvent<boolean>(EVENT_NAME, { detail: next }));
}

export function useGrid(): readonly [boolean, () => void] {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(readInitial());
    const onToggle = (e: Event) => {
      setVisible((e as CustomEvent<boolean>).detail);
    };
    window.addEventListener(EVENT_NAME, onToggle);
    return () => window.removeEventListener(EVENT_NAME, onToggle);
  }, []);

  const toggle = () => setGridVisible(!visible);
  return [visible, toggle] as const;
}
