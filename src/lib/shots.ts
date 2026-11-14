/** Reference archive. Project labels record where each image was used,
 * not authorship. Original files are preserved in public/work. */
export type Shot = {
  id: string;
  title: string;
  project: "Yuno" | "Rappi" | "Kontigo" | "Personal";
  src: string;
  ratio: number;
};

export const SHOTS: readonly Shot[] = [
  { id: "reference-yuno-1", title: "Reference 01", project: "Yuno", src: "/work/yuno/hero.webp", ratio: 2400 / 1801 },
  { id: "reference-yuno-2", title: "Reference 02", project: "Yuno", src: "/work/yuno/detail-1.webp", ratio: 2400 / 1800 },
  { id: "reference-yuno-3", title: "Reference 03", project: "Yuno", src: "/work/yuno/detail-2.webp", ratio: 2400 / 1800 },
  { id: "reference-rappi-1", title: "Reference 01", project: "Rappi", src: "/work/rappi/hero.webp", ratio: 2400 / 1800 },
  { id: "reference-rappi-2", title: "Reference 02", project: "Rappi", src: "/work/rappi/detail-1.webp", ratio: 2400 / 1800 },
  { id: "reference-rappi-3", title: "Reference 03", project: "Rappi", src: "/work/rappi/detail-2.webp", ratio: 2400 / 1800 },
  { id: "reference-kontigo-1", title: "Reference 01", project: "Kontigo", src: "/work/kontigo/hero.webp", ratio: 2400 / 1800 },
  { id: "reference-kontigo-2", title: "Reference 02", project: "Kontigo", src: "/work/kontigo/detail-1.webp", ratio: 2400 / 1800 },
];
