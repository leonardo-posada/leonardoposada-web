import { SITE } from "@/lib/site";
import { TextLink } from "@/components/ui/text-link";
import { TextArrow } from "@/components/ui/text-arrow";
import { Section } from "./section";

export function Footer() {
  return (
    <footer className="mt-8">
      {/* Separator · respects the 4-col grid, not the viewport edges */}
      <Section as="div">
        <div className="col-span-2 border-t border-border/70 md:col-span-4" />
      </Section>
      {/* Content · tall footer: big gap above the text, huge gap below */}
      <Section as="div" className="pt-24 pb-32">
        {/* 5 items evenly distributed across the full 4-col grid width */}
        <div className="col-span-2 grid grid-cols-1 items-start gap-y-1 md:col-span-4 md:grid-cols-5 md:items-center md:gap-8">
          <span className="mb-9 text-lg font-light text-foreground md:mb-0 md:text-xl">
            © {new Date().getFullYear()}
          </span>
          <TextLink href={SITE.socials.linkedin} external>
            LinkedIn
          </TextLink>
          <TextLink href={SITE.socials.dribbble} external>
            Dribbble
          </TextLink>
          <TextLink href={SITE.socials.instagram} external>
            Instagram
          </TextLink>
          <TextLink
            href={`mailto:${SITE.email}`}
            external
            leadingIcon={<TextArrow />}
            className="pt-3 md:pt-0"
          >
            Let&apos;s talk
          </TextLink>
        </div>
      </Section>
    </footer>
  );
}
