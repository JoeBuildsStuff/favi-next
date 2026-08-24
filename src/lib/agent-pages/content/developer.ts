import { SITE_ORIGIN } from "@/lib/site"

import { abs } from "../paths"
import type { ContentBlock } from "../types"

export const developerBlocks: ContentBlock[] = [
  { type: "h", level: 1, text: "getfavi (favi) developer resources" },
  {
    type: "p",
    text: "This page is the getfavi (favi) developer resources index for the public favicon HTTP API hosted on Vercel at getfavi.vercel.app. Use it when you need favi API docs, the OpenAPI spec, auth docs, webhooks, MCP server notes, or the agent skill. Search for “Vercel developer resources”, “getfavi developer resources”, or “favi OpenAPI spec”. No account is required.",
  },
  { type: "h", level: 2, text: "URL aliases" },
  {
    type: "p",
    text: "These paths are intentional aliases to the same developer resources, not accidental duplication. /for-agents is the canonical agent-oriented URL (markdown and content-negotiation friendly). /docs is the conventional human docs URL. /developers is a catalog and search synonym used in API catalogs. /agents is an extra agent onboarding alias with a slightly different page title (agent resources).",
  },
  { type: "h", level: 2, text: "When to use favi" },
  {
    type: "p",
    text: "Use favi when the job is to search a free icon library and export a favicon package (SVG, ICO, apple-touch, PWA / maskable). favi is the wrong fetch if you need an MCP server, OAuth, webhooks, a paid icon marketplace, or to automate the visual picker.",
  },
  { type: "h", level: 2, text: "Authentication" },
  {
    type: "p",
    text: "favi authentication: none. The public API does not require API keys, OAuth, cookies, or login. Do not send Authorization headers. Production rate-limits by client IP at the Vercel WAF; over the limit the API returns HTTP 429.",
  },
  { type: "h", level: 2, text: "OpenAPI and API catalog" },
  {
    type: "p",
    text: "The favi OpenAPI 3.1 document is at /openapi.json. The RFC 9727 api-catalog linkset is at /.well-known/api-catalog. The agent index is /llms.txt. The Cursor / skills.sh skill is /skills/favi/SKILL.md.",
  },
  {
    type: "ul",
    items: [
      {
        href: abs("/openapi.json"),
        label: "favi OpenAPI spec",
        note: "application/openapi+json",
      },
      {
        href: abs("/.well-known/api-catalog"),
        label: "favi API catalog",
        note: "RFC 9727 application/linkset+json",
      },
      {
        href: abs("/llms.txt"),
        label: "favi llms.txt",
        note: "Agent index and when-to-use",
      },
      {
        href: abs("/skills/favi/SKILL.md"),
        label: "favi SKILL.md",
        note: "Install with npx skills add JoeBuildsStuff/favi-next",
      },
      {
        href: abs("/sitemap.xml"),
        label: "favi sitemap",
      },
      {
        href: abs("/docs/vercel"),
        label: "favi Vercel developer resources",
        note: "Name-based index for Vercel-hosted favi API docs",
      },
      {
        href: abs("/docs/auth"),
        label: "favi authentication",
      },
      {
        href: abs("/docs/webhooks"),
        label: "favi webhooks",
      },
      {
        href: abs("/docs/mcp"),
        label: "favi MCP server",
      },
      {
        href: abs("/docs/openapi"),
        label: "favi OpenAPI spec docs",
      },
      {
        href: abs("/docs/errors"),
        label: "favi API errors",
      },
      {
        href: abs("/docs/api"),
        label: "favi API docs",
      },
      {
        href: abs("/docs/versioning"),
        label: "favi REST versioning",
      },
      {
        href: abs("/docs/rate-limits"),
        label: "favi rate limits",
      },
      {
        href: abs("/agents"),
        label: "favi agents",
        note: "Markdown-friendly agent onboarding",
      },
      {
        href: abs("/developers"),
        label: "favi developers",
      },
      {
        href: abs("/getfavi"),
        label: "getfavi",
      },
    ],
  },
  { type: "h", level: 2, text: "HTTP API" },
  { type: "h", level: 3, text: "Health" },
  { type: "p", text: "GET /api/v1/health (alias GET /api/health) → { status, icons } with the indexed icon count." },
  { type: "pre", text: `curl -sS ${SITE_ORIGIN}/api/v1/health` },
  { type: "h", level: 3, text: "Libraries" },
  {
    type: "p",
    text: "GET /api/v1/libraries lists packs (lucide, tabler, phosphor, hugeicons, remix), licenses, styles, and counts.",
  },
  { type: "pre", text: `curl -sS ${SITE_ORIGIN}/api/v1/libraries` },
  { type: "h", level: 3, text: "Search icons" },
  {
    type: "p",
    text: "GET /api/v1/icons?q=&library=&style=&limit=&offset=. q expands curated synonyms. Each hit includes library, name, style, and svg.",
  },
  {
    type: "pre",
    text: `curl -sS "${SITE_ORIGIN}/api/v1/icons?q=image&library=lucide&style=outline&limit=12"`,
  },
  { type: "h", level: 3, text: "Exact icon" },
  { type: "p", text: "GET /api/v1/icons/:library/:name?style= returns one icon or 404." },
  {
    type: "pre",
    text: `curl -sS "${SITE_ORIGIN}/api/v1/icons/lucide/image?style=outline"`,
  },
  { type: "h", level: 3, text: "Export favicon zip" },
  {
    type: "p",
    text: "POST /api/v1/export with JSON {library,name,style} or {text} plus optional bg, bg_mode, bg_to, bg_angle, fill, stroke, padding, stroke_scale, shape, include_dark_mode, dark_*, site_name. Response is application/zip.",
  },
  {
    type: "pre",
    text: `curl -sS -X POST ${SITE_ORIGIN}/api/v1/export \\\n  -H 'Content-Type: application/json' \\\n  -d '{"library":"lucide","name":"image","style":"outline","bg":"#075985","stroke":"#ffffff"}' \\\n  -o favicon.zip`,
  },
  { type: "h", level: 2, text: "Rate limits" },
  {
    type: "p",
    text: "Production only. POST /api/v1/export: 20 / 60s / IP. GET /api/v1/icons: 120 / 60s / IP. GET /api/v1/health and /api/v1/libraries: 40 / 60s / IP. Responses include RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset, RateLimit, RateLimit-Policy, and Retry-After on 429. See /docs/rate-limits.",
  },
  { type: "h", level: 2, text: "Webhooks and MCP" },
  {
    type: "p",
    text: "favi does not publish webhooks and does not run an MCP server. Dedicated pages: /docs/webhooks and /docs/mcp. Agents should call the HTTP API and read this page, /llms.txt, /openapi.json, and /skills/favi/SKILL.md.",
  },
]
