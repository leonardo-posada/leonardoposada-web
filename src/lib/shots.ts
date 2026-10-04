/**
 * Placeholder shots data. Server-safe (no React, no hooks) so it can be read
 * from RSC, metadata, sitemap, etc. once real shots arrive.
 */

export type Shot = {
  id: string;
  title: string;
  project: "Yuno" | "Rappi" | "Kontigo" | "Personal";
  ratio: number;
  tone: string;
};

export const SHOTS: readonly Shot[] = [
  { id: "s1", title: "Payments overview", project: "Yuno", ratio: 4 / 3, tone: "from-indigo-500/20 to-indigo-500/5" },
  { id: "s2", title: "Card carousel", project: "Kontigo", ratio: 3 / 4, tone: "from-emerald-500/20 to-emerald-500/5" },
  { id: "s3", title: "Order tracking", project: "Rappi", ratio: 4 / 3, tone: "from-orange-500/20 to-orange-500/5" },
  { id: "s4", title: "Design tokens", project: "Yuno", ratio: 16 / 10, tone: "from-blue-500/20 to-blue-500/5" },
  { id: "s5", title: "Onboarding step", project: "Kontigo", ratio: 3 / 4, tone: "from-purple-500/20 to-purple-500/5" },
  { id: "s6", title: "Restaurant card", project: "Rappi", ratio: 4 / 3, tone: "from-rose-500/20 to-rose-500/5" },
  { id: "s7", title: "Dashboard chart", project: "Yuno", ratio: 16 / 10, tone: "from-cyan-500/20 to-cyan-500/5" },
  { id: "s8", title: "Wallet screen", project: "Kontigo", ratio: 3 / 4, tone: "from-teal-500/20 to-teal-500/5" },
  { id: "s9", title: "Type experiment", project: "Personal", ratio: 4 / 3, tone: "from-amber-500/20 to-amber-500/5" },
] as const;
