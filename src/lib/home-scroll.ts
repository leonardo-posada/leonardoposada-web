/**
 * sessionStorage helpers for restoring the user's home-page scroll position
 * when they come back from a /work/[slug] detail page.
 *
 * Flow:
 *   1. On the home ActiveProjectPill click, we save `window.scrollY` here.
 *   2. BackToWork links read `hasHomeScroll()` to pick the right href · if we
 *      saved something, we go to `/` and SmoothScroll restores. Otherwise we
 *      go to `/#work` so direct visitors land at the work section.
 *   3. SmoothScroll's pathname effect reads + clears the saved value on the
 *      home mount, scrolling to that position (immediate, under the curtain).
 */

const KEY = "home-scroll";

export function saveHomeScroll(y: number) {
  try {
    sessionStorage.setItem(KEY, String(y));
  } catch {}
}

export function hasHomeScroll(): boolean {
  try {
    return sessionStorage.getItem(KEY) !== null;
  } catch {
    return false;
  }
}

export function consumeHomeScroll(): number | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (raw === null) return null;
    sessionStorage.removeItem(KEY);
    const n = parseInt(raw, 10);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

export function clearHomeScroll() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {}
}
