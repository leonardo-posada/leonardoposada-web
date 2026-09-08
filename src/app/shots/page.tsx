import type { Metadata } from "next";
import { ShotsGallery } from "@/components/site/shots-gallery";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: `Shots — ${SITE.name}`,
  description: "Selected UI shots and explorations.",
};

export default function ShotsPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-16 pb-20 md:px-10 md:pt-24 md:pb-28">
      <div className="mb-10 flex flex-col gap-3 md:mb-14">
        <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Shots
        </span>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
          Explorations, work-in-progress, and details.
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
          A running gallery of UI moments from Yuno, Rappi, Kontigo, and side experiments.
        </p>
      </div>
      <ShotsGallery />
    </section>
  );
}
