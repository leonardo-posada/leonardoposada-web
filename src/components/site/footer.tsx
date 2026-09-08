import { SITE } from "@/lib/site";
import { Section } from "./section";

/**
 * Footer link style — mirrors the hero link recipe (text-lg md:text-xl,
 * font-light, muted → foreground on hover, 1px underline that grows from
 * the left with the site ease-out curve).
 */
const FOOTER_LINK =
  "group inline-flex w-fit items-baseline text-lg font-light text-muted-foreground transition-colors duration-300 hover:text-foreground md:text-xl";

const FOOTER_LINK_INNER =
  "relative after:pointer-events-none after:absolute after:bottom-[-2px] after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-[400ms] after:ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:after:scale-x-100";

export function Footer() {
  return (
    <footer className="mt-8">
      {/* Separator — respects the 4-col grid, not the viewport edges */}
      <Section as="div">
        <div className="col-span-1 border-t border-border/70 md:col-span-4" />
      </Section>
      {/* Content — tall footer: big gap above the text, huge gap below */}
      <Section
        as="div"
        className="pt-24 pb-32"
      >
        {/* 5 items evenly distributed across the full 4-col grid width */}
        <div className="col-span-1 grid grid-cols-2 items-center gap-y-6 md:col-span-4 md:grid-cols-5 md:gap-8">
          <span className="text-lg font-light text-foreground md:text-xl">
            © {new Date().getFullYear()}
          </span>
          <a
            href={SITE.socials.linkedin}
            target="_blank"
            rel="noreferrer"
            className={FOOTER_LINK}
          >
            <span className={FOOTER_LINK_INNER}>LinkedIn</span>
          </a>
          <a
            href={SITE.socials.dribbble}
            target="_blank"
            rel="noreferrer"
            className={FOOTER_LINK}
          >
            <span className={FOOTER_LINK_INNER}>Dribbble</span>
          </a>
          <a
            href={SITE.socials.instagram}
            target="_blank"
            rel="noreferrer"
            className={FOOTER_LINK}
          >
            <span className={FOOTER_LINK_INNER}>Instagram</span>
          </a>
          <a href={`mailto:${SITE.email}`} className={FOOTER_LINK}>
            <span aria-hidden className="mr-2">
              →
            </span>
            <span className={FOOTER_LINK_INNER}>Let&apos;s talk</span>
          </a>
        </div>
      </Section>
    </footer>
  );
}
