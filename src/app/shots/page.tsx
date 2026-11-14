import type { Metadata } from "next";
import { ShotsGallery } from "@/components/site/shots-gallery";
import { MockupLibrary } from "@/components/site/mockup-library";
import { LuxuryLine } from "@/components/site/luxury-motion";
import { Reveal } from "@/components/site/reveal";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: `Shots — ${SITE.name}`,
  description: "Visual references and reusable device mockups.",
};

export default function ShotsPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-16 pb-20 md:px-10 md:pt-24 md:pb-28">
      <Reveal className="mb-10 flex flex-col gap-3 md:mb-14">
        <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Shots
        </span>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
          <LuxuryLine>References & mockups.</LuxuryLine>
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
          A workspace for visual inspiration and the device mockups available for each project.
        </p>
      </Reveal>
      <nav aria-label="Shots sections" className="mb-12 flex gap-6 text-sm">
        <a href="#references" className="underline underline-offset-4">Visual references</a>
        <a href="#mockups" className="underline underline-offset-4">Mockup library</a>
      </nav>
      <section id="references" aria-labelledby="references-title" className="scroll-mt-28">
        <h2 id="references-title" className="mb-3 text-2xl font-medium tracking-tight">Visual references</h2>
        <p className="mb-8 max-w-2xl text-muted-foreground">Inspiration collected from other designers, not my own project work.</p>
        <ShotsGallery />
      </section>
      <section id="mockups" aria-labelledby="mockups-title" className="mt-20 scroll-mt-28 border-t border-border pt-12 md:mt-28">
        <h2 id="mockups-title" className="mb-3 text-2xl font-medium tracking-tight">Mockup library</h2>
        <p className="mb-8 max-w-2xl text-muted-foreground">Studio 01 · Matte. Compare perspectives, project crops and full scenes to choose a mockup for your images or videos.</p>
        <MockupLibrary />
      </section>
    </section>
  );
}
