import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CardSystem } from "@/components/kontigo/compositions/card-system";
import { CardScreen } from "@/components/kontigo/compositions/card-screen";
import { CardScreenTilt } from "@/components/kontigo/compositions/card-screen-tilt";
import { Cards3D } from "@/components/kontigo/compositions/cards-3d";

/**
 * Preview route for Kontigo compositions. Each slug renders a dedicated
 * React component centered on a dark host so it can be captured to a
 * static WebP for the case-study grid.
 *
 * These pages are `noindex` so search engines don't surface the raw
 * compositions without their case-study context.
 */

/** Registry · one entry per capturable composition. */
const COMPOSITIONS = {
  "card-system": {
    label: "Card system · tier color guide",
    node: <CardSystem aspectRatio="4 / 3" />,
  },
  "card-screen": {
    label: "Card screen · A light · B dark · C tilt",
    node: (
      <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
        <CardScreen aspectRatio="4 / 3" theme="light" />
        <CardScreen aspectRatio="4 / 3" theme="dark" />
        <CardScreenTilt aspectRatio="4 / 3" theme="dark" />
      </div>
    ),
  },
  "card-screen-tilt": {
    label: "Card screen · tilt (dedicated for capture)",
    node: <CardScreenTilt aspectRatio="4 / 3" theme="dark" />,
  },
  "cards-3d": {
    label: "Cards · WebGL diagonal cascade",
    node: <Cards3D aspectRatio="5 / 4" canvasAspect="4 / 3" />,
  },
} as const;

type Params = { name: string };

export function generateStaticParams(): Params[] {
  return Object.keys(COMPOSITIONS).map((name) => ({ name }));
}

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function CompositionPreviewPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { name } = await params;
  const composition = COMPOSITIONS[name as keyof typeof COMPOSITIONS];
  if (!composition) notFound();

  return (
    <main
      style={{
        minHeight: "100dvh",
        background: "#0a0a0a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
      }}
    >
      <div style={{ width: "min(100%, 1600px)" }}>{composition.node}</div>
    </main>
  );
}
