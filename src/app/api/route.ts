import { apiJson } from "@/lib/api-response"
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
  version: "1",
  versioning:
    "URL path /api/v1/ is canonical. Unversioned /api/* is a stable alias of v1. Breaking changes will ship as /api/v2/ with Deprecation and Sunset headers on the retired version.",
  endpoints: [
    { method: "GET", path: "/api/v1/health", summary: "Service status and icon count" },
    { method: "GET", path: "/api/v1/libraries", summary: "Icon packs and licenses" },
    { method: "GET", path: "/api/v1/icons", summary: "Search icons" },
    {
      method: "GET",
      path: "/api/v1/icons/{library}/{name}",
      summary: "Exact icon lookup",
    },
    { method: "POST", path: "/api/v1/export", summary: "Export favicon zip" },
  ],
  aliases: "/api/health, /api/libraries, /api/icons, /api/export",
  errors_media_type: "application/problem+json",
  origin: SITE.url,
} as const

export function GET(request: Request) {
  return apiJson(request, INDEX, {
    headers: {
      Link: `</openapi.json>; rel="service-desc", </docs>; rel="service-doc", </docs/versioning>; rel="describedby"`,
      "Cache-Control": "public, max-age=60",
    },
  })
}
