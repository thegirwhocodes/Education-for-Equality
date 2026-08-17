import { ImageResponse } from "next/og";

export const alt =
  "Sabi — the free AI tutor children reach by phone call, from Education for Equality";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
          background: "linear-gradient(135deg, #10261f 0%, #1c3d31 55%, #2b5a45 100%)",
          color: "#f6f1e4",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#e2c275",
          }}
        >
          Education for Equality
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 132, fontWeight: 700, lineHeight: 1 }}>
            Sabi
          </div>
          <div style={{ display: "flex", fontSize: 34, color: "#c9d8cf", marginTop: 18 }}>
            /sah-bee/ — &ldquo;to know&rdquo; in Nigerian Pidgin
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 44,
              lineHeight: 1.3,
              marginTop: 34,
              maxWidth: 940,
            }}
          >
            An AI tutor any child can reach by calling a phone number.
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 30, color: "#e2c275" }}>
          No smartphone. No internet. No cost.
        </div>
      </div>
    ),
    size,
  );
}
