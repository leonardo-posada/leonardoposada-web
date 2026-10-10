"use client";

import { motion } from "framer-motion";
import { PROJECTS, isImageMask, type Project } from "@/lib/site";
import { EASE, DURATION } from "@/lib/motion";
import { Section } from "./section";
import { Reveal } from "./reveal";
import { ProjectMedia } from "./project-media";

function ProjectRow({ project }: { project: Project }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: DURATION.base, ease: EASE.out }}
      data-slug={project.slug}
      className="col-span-2 grid grid-cols-subgrid gap-x-4 gap-y-12 border-t border-border/70 py-16 md:col-span-4 md:gap-x-8 md:gap-y-16"
    >
      {/* col 1 — project name */}
      <div className="col-span-2 md:col-span-1">
        <h3 className="font-light text-foreground text-4xl md:text-5xl leading-[1.15] tracking-[-0.04em]">
          {project.name}
        </h3>
      </div>

      <div className="hidden md:col-span-1 md:block" />

      {/* cols 3-4 — description + year + details stacked */}
      <div className="col-span-2 flex flex-col gap-8 text-base md:col-span-2">
        <p className="font-light text-foreground leading-[1.5]">
          {project.role}. {project.description}
        </p>

        <div className="flex flex-col gap-3">
          <p className="text-xs font-normal uppercase tracking-[0.2em] text-muted-foreground">
            Year
          </p>
          <p className="font-light text-foreground">{project.year}</p>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-xs font-normal uppercase tracking-[0.2em] text-muted-foreground">
            Details
          </p>
          <p className="font-light text-foreground">
            {project.services.join(", ")}
          </p>
        </div>
      </div>

      {/* media below (full 4 cols). Animation masks render only on the detail
       *  page, not the home list — show a placeholder here instead. */}
      <ProjectMedia
        slot={project.name}
        hero={isImageMask(project.media?.m01) ? project.media.m01.src : undefined}
        detail1={isImageMask(project.media?.m02) ? project.media.m02.src : undefined}
        detail2={isImageMask(project.media?.m03) ? project.media.m03.src : undefined}
      />
    </motion.article>
  );
}

export function SelectedWork() {
  return (
    <>
      <Section id="selected-work" className="pt-16 pb-24">
        <Reveal className="col-span-2 flex flex-col gap-4 md:col-span-2 md:col-start-3">
          <h2 className="font-light text-foreground text-6xl md:text-9xl leading-[0.93] tracking-[-0.036em]">
            Selected
            <br />
            Work
          </h2>
          <p className="font-light text-foreground text-2xl md:text-4xl leading-[1.25] tracking-[-0.03em]">
            10&apos; – present
          </p>
        </Reveal>
      </Section>
      <Section id="work" className="pb-8">
        {PROJECTS.map((p) => (
          <ProjectRow key={p.slug} project={p} />
        ))}
      </Section>
    </>
  );
}
