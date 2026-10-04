import type { Metadata } from "next";
import {
  ArrowRight,
  ArrowUpRight,
  ArrowUp,
  Check,
  Plus,
  Star,
  Circle,
  Heart,
  CircleHalfTilt,
  Angle,
  List,
  X,
} from "@phosphor-icons/react/dist/ssr";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TextLink } from "@/components/ui/text-link";
import { TextArrow } from "@/components/ui/text-arrow";

export const metadata: Metadata = {
  title: "Iconography · Design System",
};

const WEIGHTS = [
  {
    weight: "light" as const,
    label: "light",
    usage: "Default. Every icon on the site. Stroke-only · 1px line weight.",
  },
  {
    weight: "fill" as const,
    label: "fill",
    usage: "Active / selected states. Only when you need visual emphasis.",
  },
];

const WEIGHT_SAMPLE = [Heart, Star, Check, Circle];

const SIZES = [
  { cls: "size-3", px: 12, usage: "Badge icons" },
  { cls: "size-4", px: 16, usage: "Default · nav, button, inline" },
  { cls: "size-5", px: 20, usage: "Dialog close, utility toggles" },
  { cls: "size-6", px: 24, usage: "Prominent / standalone icons" },
];

const USED = [
  { Icon: ArrowRight, name: "ArrowRight", where: "Overview section cards" },
  { Icon: ArrowUpRight, name: "ArrowUpRight", where: "External links (Resume)" },
  { Icon: ArrowUp, name: "ArrowUp", where: "Back to top button" },
  { Icon: List, name: "List", where: "Mobile menu open" },
  { Icon: X, name: "X", where: "Mobile menu close · dialog close" },
  { Icon: CircleHalfTilt, name: "CircleHalfTilt", where: "Theme toggle (light / dark)" },
  { Icon: Angle, name: "Angle", where: "Grid overlay toggle" },
];

export default function IconographyPage() {
  return (
    <>
      {/* Library */}
      <div className="col-span-2 md:col-span-4">
        <Card>
          <CardHeader>
            <CardTitle>Phosphor Icons</CardTitle>
            <CardDescription>
              Flexible icon family for the web. We import from{" "}
              <code>@phosphor-icons/react/dist/ssr</code> so icons render on
              the server with zero client JS.{" "}
              <TextLink
                variant="nav"
                href="https://github.com/phosphor-icons/homepage"
                external
                trailingIcon={
                  <ArrowUpRight weight="light" className="size-4" />
                }
                className="mt-2"
              >
                phosphoricons.com
              </TextLink>
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Weights · LIGHT + FILL only */}
      <div className="col-span-2 md:col-span-4 mt-10">
        <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-6">
          Weights · only two
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {WEIGHTS.map((w) => (
            <Card key={w.weight}>
              <CardHeader>
                <CardTitle className="text-sm">{w.label}</CardTitle>
                <CardDescription className="text-xs">
                  {w.usage}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md bg-muted p-6 flex items-center gap-6">
                  {WEIGHT_SAMPLE.map((Icon, i) => (
                    <Icon
                      key={i}
                      weight={w.weight}
                      className="size-6 text-foreground"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div className="col-span-2 md:col-span-4 mt-10">
        <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-6">
          Sizes
        </h2>
        <Card>
          <CardContent className="pt-6 flex flex-col gap-4">
            {SIZES.map((s) => (
              <div
                key={s.cls}
                className="flex items-center gap-6 border-b border-border last:border-0 pb-4 last:pb-0"
              >
                <div className="w-20 shrink-0 flex items-center">
                  <ArrowUpRight weight="light" className={s.cls} />
                </div>
                <span className="w-20 shrink-0 text-sm">{s.cls}</span>
                <span className="w-20 shrink-0 text-sm text-muted-foreground">
                  {s.px}px
                </span>
                <span className="flex-1 text-xs text-muted-foreground">
                  {s.usage}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Custom · TextArrow */}
      <div className="col-span-2 md:col-span-4 mt-10">
        <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-6">
          Custom · TextArrow
        </h2>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">TextArrow</CardTitle>
            <CardDescription className="text-xs">
              The one hand-built SVG in the system. Matches the native{" "}
              <code>→</code> glyph so it looks identical across Mac, Windows,
              iOS and Android. Lives inline with text, scales to the current
              font size (<code>size-[1em]</code>) and inherits color via{" "}
              <code>currentColor</code>.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="rounded-md bg-muted p-6 flex items-center gap-6 text-foreground">
              <span className="text-base inline-flex items-baseline">
                <TextArrow /> <span className="ml-2">text-base</span>
              </span>
              <span className="text-lg inline-flex items-baseline">
                <TextArrow /> <span className="ml-2">text-lg</span>
              </span>
              <span className="text-xl inline-flex items-baseline">
                <TextArrow /> <span className="ml-2">text-xl</span>
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* In use */}
      <div className="col-span-2 md:col-span-4 mt-10">
        <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-6">
          In use across the site
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {USED.map(({ Icon, name, where }) => (
            <Card key={name}>
              <CardContent className="pt-6 flex flex-col items-start gap-3">
                <Icon weight="light" className="size-6" />
                <div>
                  <p className="text-sm">{name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {where}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Rules */}
      <div className="col-span-2 md:col-span-4 mt-10">
        <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-6">
          Rules
        </h2>
        <Card>
          <CardContent className="pt-6">
            <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
              <li>
                · Only <code>weight=&quot;light&quot;</code> or{" "}
                <code>weight=&quot;fill&quot;</code>. Never thin / regular /
                bold / duotone.
              </li>
              <li>
                · Default to <code>light</code>. Use <code>fill</code> for
                active or selected states only.
              </li>
              <li>
                · Import from{" "}
                <code>@phosphor-icons/react/dist/ssr</code>, never the client
                entrypoint.
              </li>
              <li>
                · Size via Tailwind <code>size-*</code> utilities, not inline
                width/height.
              </li>
              <li>
                · Decorative icons get <code>aria-hidden</code>; standalone
                icon buttons get <code>aria-label</code>.
              </li>
              <li>
                · No emojis as icons · they clash with Phosphor&apos;s stroke
                style.
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
