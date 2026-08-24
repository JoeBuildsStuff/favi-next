import { SITE_NAME, SITE_ORIGIN } from "@/lib/site"

import type { ContentBlock, ContentLink } from "../types"

export const recoveryLinks: ContentLink[] = [
  {
    href: `${SITE_ORIGIN}/`,
    label: "favi homepage",
    note: "Visual favicon picker and server-rendered product overview",
  },
  {
    href: `${SITE_ORIGIN}/llms.txt`,
    label: "favi agent index (llms.txt)",
    note: "When to use favi, API map, and skill install",
  },
  {
    href: `${SITE_ORIGIN}/sitemap.xml`,
    label: "Sitemap",
    note: "Canonical public URLs",
  },
  {
    href: `${SITE_ORIGIN}/for-agents`,
    label: "favi developer resources",
    note: "HTTP API, OpenAPI, auth, and agent workflow",
  },
  {
    href: `${SITE_ORIGIN}/openapi.json`,
    label: "favi OpenAPI spec",
    note: "Machine-readable API description",
  },
  {
    href: `${SITE_ORIGIN}/.well-known/api-catalog`,
    label: "RFC 9727 API catalog",
    note: "Linkset of published favi APIs",
  },
  {
    href: `${SITE_ORIGIN}/skills/favi/SKILL.md`,
    label: "favi agent skill",
    note: "Step-by-step search and export workflow",
  },
  {
    href: `${SITE_ORIGIN}/docs/auth`,
    label: "favi authentication",
    note: "No API keys, OAuth, or login",
  },
  {
    href: `${SITE_ORIGIN}/docs/openapi`,
    label: "favi OpenAPI spec (docs)",
    note: "Human index for /openapi.json",
  },
  {
    href: `${SITE_ORIGIN}/docs/webhooks`,
    label: "favi webhooks",
    note: "Not offered; use the HTTP API",
  },
  {
    href: `${SITE_ORIGIN}/docs/mcp`,
    label: "favi MCP server",
    note: "Not offered; use the HTTP API",
  },
  {
    href: `${SITE_ORIGIN}/docs/vercel`,
    label: "favi Vercel developer resources",
    note: "Vercel-hosted origin, WAF limits, deploy notes",
  },
  {
    href: `${SITE_ORIGIN}/docs/errors`,
    label: "favi API errors",
    note: "RFC 9457 problem+json codes",
  },
  {
    href: `${SITE_ORIGIN}/docs/api`,
    label: "favi API docs",
    note: "HTTP API reference",
  },
  {
    href: `${SITE_ORIGIN}/docs/versioning`,
    label: "favi REST versioning",
    note: "/api/v1/ and deprecation policy",
  },
  {
    href: `${SITE_ORIGIN}/docs/rate-limits`,
    label: "favi rate limits",
    note: "RateLimit headers and 429 Retry-After",
  },
  {
    href: `${SITE_ORIGIN}/developers`,
    label: "favi developers",
    note: "Alias of favi developer resources",
  },
  {
    href: `${SITE_ORIGIN}/agents`,
    label: "favi agents",
    note: "Markdown-friendly agent onboarding and API workflow",
  },
  {
    href: `${SITE_ORIGIN}/getfavi`,
    label: "getfavi",
    note: "Canonical brand page for getfavi.vercel.app",
  },
  {
    href: `${SITE_ORIGIN}/vercel`,
    label: "Vercel developer resources",
    note: "getfavi API docs, OpenAPI spec, auth docs, webhooks, MCP server",
  },
  {
    href: `${SITE_ORIGIN}/about`,
    label: "About getfavi",
    note: "What the product is and who maintains it",
  },
  {
    href: `${SITE_ORIGIN}/contact`,
    label: "Contact getfavi",
    note: "GitHub issues for the public repository",
  },
  {
    href: `${SITE_ORIGIN}/privacy`,
    label: "Privacy",
    note: "How getfavi handles requests and data",
  },
]

export const notFoundBlocks: ContentBlock[] = [
  { type: "h", level: 1, text: "Page not found" },
  {
    type: "p",
    text: `This path does not exist on ${SITE_NAME} (${SITE_ORIGIN.replace("https://", "")}). The request returned HTTP 404 on purpose so agents do not treat missing URLs as a live app shell.`,
  },
  { type: "h", level: 2, text: "Where to look next" },
  { type: "ul", items: recoveryLinks },
]
