import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Typography · Design System",
};

const SCALE = [
  { cls: "text-xs", size: "12px / 16px", label: "Caption, metadata" },
  { cls: "text-sm", size: "14px / 20px", label: "Body small, UI text" },
  { cls: "text-base", size: "16px / 24px", label: "Body default" },
  { cls: "text-lg", size: "18px / 28px", label: "Lead paragraph" },
  { cls: "text-xl", size: "20px / 28px", label: "H5" },
  { cls: "text-2xl", size: "24px / 32px", label: "H4" },
  { cls: "text-3xl", size: "30px / 36px", label: "H3" },
  { cls: "text-4xl", size: "36px / 40px", label: "H2" },
  { cls: "text-5xl", size: "48px / 1", label: "H1 · section hero" },
  { cls: "text-6xl", size: "60px / 1", label: "Display small" },
  { cls: "text-7xl", size: "72px / 1", label: "Display" },
];

const WEIGHTS = [
  { cls: "font-light", label: "Light 300 · hero + footer links, mobile menu rows" },
  { cls: "font-normal", label: "Normal 400 · nav links, body" },
  { cls: "font-medium", label: "Medium 500 · buttons, badges, active nav" },
  { cls: "font-semibold", label: "Semibold 600 · headings" },
  { cls: "font-bold", label: "Bold 700 · site title (navbar logo)" },
];

export default function TypographyPage() {
  return (
    <>
      <div className="col-span-2 md:col-span-4">
        <Card>
          <CardHeader>
            <CardTitle>Font</CardTitle>
            <CardDescription>
              Geist Sans · loaded via next/font/google, exposed as the Tailwind
              font-sans utility. Only one typeface across the site.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold tracking-tight">
              The quick brown fox jumps over the lazy dog
            </p>
            <p className="text-sm text-muted-foreground mt-3">
              Antialiased by default via -webkit-font-smoothing: antialiased and
              -moz-osx-font-smoothing: grayscale on the body.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="col-span-2 md:col-span-4 mt-10">
        <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-6">
          Scale
        </h2>
        <Card>
          <CardContent className="pt-6 flex flex-col gap-6">
            {SCALE.map((item, i) => (
              <div key={item.cls}>
                <div className="flex items-baseline justify-between gap-4">
                  <p className={`${item.cls} tracking-tight`}>
                    The quick brown fox
                  </p>
                  <div className="shrink-0 text-right">
                    <p className="text-sm text-foreground">{item.cls}</p>
                    <p className="text-xs text-muted-foreground">{item.size}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {item.label}
                </p>
                {i < SCALE.length - 1 && <Separator className="mt-6" />}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="col-span-2 md:col-span-4 mt-10">
        <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-6">
          Weights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {WEIGHTS.map((w) => (
            <Card key={w.cls}>
              <CardContent className="pt-6">
                <p className={`text-2xl ${w.cls}`}>Aa · Portfolio</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {w.cls} · {w.label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
