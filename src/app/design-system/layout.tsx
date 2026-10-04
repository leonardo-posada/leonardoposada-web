import type { Metadata } from "next";
import { Section } from "@/components/site/section";
import { DsNav } from "./ds-nav";

export const metadata: Metadata = {
  title: "Design System",
  description:
    "Living reference for the leonardoposada-web design system · tokens, components, and conventions.",
};

export default function DesignSystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Section className="pt-14 pb-6">
        <div className="col-span-2 md:col-span-4 flex flex-col gap-3">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Design System
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">
            Leonardo Posada · Portfolio DS
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground">
            Living reference. Every example on these pages is built with the same
            components and tokens it documents.
          </p>
        </div>
        <DsNav />
      </Section>
      <Section className="pb-24">{children}</Section>
    </>
  );
}
