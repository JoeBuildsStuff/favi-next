import { NextResponse } from "next/server"

import { SITE, absoluteUrl } from "@/lib/site"

export const runtime = "nodejs"

const INDEX = {
  name: "favi HTTP API",
  description:
    "Public favi favicon API hosted on Vercel at getfavi.vercel.app. No authentication.",
  documentation: absoluteUrl("/docs"),
  openapi: absoluteUrl("/openapi.json"),
  errors: absoluteUrl("/docs/errors"),
  catalog: absoluteUrl("/.well-known/api-catalog"),
  endpoints: [
    { method: "GET", path: "/api/health", summary: "Service status and icon count" },
    { method: "GET", path: "/api/libraries", summary: "Icon packs and licenses" },
    { method: "GET", path: "/api/icons", summary: "Search icons" },
    { method: "GET", path: "/api/icons/{library}/{name}", summary: "Exact icon lookup" },
    { method: "POST", path: "/api/export", summary: "Export favicon zip" },
  ],
  errors_media_type: "application/problem+json",
  origin: SITE.url,
} as const

export function GET() {
  return NextResponse.json(INDEX, {
    headers: {
      Link: `</openapi.json>; rel="service-desc", </docs>; rel="service-doc"`,
      "Cache-Control": "public, max-age=60",
    },
  })
}
