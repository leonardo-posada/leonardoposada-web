import type { Metadata } from "next";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Shadows · Design System",
};

const SHADOWS = [
  { token: "shadow-2xs", note: "Subtle lift" },
  { token: "shadow-xs", note: "Buttons" },
  { token: "shadow-sm" },
  { token: "shadow-md" },
  { token: "shadow-lg" },
  { token: "shadow-xl" },
  { token: "shadow-2xl" },
];

export default function ShadowsPage() {
  return (
    <>
      <div className="col-span-2 md:col-span-4">
        <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-6">
          Shadows
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {SHADOWS.map((s) => (
            <div key={s.token} className="flex flex-col gap-3">
              <div className="p-8 bg-surface rounded-xl">
                <div
                  className={`${s.token} h-20 w-full rounded-md bg-card border border-border`}
                  aria-hidden
                />
              </div>
              <div>
                <p className="text-sm">{s.token}</p>
                {s.note && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {s.note}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-2 md:col-span-4 mt-10">
        <Card>
          <CardHeader>
            <CardTitle>Rule · inputs stay flat</CardTitle>
            <CardDescription>
              Form inputs, selects and dropdown triggers never carry a drop
              shadow. Borders only.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </>
  );
}
