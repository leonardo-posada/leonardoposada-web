import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Layout · Design System",
};

const BREAKPOINTS = [
  { token: "sm", value: "640px", note: "Tailwind default" },
  { token: "md", value: "768px", note: "Grid shifts 2 → 4 cols · gap 4 → 8" },
  { token: "lg", value: "1024px", note: "Container padding grows to 56px" },
  { token: "xl", value: "1280px", note: "Tailwind default" },
  { token: "2xl", value: "1536px", note: "Tailwind default" },
];

export default function LayoutPage() {
  return (
    <>
      <div className="col-span-2 md:col-span-4">
        <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-6">
          Container
        </h2>
        <Card>
          <CardHeader>
            <CardTitle>SITE_CONTAINER</CardTitle>
            <CardDescription>
              The canonical container. Everything on the site is wrapped by it
              via the Section component.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted rounded-md p-4 overflow-x-auto">
              {`mx-auto w-full max-w-[1800px] px-4 md:px-6 lg:px-14`}
            </pre>
            <ul className="mt-4 text-sm text-muted-foreground space-y-1">
              <li>· Max width 1800px, centered.</li>
              <li>· Horizontal padding: 16 → 24 → 56px across breakpoints.</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="col-span-2 md:col-span-4 mt-10">
        <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-6">
          Grid
        </h2>
        <Card>
          <CardHeader>
            <CardTitle>SITE_GRID</CardTitle>
            <CardDescription>
              Section renders its children inside this grid. Compose with
              col-span utilities.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted rounded-md p-4 overflow-x-auto">
              {`grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8`}
            </pre>
            <div className="mt-6">
              <p className="text-xs text-muted-foreground mb-3">
                Live preview · resize the window to see mobile vs desktop:
              </p>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-16 rounded-md border border-dashed border-border bg-muted flex items-center justify-center text-xs text-muted-foreground"
                  >
                    col {i + 1}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="col-span-2 md:col-span-4 mt-10">
        <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-6">
          Section component
        </h2>
        <Card>
          <CardHeader>
            <CardTitle>How to use</CardTitle>
            <CardDescription>
              Never re-implement the container or grid manually. Use Section
              from @/components/site/section.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted rounded-md p-4 overflow-x-auto">
              {`<Section>
  <div className="col-span-2 md:col-span-4">
    full-width content
  </div>
</Section>`}
            </pre>
          </CardContent>
        </Card>
      </div>

      <div className="col-span-2 md:col-span-4 mt-10">
        <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-6">
          Breakpoints
        </h2>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col divide-y divide-border">
              {BREAKPOINTS.map((b) => (
                <div
                  key={b.token}
                  className="flex items-baseline justify-between py-3 gap-4"
                >
                  <div>
                    <p className="text-sm">{b.token}</p>
                    <p className="text-xs text-muted-foreground">{b.note}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{b.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
