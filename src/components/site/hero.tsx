"use client";

import Image from "next/image";
import { Fragment, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { SITE } from "@/lib/site";
import { REVEAL, TRANS_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { TextLink } from "@/components/ui/text-link";
import { TextArrow } from "@/components/ui/text-arrow";
import { Section } from "./section";
import { usePageCurtain } from "./page-curtain-provider";

type ProjectMentionKey = "rappi" | "yuno";

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
      className="relative cursor-pointer after:pointer-events-none after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-500 after:ease-out-expo hover:after:scale-x-100"
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

/**
 * Reveal image that scales in when the matching project mention is hovered.
 * Positioned to the right of the hero text; shares col-start-3 / row-start-1
 * across variants.
 */
function HoverImage({
  project,
  hovered,
  outer,
  width,
  imgSizes,
}: {
  project: ProjectMentionKey;
  hovered: ProjectMentionKey | null;
  outer: string;
  width: string;
  imgSizes: string;
}) {
  return (
    <div
      className={cn(
        "pointer-events-none z-0 hidden md:col-start-3 md:row-start-1 md:flex md:items-start md:justify-center",
        outer,
      )}
    >
      <div
        className={cn(
          "relative aspect-[4/5] origin-center overflow-hidden bg-muted transition-all duration-500 ease-out-expo",
          width,
          hovered === project
            ? "scale-[1.2] opacity-100"
            : "scale-0 opacity-0",
        )}
      >
        <Image
          src="/hero/mention.jpg"
          alt=""
          fill
          sizes={imgSizes}
          className="object-cover"
        />
      </div>
    </div>
  );
}

export function Hero() {
  const { ready } = usePageCurtain();
  const [hovered, setHovered] = useState<ProjectMentionKey | null>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const title = titleRef.current;
    if (!title) return;
    // Words on the same responsive line share one reveal timing.
    const measureLines = () => {
      let line = -1;
      let previousTop = -Infinity;
      title.querySelectorAll<HTMLElement>("[data-hero-word]").forEach((word) => {
        if (Math.abs(word.offsetTop - previousTop) > 2) {
          line += 1;
          previousTop = word.offsetTop;
        }
        word.style.setProperty("--hero-line", String(line));
      });
    };
    measureLines();
    const observer = new ResizeObserver(measureLines);
    observer.observe(title);
    let active = true;
    document.fonts.ready.then(() => { if (active) measureLines(); });
    return () => { active = false; observer.disconnect(); };
  }, []);

  return (
    <Section id="hero" className="pt-16 pb-24 md:pt-32">
      {/* col 1 — avatar (right-aligned within its column) */}
      <motion.div
        variants={REVEAL}
        initial="hidden"
        animate={ready ? "show" : "hidden"}
        transition={TRANS_OUT}
        className="col-span-2 md:col-span-1 md:justify-self-end"
      >
        <Avatar />
      </motion.div>

      {/* cols 2-3 — hero content (z-10 so it sits ABOVE the hover images) */}
      <div className="relative z-10 col-span-2 flex flex-col gap-10 md:col-span-2 md:col-start-2 md:row-start-1">
        <h1
          ref={titleRef}
          data-hero-reveal={ready ? "visible" : "hidden"}
          className="hero-mask-title relative max-w-3xl font-light text-foreground text-2xl md:text-4xl leading-[1.25] tracking-[-1.5px]"
        >
          {"Hi, I'm Leonardo. Product Designer with over 15 years of experience. Founding Designer & Head of Design at Rappi, now Founding Designer & Head of Design at Yuno.".split(" ").map((word, index) => (
            <Fragment key={index}>
              {index > 0 && " "}
              <span data-hero-word className="hero-word-mask">
                <span className="hero-word-rise">
                  {word === "Rappi," ? <><ProjectMention project="rappi" onHover={setHovered}>Rappi</ProjectMention>,</>
                    : word === "Yuno." ? <><ProjectMention project="yuno" onHover={setHovered}>Yuno</ProjectMention>.</>
                    : word}
                </span>
              </span>
            </Fragment>
          ))}
        </h1>

        <motion.div
          variants={REVEAL}
          initial="hidden"
          animate={ready ? "show" : "hidden"}
          transition={{ ...TRANS_OUT, delay: 0.32 }}
          className="flex items-center gap-2 text-lg font-light text-foreground md:text-xl"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-70 [animation-duration:2.4s]" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          Available for remote work.
        </motion.div>

        <motion.ul
          variants={REVEAL}
          initial="hidden"
          animate={ready ? "show" : "hidden"}
          transition={{ ...TRANS_OUT, delay: 0.48 }}
          className="flex flex-col gap-1"
        >
          <li>
            <TextLink href={SITE.socials.linkedin} external>
              LinkedIn
            </TextLink>
          </li>
          <li>
            <TextLink href={SITE.socials.dribbble} external>
              Dribbble
            </TextLink>
          </li>
          <li>
            <TextLink href={SITE.socials.instagram} external>
              Instagram
            </TextLink>
          </li>
          <li className="pt-3">
            <TextLink
              href={`mailto:${SITE.email}`}
              external
              leadingIcon={<TextArrow />}
            >
              Let&apos;s talk
            </TextLink>
          </li>
        </motion.ul>
      </div>

      {/* Rappi hover image · behind text, scale-in on hover */}
      <HoverImage
        project="rappi"
        hovered={hovered}
        outer="md:col-span-1 md:-mt-16"
        width="w-full"
        imgSizes="(min-width: 768px) 25vw, 100vw"
      />
      {/* Yuno hover image · centered on col 3/4 boundary */}
      <HoverImage
        project="yuno"
        hovered={hovered}
        outer="md:col-span-2"
        width="w-1/2"
        imgSizes="(min-width: 768px) 12.5vw, 100vw"
      />
    </Section>
  );
}
