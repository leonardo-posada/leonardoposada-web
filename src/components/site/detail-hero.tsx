"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { REVEAL, TRANS_OUT } from "@/lib/motion";
import { isImageMask, type Project } from "@/lib/site";
import { LuxuryLine, LuxuryMedia } from "./luxury-motion";
import { DesktopMockup } from "./desktop-mockup";
import { Section } from "./section";
import { BackToWorkLink } from "./back-to-work-link";
import { usePageCurtain } from "./page-curtain-provider";

/**
 * Cascading entry for the /work/[slug] above-the-fold region.
 * Mirrors the Hero cascade on the home page: ~160ms stagger between items,
 * same REVEAL variant + TRANS_OUT transition from @/lib/motion.
 *
 * Waits for the PageCurtain to finish retracting (ready === true) before
 * starting the cascade, so the animation isn't playing behind the sheet.
 * Uses `useAnimation` to fire the "show" state imperatively from an effect
 * once ready flips to true.
 */
export function DetailHero({ project }: { project: Project }) {
  const { ready } = usePageCurtain();
  const kontigoDesktop = project.slug === "kontigo" ? project.homeMockup : undefined;
  const controls = useAnimation();

  useEffect(() => {
    if (ready) controls.start("show");
  }, [ready, controls]);

  const trans = (delay: number) => ({ ...TRANS_OUT, delay });
  const common = {
    variants: REVEAL,
    initial: "hidden" as const,
    animate: controls,
  };

  return (
    <>
      <Section id="hero" className="pt-16 pb-16 md:pt-24">
        <motion.div
          {...common}
          transition={trans(0)}
          className="col-span-2 md:col-span-4"
        >
          <BackToWorkLink />
        </motion.div>

        <motion.div
          {...common}
          transition={trans(0.16)}
          className="col-span-2 mt-16 md:col-span-4 md:mt-24"
        >
          <h1 className="font-light text-foreground text-7xl md:text-[12rem] leading-[0.9] tracking-[-0.045em]">
            <LuxuryLine delay={0.16}>{project.name}</LuxuryLine>
          </h1>
        </motion.div>

        <motion.div
          {...common}
          transition={trans(0.32)}
          className="col-span-2 mt-10 md:col-span-2 md:col-start-3 md:mt-16"
        >
          <p className="font-light text-foreground text-2xl md:text-4xl leading-[1.25] tracking-[-1.5px]">
            {project.tagline}
          </p>
        </motion.div>
      </Section>

      <Section className="pb-16 md:pb-24">
        <motion.div
          {...common}
          transition={trans(0.48)}
          className="col-span-2 grid grid-cols-2 gap-6 border-t border-border/70 pt-16 md:col-span-4 md:grid-cols-4 md:gap-8"
        >
          <div className="flex flex-col gap-3">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Year
            </p>
            <p className="text-base font-light text-foreground">
              {project.year}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Role
            </p>
            <p className="text-base font-light text-foreground">
              {project.role}
            </p>
          </div>
          <div className="col-span-2 flex flex-col gap-3">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Services
            </p>
            <p className="text-base font-light text-foreground">
              {project.services.join(" · ")}
            </p>
          </div>
        </motion.div>
      </Section>

      {isImageMask(project.media?.m01) && (
        <Section className="pb-24 md:pb-32">
          <motion.div
            {...common}
            transition={trans(0.64)}
            className="col-span-2 md:col-span-4"
          >
            <figure className="flex flex-col gap-4">
              <LuxuryMedia>
              {kontigoDesktop ? <div className="[&_figcaption]:hidden">
                <DesktopMockup name={project.name} variant="front" background="kontigo" outlineBackground fitFront screen={kontigoDesktop.leftSilhouetteSoftLightScreen} />
              </div> : <div className="overflow-hidden rounded-xl bg-muted">
                <Image
                  src={project.media.m01.src}
                  alt={project.media.m01.alt ?? `${project.name} — m01`}
                  width={1600}
                  height={900}
                  sizes="(min-width: 1024px) 1600px, 100vw"
                  className="h-auto w-full"
                  priority
                />
              </div>}
              </LuxuryMedia>
              {!kontigoDesktop && project.media.m01.caption && (
                <figcaption className="max-w-xl text-sm font-light text-muted-foreground leading-[1.5]">
                  {project.media.m01.caption}
                </figcaption>
              )}
            </figure>
          </motion.div>
        </Section>
      )}
      {kontigoDesktop && <Section className="pb-24 md:pb-32 -mt-16 md:-mt-24 [&_figcaption]:hidden">
        <div className="col-span-2 md:col-span-2">
          <LuxuryMedia>
            <DesktopMockup name="Kontigo AI" variant="right-tilted" background="kontigo" outlineBackground screen={{src:"/work/kontigo/screens/corporate-ai-home-dark-6k.webp",alt:"Kontigo AI — home en modo oscuro"}} />
          </LuxuryMedia>
        </div>
        <div className="col-span-2 md:col-span-2">
          <LuxuryMedia>
            <DesktopMockup name="Kontigo · Cuentas" variant="left-silhouette-soft-light" background="kontigo" outlineBackground closeUp screen={{src:"/work/kontigo/screens/corporate-accounts-dark-6k.webp",alt:"Kontigo Corporate — Cuentas en modo oscuro"}} />
          </LuxuryMedia>
        </div>
      </Section>}
    </>
  );
}
