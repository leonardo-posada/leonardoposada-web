/**
 * Read once, use everywhere. Fallback is the production canonical so
 * sitemap/OG links don't break if the env var is missing.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://leonardoposada.com";
