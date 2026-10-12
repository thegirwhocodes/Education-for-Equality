import { ImageResponse } from "next/og";

export const alt =
  "Education for Equality — the nonprofit building Sabi, an AI tutor children reach by phone call";
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
          <div style={{ display: "flex", fontSize: 66, fontWeight: 700, lineHeight: 1.15, maxWidth: 980 }}>
            Quality education for every child, over any phone.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 38,
              lineHeight: 1.35,
              marginTop: 30,
              maxWidth: 960,
              color: "#c9d8cf",
            }}
          >
            We build Sabi — an AI tutor a child reaches by calling an ordinary phone number.
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 30, color: "#e2c275" }}>
          eduforequality.org
        </div>
      </div>
    ),
    size,
  );
}
