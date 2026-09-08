"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { SITE } from "@/lib/site";
import { REVEAL, TRANS_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Section } from "./section";

type ProjectMentionKey = "rappi" | "yuno";

/**
 * Hero link recipe. The underline is a 1px ::after that grows from the left
 * on hover and retracts back to the left on unhover — subtle, smooth,
 * uses the same ease-out curve as the rest of the site.
 */
const LINK_CLASS =
  "group inline-flex w-fit items-baseline text-lg font-light text-muted-foreground transition-colors duration-300 hover:text-foreground md:text-xl";

const LINK_INNER =
  "relative after:pointer-events-none after:absolute after:bottom-[-2px] after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-[400ms] after:ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:after:scale-x-100";

/**
 * Inline hoverable "Rappi" / "Yuno" mention inside the hero title.
 * Same 1px growing underline as the social links + reports the hovered project
 * upward so the parent can reveal the corresponding image on the right.
 */
function ProjectMention({
  project,
  onHover,
  children,
}: {
  project: ProjectMentionKey;
  onHover: (p: ProjectMentionKey | null) => void;
  children: React.ReactNode;
}) {
  return (
    <span
      onMouseEnter={() => onHover(project)}
      onMouseLeave={() => onHover(null)}
      className="relative cursor-pointer after:pointer-events-none after:absolute after:bottom-[-2px] after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-[400ms] after:ease-[cubic-bezier(0.22,1,0.36,1)] hover:after:scale-x-100"
    >
      {children}
    </span>
  );
}

function Avatar() {
  return (
    <div className="relative size-16 shrink-0 overflow-hidden rounded-full bg-muted md:size-20">
      <Image
        src="/hero/avatar.png"
        alt="Leonardo Posada"
        fill
        sizes="80px"
        className="object-cover"
        priority
      />
    </div>
  );
}

export function Hero() {
  const [hovered, setHovered] = useState<ProjectMentionKey | null>(null);

  return (
    <Section className="pt-16 pb-24 md:pt-32">
      {/* col 1 — avatar (right-aligned within its column) */}
      <motion.div
        variants={REVEAL}
        initial="hidden"
        animate="show"
        transition={TRANS_OUT}
        className="col-span-2 md:col-span-1 md:justify-self-end"
      >
        <Avatar />
      </motion.div>

      {/* cols 2-3 — hero content (z-10 so it sits ABOVE the hover images) */}
      <div className="relative z-10 col-span-2 flex flex-col gap-10 md:col-span-2 md:col-start-2 md:row-start-1">
        <motion.h1
          variants={REVEAL}
          initial="hidden"
          animate="show"
          transition={{ ...TRANS_OUT, delay: 0.16 }}
          className="max-w-3xl font-light text-foreground text-2xl md:text-4xl"
          style={{ lineHeight: 1.25, letterSpacing: "-1.5px" }}
        >
          Hi, I&apos;m Leonardo. Product Designer with over 15 years of
          experience. Founding Designer & Head of Design at{" "}
          <ProjectMention project="rappi" onHover={setHovered}>
            Rappi
          </ProjectMention>
          , now Founding Designer & Head of Design at{" "}
          <ProjectMention project="yuno" onHover={setHovered}>
            Yuno
          </ProjectMention>
          .
        </motion.h1>

        <motion.div
          variants={REVEAL}
          initial="hidden"
          animate="show"
          transition={{ ...TRANS_OUT, delay: 0.32 }}
          className="flex items-center gap-2 text-lg font-light text-foreground md:text-xl"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-70 [animation-duration:2.4s]" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          Available for freelance work.
        </motion.div>

        <motion.ul
          variants={REVEAL}
          initial="hidden"
          animate="show"
          transition={{ ...TRANS_OUT, delay: 0.48 }}
          className="flex flex-col gap-1"
        >
          <li>
            <a
              href={SITE.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className={LINK_CLASS}
            >
              <span className={LINK_INNER}>LinkedIn</span>
            </a>
          </li>
          <li>
            <a
              href={SITE.socials.dribbble}
              target="_blank"
              rel="noreferrer"
              className={LINK_CLASS}
            >
              <span className={LINK_INNER}>Dribbble</span>
            </a>
          </li>
          <li>
            <a
              href={SITE.socials.instagram}
              target="_blank"
              rel="noreferrer"
              className={LINK_CLASS}
            >
              <span className={LINK_INNER}>Instagram</span>
            </a>
          </li>
          <li className="pt-3">
            <a href={`mailto:${SITE.email}`} className={LINK_CLASS}>
              <span aria-hidden className="mr-2">
                →
              </span>
              <span className={LINK_INNER}>Let&apos;s talk</span>
            </a>
          </li>
        </motion.ul>
      </div>

      {/* col 3 — Rappi hover image (behind text, scale-in on hover, midway between header and title) */}
      <div className="pointer-events-none z-0 hidden md:col-span-1 md:col-start-3 md:row-start-1 md:-mt-16 md:flex md:items-start md:justify-center">
        <div
          className={cn(
            "relative aspect-[4/5] w-full origin-center overflow-hidden bg-muted transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            hovered === "rappi"
              ? "scale-[1.2] opacity-100"
              : "scale-0 opacity-0",
          )}
        >
          <Image
            src="/hero/mention.jpg"
            alt=""
            fill
            sizes="(min-width: 768px) 25vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      {/* cols 3-4 — Yuno hover image (centered on the col 3/4 boundary, aligned with hero content start) */}
      <div className="pointer-events-none z-0 hidden md:col-span-2 md:col-start-3 md:row-start-1 md:flex md:items-start md:justify-center">
        <div
          className={cn(
            "relative aspect-[4/5] w-1/2 origin-center overflow-hidden bg-muted transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            hovered === "yuno"
              ? "scale-[1.2] opacity-100"
              : "scale-0 opacity-0",
          )}
        >
          <Image
            src="/hero/mention.jpg"
            alt=""
            fill
            sizes="(min-width: 768px) 12.5vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </Section>
  );
}
