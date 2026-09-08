"use client";

import { motion } from "framer-motion";
import { PROJECTS, type Project } from "@/lib/site";
import { EASE, DURATION, REVEAL, TRANS_OUT } from "@/lib/motion";
import { Section } from "./section";
import { ProjectMedia } from "./project-media";

function ProjectRow({ project, index }: { project: Project; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.base, ease: EASE.out, delay: 0.3 + index * 0.16 }}
      className="col-span-2 grid grid-cols-subgrid gap-x-4 gap-y-12 border-t border-border/70 py-16 md:col-span-4 md:gap-x-8 md:gap-y-16"
    >
      {/* col 1 — project name */}
      <div className="col-span-2 md:col-span-1">
        <h3
          className="font-light text-foreground text-4xl md:text-5xl"
          style={{ lineHeight: 1.15, letterSpacing: "-0.04em" }}
        >
          {project.name}
        </h3>
      </div>

      <div className="hidden md:col-span-1 md:block" />

      {/* cols 3-4 — description + year + details stacked */}
      <div className="col-span-2 flex flex-col gap-6 text-base md:col-span-2">
        <p className="font-light text-foreground" style={{ lineHeight: 1.5 }}>
          {project.role}. {project.description}
        </p>

        <div className="flex flex-col gap-1">
          <p className="font-normal text-foreground">Year</p>
          <p className="font-light text-foreground">{project.year}</p>
        </div>

        <div className="flex flex-col gap-1">
          <p className="font-normal text-foreground">Details</p>
          <p className="font-light text-foreground">
            {project.services.join(", ")}
          </p>
        </div>
      </div>

      {/* media below (full 4 cols) */}
      <ProjectMedia
        slot={project.name}
        hero={project.media?.hero}
        detail1={project.media?.detail1}
        detail2={project.media?.detail2}
      />
    </motion.article>
  );
}

export function SelectedWork() {
  return (
    <>
      <Section id="selected-work" className="pt-16 pb-24">
        <motion.div
          variants={REVEAL}
          initial="hidden"
          animate="show"
          transition={{ ...TRANS_OUT, delay: 0.2 }}
          className="col-span-2 flex flex-col gap-4 md:col-span-2 md:col-start-3"
        >
          <h2
            className="font-light text-foreground text-6xl md:text-9xl"
            style={{ lineHeight: 0.93, letterSpacing: "-0.036em" }}
          >
            Selected
            <br />
            Work
          </h2>
          <p
            className="font-light text-foreground text-2xl md:text-4xl"
            style={{ lineHeight: 1.25, letterSpacing: "-0.03em" }}
          >
            10&apos; – present
          </p>
        </motion.div>
      </Section>
      <Section id="work" className="pb-8">
        {PROJECTS.map((p, i) => (
          <ProjectRow key={p.slug} project={p} index={i} />
        ))}
      </Section>
    </>
  );
}
