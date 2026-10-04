import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { PROJECTS } from "@/lib/site";
import { SITE_URL } from "@/lib/env";
import { Section } from "@/components/site/section";

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
          alt: `${project.name} — case study`,
        },
      ]
    : undefined;
  return {
    title: project.name,
    description: project.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: project.name,
      description: project.description,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: project.name,
      description: project.description,
      images,
    },
  };
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) notFound();

  const workLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    datePublished: project.year,
    description: project.description,
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
      {/* Header · back link + title · acts as the navbar's sticky trigger */}
      <Section id="hero" className="pt-16 pb-12 md:pt-24">
        <div className="col-span-2 md:col-span-4">
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft weight="light" className="size-4" />
            All work
          </Link>
          <h1 className="mt-12 font-light text-foreground text-6xl md:text-9xl leading-[0.93] tracking-[-0.036em]">
            {project.name}
          </h1>
        </div>
      </Section>

      {/* Meta grid · role + year + details */}
      <Section className="pb-16">
        <div className="col-span-2 flex flex-col gap-6 md:col-span-2 md:col-start-3">
          <p className="font-light text-foreground text-xl md:text-2xl leading-[1.4]">
            {project.role}. {project.description}
          </p>
          <div className="mt-6 grid grid-cols-2 gap-6 text-sm">
            <div className="flex flex-col gap-1">
              <p className="font-normal text-foreground">Year</p>
              <p className="font-light text-muted-foreground">{project.year}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-normal text-foreground">Details</p>
              <p className="font-light text-muted-foreground">
                {project.services.join(", ")}
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Media gallery · hero + detail1 + detail2 */}
      {project.media && (
        <Section className="pb-24">
          <div className="col-span-2 flex flex-col gap-6 md:col-span-4 md:gap-8">
            {project.media.hero && (
              <Image
                src={project.media.hero}
                alt={`${project.name} — hero`}
                width={1600}
                height={900}
                sizes="(min-width: 1024px) 1600px, 100vw"
                className="w-full h-auto rounded-xl"
                priority
              />
            )}
            {project.media.detail1 && (
              <Image
                src={project.media.detail1}
                alt={`${project.name} — detail 1`}
                width={1600}
                height={900}
                sizes="(min-width: 1024px) 1600px, 100vw"
                className="w-full h-auto rounded-xl"
              />
            )}
            {project.media.detail2 && (
              <Image
                src={project.media.detail2}
                alt={`${project.name} — detail 2`}
                width={1600}
                height={900}
                sizes="(min-width: 1024px) 1600px, 100vw"
                className="w-full h-auto rounded-xl"
              />
            )}
          </div>
        </Section>
      )}
    </article>
  );
}
