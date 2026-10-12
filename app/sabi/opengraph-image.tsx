import { ImageResponse } from "next/og";

export const alt =
  "Sabi — the free AI tutor children reach by phone call, from Education for Equality";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#0f1512";
const YELLOW = "#ffc629";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: YELLOW,
          color: INK,
          padding: "64px 80px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {[360, 520, 680, 840].map((d) => (
          <div
            key={d}
            style={{
              position: "absolute",
              right: 180 - d / 2,
              top: 315 - d / 2,
              width: d,
              height: d,
              borderRadius: 9999,
              border: "3px solid rgba(15,21,18,0.18)",
            }}
          />
        ))}

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: INK,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <div style={{ width: 8, height: 16, borderRadius: 4, background: YELLOW }} />
            <div style={{ width: 8, height: 36, borderRadius: 4, background: YELLOW }} />
            <div style={{ width: 8, height: 22, borderRadius: 4, background: YELLOW }} />
          </div>
          <div style={{ display: "flex", fontSize: 56, fontWeight: 800, letterSpacing: -2 }}>sabi</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 104,
              fontWeight: 800,
              lineHeight: 0.95,
              letterSpacing: -4,
              maxWidth: 820,
            }}
          >
            The tutor who picks up the phone.
          </div>
          <div style={{ display: "flex", fontSize: 32, marginTop: 28, color: "#3a423d" }}>
            Free reading and maths lessons on any phone. No internet. No cost.
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 24, letterSpacing: 2, textTransform: "uppercase" }}>
          Education for Equality · /sah-bee/ — &ldquo;to know&rdquo;
        </div>
      </div>
    ),
    size,
  );
}
