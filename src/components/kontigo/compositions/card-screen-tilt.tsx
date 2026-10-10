import Image from "next/image";

/**
 * Tilted + depth-of-field variant of the card screen composition.
 * Same source image as `CardScreen`, but presented like the editorial
 * reference: 3D perspective, with the center sharp and the corners
 * dissolving into a soft gaussian blur.
 *
 * Technique:
 *   1. A perspective wrapper rotates the phone in 3D space.
 *   2. Two stacked copies of the same image:
 *      - Bottom layer: heavy blur, full image (becomes the out-of-focus halo).
 *      - Top layer: sharp image masked with a radial gradient so only the
 *        focal zone shows through, blending seamlessly into the blur.
 */
const SOURCES = {
  light: "/work/kontigo/_src/card-screen-raw.png",
  dark: "/work/kontigo/_src/card-screen-raw-dark.png",
} as const;

export function CardScreenTilt({
  aspectRatio = "4 / 3",
  theme = "dark",
}: {
  aspectRatio?: string;
  theme?: "light" | "dark";
}) {
  const src = SOURCES[theme];

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
        isolation: "isolate",
      }}
    >
      {/* Perspective stage — two phones side by side, same tilt, same
          size, on the same virtual table surface. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          perspective: "1400px",
          perspectiveOrigin: "50% 50%",
        }}
      >
        {/* Secondary phone — 20% smaller than hero, pushed into the
            top-left corner so a clear diagonal gap separates them. */}
        <div
          style={{
            position: "absolute",
            top: "19%",
            left: "11%",
            transform:
              "translate(-50%, -50%) rotateX(40deg) rotateY(-18deg) rotateZ(28deg)",
            transformStyle: "preserve-3d",
            transformOrigin: "50% 50%",
            height: "208%",
            aspectRatio: "390 / 844",
            borderRadius: "clamp(18px, 2.8cqw, 44px)",
            overflow: "hidden",
            boxShadow:
              "0 clamp(30px, 4cqw, 70px) clamp(60px, 8cqw, 140px) -clamp(10px, 1.5cqw, 25px) rgba(0, 0, 0, 0.7)",
          }}
        >
          <Image
            src={src}
            alt=""
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            style={{ objectFit: "cover", objectPosition: "top center" }}
            quality={100}
            unoptimized
          />
        </div>

        {/* Hero phone — right side, zoomed in, dominant. */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "72%",
            transform:
              "translate(-50%, -50%) rotateX(40deg) rotateY(-18deg) rotateZ(28deg)",
            transformStyle: "preserve-3d",
            transformOrigin: "50% 50%",
            height: "260%",
            aspectRatio: "390 / 844",
            borderRadius: "clamp(18px, 2.8cqw, 44px)",
            overflow: "hidden",
            boxShadow:
              "0 clamp(30px, 4cqw, 70px) clamp(60px, 8cqw, 140px) -clamp(10px, 1.5cqw, 25px) rgba(0, 0, 0, 0.75)",
          }}
        >
          <Image
            src={src}
            alt={`Kontigo app · tilted editorial view (${theme})`}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            style={{ objectFit: "cover", objectPosition: "top center" }}
            quality={100}
            unoptimized
            priority
          />
        </div>
      </div>

      {/* Screen-space depth-of-field overlays. Two bands sit on top of
          the 3D stage and apply `backdrop-filter: blur()` to whatever
          they cover. Because they live outside the perspective wrapper,
          the blur stays horizontal in screen space — mimicking a
          camera's focal plane: a sharp horizontal band in the middle,
          with the top (far) and bottom (near) edges blurred. */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backdropFilter: "blur(7px)",
          WebkitBackdropFilter: "blur(7px)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, transparent 28%, transparent 72%, black 100%)",
          maskImage:
            "linear-gradient(to bottom, black 0%, transparent 28%, transparent 72%, black 100%)",
        }}
      />
    </div>
  );
}
