import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Colors · Design System",
};

type Swatch = {
  token: string;
  twClass: string;
  light: string;
  dark: string;
  usage?: string;
};

const SURFACE: Swatch[] = [
  { token: "background", twClass: "bg-background", light: "#ffffff", dark: "#0a0a0a", usage: "Body" },
  { token: "foreground", twClass: "bg-foreground", light: "#282a30", dark: "#fafafa", usage: "Default text" },
  { token: "card", twClass: "bg-card", light: "#ffffff", dark: "#171717", usage: "Card surface" },
  { token: "muted", twClass: "bg-muted", light: "#f5f5f5", dark: "#262626", usage: "Subtle fills" },
  { token: "muted-foreground", twClass: "bg-muted-foreground", light: "#737373", dark: "#a3a3a3", usage: "Secondary text" },
  { token: "accent", twClass: "bg-accent", light: "#f5f5f5", dark: "#404040", usage: "Hover (ghost/outline)" },
  { token: "border", twClass: "bg-border", light: "#e5e5e5", dark: "white / 10%", usage: "Borders" },
  { token: "input", twClass: "bg-input", light: "#e5e5e5", dark: "white / 15%", usage: "Input borders" },
  { token: "ring", twClass: "bg-ring", light: "#737373", dark: "#a3a3a3", usage: "Focus ring" },
  { token: "surface", twClass: "bg-surface", light: "#fafafa", dark: "#0a0a0a", usage: "Elevated sections" },
];

const ACTION: Swatch[] = [
  { token: "primary", twClass: "bg-primary", light: "#0a0a0a", dark: "#fafafa", usage: "Default CTA" },
  { token: "primary-foreground", twClass: "bg-primary-foreground", light: "#ffffff", dark: "#0a0a0a", usage: "Text on primary" },
  { token: "secondary", twClass: "bg-secondary", light: "#f5f5f5", dark: "#262626", usage: "Secondary CTA" },
  { token: "popover", twClass: "bg-popover", light: "#ffffff", dark: "#262626", usage: "Popover / dropdown" },
];

const SEMANTIC: Swatch[] = [
  { token: "destructive", twClass: "bg-destructive", light: "#dc2626", dark: "#f87171", usage: "Errors / destructive actions" },
  { token: "success", twClass: "bg-success", light: "#15803d", dark: "#4ade80", usage: "Confirmations" },
  { token: "warning", twClass: "bg-warning", light: "#ca8a04", dark: "#facc15", usage: "Warnings" },
];

function SwatchCard({ swatch }: { swatch: Swatch }) {
  return (
    <Card className="overflow-hidden">
      <div
        className={`h-24 border-b border-border ${swatch.twClass}`}
        aria-hidden
      />
      <CardContent className="pt-4 pb-4">
        <CardTitle className="text-sm">{swatch.token}</CardTitle>
        <CardDescription className="mt-2 text-xs">
          <span className="block">light · {swatch.light}</span>
          <span className="block">dark · {swatch.dark}</span>
        </CardDescription>
        {swatch.usage && (
          <p className="mt-2 text-xs text-muted-foreground">{swatch.usage}</p>
        )}
      </CardContent>
    </Card>
  );
}

function Group({ title, swatches }: { title: string; swatches: Swatch[] }) {
  return (
    <div className="col-span-2 md:col-span-4">
      <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-6">
        {title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {swatches.map((s) => (
          <SwatchCard key={s.token} swatch={s} />
        ))}
      </div>
    </div>
  );
}

export default function ColorsPage() {
  return (
    <>
      <Group title="Surface & Text" swatches={SURFACE} />
      <div className="col-span-2 md:col-span-4 mt-10">
        <Group title="Action" swatches={ACTION} />
      </div>
      <div className="col-span-2 md:col-span-4 mt-10">
        <Group title="Semantic" swatches={SEMANTIC} />
      </div>
    </>
  );
}
