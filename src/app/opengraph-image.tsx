import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const alt = SITE.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0a0a0a",
          color: "#ffffff",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 28, opacity: 0.7 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              background: "rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 300,
            }}
          >
            L
          </div>
          leonardoposada.com
        </div>
        <div>
          <div style={{ fontSize: 40, opacity: 0.6, marginBottom: 12, fontWeight: 300 }}>
            {SITE.name}
          </div>
          <div style={{ fontSize: 88, fontWeight: 300, lineHeight: 1.05, letterSpacing: "-0.03em" }}>
            Product Design
            <br />
            & Creative Direction.
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
