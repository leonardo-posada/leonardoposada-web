/**
 * Editorial color/finish guide for the four Kontigo cards.
 * Rendered on a dedicated preview route and later captured to a static
 * WebP that lives in the Kontigo case-study grid.
 *
 * Composition mirrors the "Urbanist" reference: meta header, a quartet
 * of finish swatches with the Kontigo wordmark floating on each, a
 * footer palette line, and a translucent frosted-glass bar that cuts
 * horizontally across the swatches so the colors bleed through the blur.
 */

/** Contrast ratios computed against the host bg (#171717).
 *  Order matches KontigoClub tiers: bronze → silver → gold → diamond. */
const FINISHES = [
  {
    label: "Bronze",
    tier: "Bronze tier",
    hex: "#F46D06",
    rgb: [244, 109, 6],
    contrast: "5.96 : 1",
    body: "linear-gradient(145deg, #ff9340 0%, #ea5a0a 55%, #7b2a08 100%)",
    text: "#1a0a04",
    textMuted: "rgba(26,10,4,0.6)",
  },
  {
    label: "Silver",
    tier: "Silver tier",
    hex: "#C8CDD2",
    rgb: [200, 205, 210],
    contrast: "11.04 : 1",
    body: "linear-gradient(145deg, #e4e8ec 0%, #b0b6bc 55%, #868c93 100%)",
    text: "#232323",
    textMuted: "rgba(35,35,35,0.6)",
  },
  {
    label: "Gold",
    tier: "Gold tier",
    hex: "#D4A444",
    rgb: [212, 164, 68],
    contrast: "7.77 : 1",
    body: "linear-gradient(145deg, #eecb75 0%, #c99a3a 55%, #7f5e18 100%)",
    text: "#1a1206",
    textMuted: "rgba(26,18,6,0.6)",
  },
  {
    label: "Diamond",
    tier: "Diamond tier",
    hex: "#111111",
    rgb: [17, 17, 17],
    contrast: "1.04 : 1",
    body: "linear-gradient(145deg, #2a2a2a 0%, #0f0f0f 55%, #000000 100%)",
    text: "#f3f3f3",
    textMuted: "rgba(243,243,243,0.55)",
  },
] as const;

export function CardSystem({
  aspectRatio = "16 / 9",
}: {
  /** CSS aspect-ratio string, e.g. "16 / 9", "4 / 3", "1 / 1". */
  aspectRatio?: string;
}) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio,
        background: "#171717",
        color: "#fafafa",
        fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
        padding: "clamp(28px, 4cqw, 56px)",
        display: "flex",
        flexDirection: "column",
        containerType: "size",
        overflow: "hidden",
        borderRadius: "var(--radius-xl, 14px)",
        isolation: "isolate",
      }}
    >
      {/* Swatches · 4 vertical finish cards. No header above so the grid
          starts flush with the top padding and fills all remaining space. */}
      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "clamp(10px, 1.4cqw, 20px)",
          position: "relative",
          zIndex: 0,
        }}
      >
        {FINISHES.map((f) => (
          <div
            key={f.label}
            style={{
              position: "relative",
              background: f.body,
              borderRadius: "clamp(8px, 1.1cqw, 14px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "clamp(14px, 1.8cqw, 22px)",
              color: f.text,
              overflow: "hidden",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.12), 0 20px 40px -24px rgba(0,0,0,0.5)",
            }}
          >
            {/* Top row · tier label + logomark. */}
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                gap: "clamp(8px, 1cqw, 14px)",
                fontSize: "clamp(9px, 1.05cqw, 12px)",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                fontWeight: 600,
                color: f.text,
              }}
            >
              <span>{f.tier}</span>
              <span
                aria-label="Kontigo"
                style={{
                  display: "block",
                  height: "clamp(14px, 1.7cqw, 20px)",
                  width: "clamp(13px, 1.55cqw, 18px)",
                  backgroundColor: f.text,
                  WebkitMaskImage: "url(/work/kontigo/logomark.svg)",
                  maskImage: "url(/work/kontigo/logomark.svg)",
                  WebkitMaskSize: "contain",
                  maskSize: "contain",
                  WebkitMaskPosition: "center",
                  maskPosition: "center",
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                  opacity: 0.75,
                }}
              />
            </div>

            {/* Bottom block · RGB tryptic + hex code + contrast ratio.
                All technical values grouped together under the blur. */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "clamp(50px, 7cqw, 100px)",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  rowGap: "clamp(2px, 0.3cqw, 4px)",
                  textAlign: "center",
                  fontSize: "clamp(9px, 1.05cqw, 12px)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {["R", "G", "B"].map((ch) => (
                  <span
                    key={`${f.label}-ch-${ch}`}
                    style={{
                      color: f.textMuted,
                      letterSpacing: "0.14em",
                    }}
                  >
                    {ch}
                  </span>
                ))}
                {f.rgb.map((v, i) => (
                  <span
                    key={`${f.label}-v-${i}`}
                    style={{ color: f.text, letterSpacing: "0.08em" }}
                  >
                    {v}
                  </span>
                ))}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  gap: "clamp(8px, 1cqw, 14px)",
                  fontSize: "clamp(9px, 1.05cqw, 12px)",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  fontVariantNumeric: "tabular-nums",
                  color: f.textMuted,
                  fontWeight: 500,
                }}
              >
                <span>Hex #{f.hex.replace("#", "")}</span>
                <span>{f.contrast}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer · palette stripes aligned under each swatch column */}
      <footer
        style={{
          marginTop: "clamp(16px, 2.4cqw, 32px)",
          display: "flex",
          flexDirection: "column",
          gap: "clamp(6px, 0.8cqw, 10px)",
        }}
      >
        <span
          style={{
            fontSize: "clamp(9px, 1.1cqw, 12px)",
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: "rgba(250,250,250,0.5)",
            fontWeight: 400,
          }}
        >
          Palette
        </span>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "clamp(10px, 1.4cqw, 20px)",
          }}
        >
          {FINISHES.map((f) => (
            <span
              key={f.hex}
              style={{
                height: "clamp(4px, 0.5cqw, 6px)",
                background: f.hex,
                borderRadius: 999,
              }}
            />
          ))}
        </div>
      </footer>

      {/* Frosted-glass bar — overlays the swatches at the middle band
          so the colors bleed softly through the blur. */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "22%",
          height: "36%",
          backdropFilter: "blur(56px) saturate(1.1)",
          WebkitBackdropFilter: "blur(56px) saturate(1.1)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.04) 100%)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.3)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Centerpiece headline — floats over the frosted bar, picks up the
          "Urbanist" moodboard move where the typeface name is the hero. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "22%",
          height: "36%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 clamp(28px, 4cqw, 56px)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      >
        <span
          style={{
            fontSize: "clamp(40px, 8cqw, 112px)",
            lineHeight: 1,
            letterSpacing: "-0.045em",
            fontWeight: 300,
            color: "#fafafa",
            whiteSpace: "nowrap",
          }}
        >
          Card System
        </span>
      </div>
    </div>
  );
}
