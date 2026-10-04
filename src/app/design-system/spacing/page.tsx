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
  title: "Spacing · Design System",
};

/**
 * Tailwind spacing scale · 1 unit = 0.25rem = 4px.
 * Only the steps actually used across this site are documented here.
 * If you reach for a step not on this list, question whether you need it.
 */
const SCALE = [
  { token: "0", px: 0, note: "Reset" },
  { token: "0.5", px: 2 },
  { token: "1", px: 4, note: "Nav gap · badge icon gap" },
  { token: "1.5", px: 6 },
  { token: "2", px: 8, note: "Prominent gap · dialog actions gap" },
  { token: "3", px: 12, note: "Dialog actions margin top" },
  { token: "4", px: 16, note: "Mobile grid gap · container x-padding mobile" },
  { token: "6", px: 24, note: "Card padding · desktop nav gap · container x-padding md" },
  { token: "8", px: 32, note: "Desktop grid gap · footer md gap" },
  { token: "10", px: 40, note: "Section-to-section vertical margin" },
  { token: "14", px: 56, note: "Container x-padding lg" },
  { token: "16", px: 64, note: "Avatar · navbar height" },
  { token: "24", px: 96, note: "Footer top padding" },
  { token: "32", px: 128, note: "Footer bottom padding" },
];

const USAGE = [
  {
    where: "Container x-padding",
    recipe: "px-4 md:px-6 lg:px-14",
    note: "16 → 24 → 56 px across breakpoints (SITE_CONTAINER)",
  },
  {
    where: "Grid gap",
    recipe: "gap-4 md:gap-8",
    note: "16 → 32 px (SITE_GRID)",
  },
  {
    where: "Card padding",
    recipe: "p-6",
    note: "24px inside every Card",
  },
  {
    where: "Section vertical rhythm",
    recipe: "mt-10 between sections, pt-14 pb-6 for DS section header",
    note: "40px between logical blocks",
  },
  {
    where: "TextLink icon gap",
    recipe: "nav → gap-1 (4px) · prominent → gap-2 (8px)",
    note: "Symmetric for leading and trailing icons",
  },
];

export default function SpacingPage() {
  return (
    <>
      <div className="col-span-2 md:col-span-4">
        <Card>
          <CardHeader>
            <CardTitle>Base unit · 4px</CardTitle>
            <CardDescription>
              Every spacing utility is a multiple of 4px (Tailwind default
              scale, 1 unit = 0.25rem). Compose spacing with these steps · no
              arbitrary values like p-[13px].
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="col-span-2 md:col-span-4 mt-10">
        <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-6">
          Scale
        </h2>
        <Card>
          <CardContent className="pt-6 flex flex-col">
            {SCALE.map((step, i) => (
              <div key={step.token}>
                <div className="flex items-center gap-6 py-3">
                  <span className="w-16 shrink-0 text-sm">{step.token}</span>
                  <span className="w-16 shrink-0 text-sm text-muted-foreground">
                    {step.px}px
                  </span>
                  <div className="flex-1 flex items-center">
                    <div
                      className="h-4 bg-foreground"
                      style={{ width: `${step.px}px` }}
                      aria-hidden
                    />
                  </div>
                  <span className="w-80 shrink-0 text-xs text-muted-foreground text-right">
                    {step.note ?? "—"}
                  </span>
                </div>
                {i < SCALE.length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="col-span-2 md:col-span-4 mt-10">
        <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-6">
          Common recipes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {USAGE.map((u) => (
            <Card key={u.where}>
              <CardHeader>
                <CardTitle className="text-sm">{u.where}</CardTitle>
                <CardDescription>
                  <span className="block mt-2 rounded-md bg-muted px-3 py-2 text-xs">
                    {u.recipe}
                  </span>
                  <span className="block mt-2 text-xs text-muted-foreground">
                    {u.note}
                  </span>
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
