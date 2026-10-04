import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const FOUNDATIONS = [
  {
    href: "/design-system/colors",
    title: "Colors",
    description:
      "Neutral B/W palette with full dark-mode counterparts. Semantic tokens for destructive, success, warning.",
  },
  {
    href: "/design-system/typography",
    title: "Typography",
    description:
      "Geist Sans. Tailwind default scale · no custom sizes. Antialiased by default.",
  },
  {
    href: "/design-system/spacing",
    title: "Spacing",
    description:
      "4px base unit. Only the scale steps actually used across the site are documented.",
  },
  {
    href: "/design-system/iconography",
    title: "Iconography",
    description:
      "Phosphor Icons. Only two weights: light (default) and fill (active states). 4 sizes.",
  },
  {
    href: "/design-system/corner-radius",
    title: "Corner radius",
    description: "8 radius steps · from 2px to 32px.",
  },
  {
    href: "/design-system/shadows",
    title: "Shadows",
    description: "7 shadow steps. Inputs stay flat · no shadows.",
  },
  {
    href: "/design-system/layout",
    title: "Layout",
    description:
      "Canonical container & grid. One Section component drives every page.",
  },
];

const COMPONENTS = [
  {
    href: "/design-system/components",
    title: "Components",
    description:
      "Shadcn-style primitives built on top of the foundations: Button, Badge, Card, TextLink, Dialog, Separator, AspectRatio.",
  },
];

const PRINCIPLES = [
  {
    title: "Monochrome first",
    body: "The base palette is neutral. Color is accent, not structure.",
  },
  {
    title: "Dark mode is not optional",
    body: "Every token has a dark counterpart. Never hardcode hex · use tokens.",
  },
  {
    title: "One system, no exceptions",
    body: "If something is missing, extend the system · don't patch with loose values.",
  },
  {
    title: "Reduced motion respected",
    body: "Animations opt-out via prefers-reduced-motion. No bypassing.",
  },
];

export default function DesignSystemPage() {
  return (
    <>
      <div className="col-span-2 md:col-span-4">
        <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-6">
          Principles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PRINCIPLES.map((p) => (
            <Card key={p.title}>
              <CardHeader>
                <CardTitle>{p.title}</CardTitle>
                <CardDescription>{p.body}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      <div className="col-span-2 md:col-span-4 mt-10">
        <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-6">
          Foundations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FOUNDATIONS.map((s) => (
            <Link key={s.href} href={s.href} className="group">
              <Card className="h-full transition-colors hover:bg-accent">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{s.title}</CardTitle>
                    <ArrowRight
                      weight="light"
                      className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1"
                    />
                  </div>
                  <CardDescription>{s.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div className="col-span-2 md:col-span-4 mt-10">
        <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-6">
          Components
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {COMPONENTS.map((s) => (
            <Link key={s.href} href={s.href} className="group">
              <Card className="h-full transition-colors hover:bg-accent">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{s.title}</CardTitle>
                    <ArrowRight
                      weight="light"
                      className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1"
                    />
                  </div>
                  <CardDescription>{s.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
