import { ImageResponse } from "next/og"

export const alt = "getfavi (favi) — favicon picker and HTTP API"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#0c4a6e",
          color: "#f8fafc",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 4, opacity: 0.85 }}>GETFAVI</div>
        <div style={{ fontSize: 72, fontWeight: 700, marginTop: 16 }}>getfavi</div>
        <div style={{ fontSize: 36, marginTop: 12, opacity: 0.92 }}>
          favicon picker and HTTP API
        </div>
        <div style={{ fontSize: 24, marginTop: 28, opacity: 0.8 }}>
          getfavi.vercel.app
        </div>
      </div>
    ),
    { ...size }
  )
}
