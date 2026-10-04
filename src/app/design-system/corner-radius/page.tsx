import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Corner radius · Design System",
};

const RADII = [
  { token: "rounded-xs", value: "2px" },
  { token: "rounded-sm", value: "6px" },
  { token: "rounded-md", value: "8px", note: "Buttons, badges, inputs" },
  { token: "rounded-lg", value: "10px" },
  { token: "rounded-xl", value: "14px", note: "Cards" },
  { token: "rounded-2xl", value: "16px", note: "Dialogs" },
  { token: "rounded-3xl", value: "24px" },
  { token: "rounded-4xl", value: "32px" },
];

export default function CornerRadiusPage() {
  return (
    <div className="col-span-2 md:col-span-4">
      <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-6">
        Corner radius
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {RADII.map((r) => (
          <Card key={r.token} className="overflow-hidden">
            <div className="p-6 flex items-center justify-center bg-muted">
              <div
                className={`${r.token} h-16 w-16 bg-foreground`}
                aria-hidden
              />
            </div>
            <CardContent className="pt-4 pb-4">
              <CardTitle className="text-sm">{r.token}</CardTitle>
              <CardDescription className="mt-1 text-xs">
                {r.value}
              </CardDescription>
              {r.note && (
                <p className="mt-2 text-xs text-muted-foreground">{r.note}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
