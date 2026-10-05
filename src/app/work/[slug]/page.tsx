import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { PROJECTS, type Project } from "@/lib/site";
import { SITE_URL } from "@/lib/env";
import { Section } from "@/components/site/section";
import { BackToWorkPill } from "@/components/site/back-to-work-pill";
import { DetailHero } from "@/components/site/detail-hero";
import { Reveal } from "@/components/site/reveal";
import { AvatarCircles } from "@/components/ui/avatar-circles";
import { cn } from "@/lib/utils";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return {};
  const url = `/work/${project.slug}`;
  const images = project.media?.hero
    ? [
        {
          url: project.media.hero,
          width: 1600,
          height: 900,
          alt: `${project.name} — ${project.tagline}`,
        },
      ]
    : undefined;
  return {
    title: project.name,
    description: project.tagline,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: project.name,
      description: project.tagline,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: project.name,
      description: project.tagline,
      images,
    },
  };
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Layout helpers · all local to this template so the editorial pacing stays
 * consistent across sections.
 * ────────────────────────────────────────────────────────────────────────── */

/** Section label · "01 · Context" style, left column on desktop. */
function SectionLabel({ number, label }: { number: string; label: string }) {
  return (
    <div className="col-span-2 md:col-span-1 md:col-start-1">
      <div className="flex items-baseline gap-3">
        <span className="text-xs font-normal text-foreground tabular-nums tracking-[0.2em]">
          {number}
        </span>
        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </span>
      </div>
    </div>
  );
}

/** Numbered section · label on col 1, prose on cols 3-4. Mobile: stacked. */
function CaseSection({
  number,
  label,
  children,
  className,
}: {
  number: string;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Section className={cn("py-20 md:py-28", className)}>
      <SectionLabel number={number} label={label} />
      <div className="col-span-2 mt-6 md:col-span-2 md:col-start-3 md:mt-0">
        {children}
      </div>
    </Section>
  );
}

/** Editorial body paragraph · unified with the home ProjectRow description:
 *  text-base font-light leading-[1.5]. */
function LeadParagraph({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-light text-foreground text-base leading-[1.5]">
      {children}
    </p>
  );
}

/** Figure with optional caption below. */
function CaptionedImage({
  src,
  alt,
  caption,
  priority,
}: {
  src: string;
  alt: string;
  caption?: string;
  priority?: boolean;
}) {
  return (
    <figure className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-xl bg-muted">
        <Image
          src={src}
          alt={alt}
          width={1600}
          height={900}
          sizes="(min-width: 1024px) 1600px, 100vw"
          className="h-auto w-full"
          priority={priority}
        />
      </div>
      {caption && (
        <figcaption className="max-w-xl text-sm font-light text-muted-foreground leading-[1.5]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) notFound();

  const currentIndex = PROJECTS.findIndex((p) => p.slug === project.slug);
  const next: Project = PROJECTS[(currentIndex + 1) % PROJECTS.length];

  const workLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    datePublished: project.year,
    description: project.tagline,
    url: `${SITE_URL}/work/${project.slug}`,
    image: project.media?.hero
      ? `${SITE_URL}${project.media.hero}`
      : undefined,
    author: { "@type": "Person", name: "Leonardo Posada" },
    keywords: project.services.join(", "),
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(workLd) }}
      />

      {/* ─── Sticky "All work" pill · appears after small scroll ───────── */}
      <BackToWorkPill />

      {/* ─── HERO · cascading entry (back link → name → tagline → meta
       *    row → hero image). Lives in a client component so framer-motion
       *    can drive the stagger. ─────────────────────────────────────── */}
      <DetailHero project={project} />

      {/* ─── 01 · Context ──────────────────────────────────────────────── */}
      <Reveal>
        <CaseSection number="01" label="Context">
          <LeadParagraph>{project.context}</LeadParagraph>
        </CaseSection>
      </Reveal>

      {/* ─── 02 · Challenge ────────────────────────────────────────────── */}
      <Reveal>
        <CaseSection
          number="02"
          label="Challenge"
          className="border-t border-border/70"
        >
          <LeadParagraph>{project.challenge}</LeadParagraph>
        </CaseSection>
      </Reveal>

      {/* ─── First detail image · breakout between sections ───────────── */}
      {project.media?.detail1 && (
        <Reveal>
          <Section className="pb-24 md:pb-32">
            <div className="col-span-2 md:col-span-4">
              <CaptionedImage
                src={project.media.detail1}
                alt={`${project.name} — ${project.media.captions?.detail1 ?? "detail"}`}
                caption={project.media.captions?.detail1}
              />
            </div>
          </Section>
        </Reveal>
      )}

      {/* ─── 03 · Approach ─────────────────────────────────────────────── */}
      <Reveal>
        <CaseSection
          number="03"
          label="Approach"
          className="border-t border-border/70"
        >
          <LeadParagraph>{project.approach}</LeadParagraph>
        </CaseSection>
      </Reveal>

      {/* ─── 04 · Outcome · summary + metrics ──────────────────────────── */}
      <Reveal>
        <Section className="border-t border-border/70 pt-20 pb-16 md:pt-28 md:pb-24">
          <SectionLabel number="04" label="Outcome" />
          <div className="col-span-2 mt-6 md:col-span-2 md:col-start-3 md:mt-0">
            <LeadParagraph>{project.outcome.summary}</LeadParagraph>
          </div>
        </Section>
      </Reveal>

      {project.outcome.metrics && project.outcome.metrics.length > 0 && (
        <Reveal>
          <Section className="pb-24 md:pb-32">
            <div className="col-span-2 grid grid-cols-2 gap-4 md:col-span-4 md:grid-cols-4 md:gap-8">
              {project.outcome.metrics.map((m) => (
                <div
                  key={m.label}
                  className="flex flex-col gap-3 border-t border-border/70 pt-6"
                >
                  <p className="font-light text-foreground text-5xl md:text-7xl leading-none tracking-[-0.04em] tabular-nums">
                    {m.value}
                  </p>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {m.label}
                  </p>
                </div>
              ))}
            </div>
          </Section>
        </Reveal>
      )}

      {/* ─── Second detail image ───────────────────────────────────────── */}
      {project.media?.detail2 && (
        <Reveal>
          <Section className="pb-24 md:pb-32">
            <div className="col-span-2 md:col-span-4">
              <CaptionedImage
                src={project.media.detail2}
                alt={`${project.name} — ${project.media.captions?.detail2 ?? "detail"}`}
                caption={project.media.captions?.detail2}
              />
            </div>
          </Section>
        </Reveal>
      )}

      {/* ─── 05 · Credits ──────────────────────────────────────────────── */}
      {(project.credits && project.credits.length > 0) ||
      project.cofounders ? (
        <Reveal>
        <CaseSection number="05" label="Credits" className="border-t border-border/70">
          <dl className="grid grid-cols-1 gap-y-6 md:gap-y-8">
            {/* Row 1 · primary credit (design/direction) */}
            {project.credits?.[0] && (
              <div className="grid grid-cols-2 items-baseline gap-4 border-b border-border/50 pb-4 md:gap-8">
                <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {project.credits[0].role}
                </dt>
                <dd className="text-base font-light text-foreground">
                  {project.credits[0].name}
                </dd>
              </div>
            )}

            {/* Row 2 · co-founders with avatar circles → LinkedIn */}
            {project.cofounders && project.cofounders.length > 0 && (
              <div className="grid grid-cols-2 items-center gap-4 border-b border-border/50 pb-4 md:gap-8">
                <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Co-founders
                </dt>
                <dd>
                  <AvatarCircles
                    items={project.cofounders.map((c) => ({
                      name: c.name,
                      href: c.linkedin,
                      src: c.avatar,
                    }))}
                  />
                </dd>
              </div>
            )}

            {/* Rows 3+ · remaining credits */}
            {project.credits?.slice(1).map((c) => (
              <div
                key={`${c.role}-${c.name}`}
                className="grid grid-cols-2 items-baseline gap-6 border-b border-border/50 pb-4"
              >
                <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {c.role}
                </dt>
                <dd className="text-base font-light text-foreground">
                  {c.name}
                </dd>
              </div>
            ))}
          </dl>
        </CaseSection>
        </Reveal>
      ) : null}

      {/* ─── NEXT PROJECT ──────────────────────────────────────────────── */}
      <Reveal>
        <Section className="border-t border-border/70 pt-20 pb-32 md:pt-28 md:pb-40">
          <div className="col-span-2 md:col-span-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Next project
            </p>
            <Link
              href={`/work/${next.slug}`}
              className="group mt-6 flex items-baseline gap-4 md:gap-6"
            >
              <h2 className="font-light text-foreground text-6xl md:text-9xl leading-[0.93] tracking-[-0.036em] transition-opacity group-hover:opacity-70">
                {next.name}
              </h2>
              <ArrowUpRight
                weight="light"
                className="size-6 shrink-0 text-foreground transition-transform duration-500 ease-out-expo group-hover:translate-x-1 group-hover:-translate-y-1 md:size-10"
              />
            </Link>
            <p className="mt-6 max-w-xl font-light text-muted-foreground text-base leading-[1.5]">
              {next.tagline}
            </p>
          </div>
        </Section>
      </Reveal>
    </article>
  );
}
