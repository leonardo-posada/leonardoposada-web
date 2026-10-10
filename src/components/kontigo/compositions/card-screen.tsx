import Image from "next/image";

/**
 * Mobile screen composition for the Kontigo case study — frames a real
 * screenshot of the activated KontigoCard tab (first slide of the card
 * carousel) centered on a dark host so the app vocabulary reads as a
 * presentation surface, not a raw screenshot.
 *
 * Source images (390×844 CSS captured at DPR 3 = 1170×2532 real pixels):
 *   theme="light" → `/public/work/kontigo/_src/card-screen-raw.png`
 *   theme="dark"  → `/public/work/kontigo/_src/card-screen-raw-dark.png`
 */
const SOURCES = {
  light: "/work/kontigo/_src/card-screen-raw.png",
  dark: "/work/kontigo/_src/card-screen-raw-dark.png",
} as const;

export function CardScreen({
  aspectRatio = "4 / 3",
  theme = "light",
}: {
  aspectRatio?: string;
  theme?: "light" | "dark";
}) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio,
        background: "#171717",
        containerType: "size",
        overflow: "hidden",
        borderRadius: "var(--radius-xl, 14px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        isolation: "isolate",
      }}
    >
      {/* Phone screen — fills ~95% of the container height. Identical
          dimensions in both themes so the stack reads as a true pair. */}
      <div
        style={{
          position: "relative",
          height: "95%",
          aspectRatio: "390 / 844",
          borderRadius: "clamp(14px, 2.4cqw, 36px)",
          overflow: "hidden",
          boxShadow:
            "0 clamp(20px, 3cqw, 50px) clamp(40px, 6cqw, 100px) -clamp(10px, 1.5cqw, 25px) rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.04)",
        }}
      >
        <Image
          src={SOURCES[theme]}
          alt={`Kontigo app · activated card view (${theme})`}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          style={{ objectFit: "cover", objectPosition: "top center" }}
          quality={100}
          unoptimized
          priority
        />
      </div>
    </div>
  );
}
