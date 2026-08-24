import { abs } from "../paths"
import type { ContentBlock } from "../types"

export const authBlocks: ContentBlock[] = [
  { type: "h", level: 1, text: "favi authentication (auth docs)" },
  {
    type: "p",
    text: "favi authentication docs for the public favicon HTTP API at getfavi.vercel.app. The API is open: no API keys, OAuth, cookies, sessions, or login. Do not send an Authorization header.",
  },
  { type: "h", level: 2, text: "What to send" },
  {
    type: "p",
    text: "Send JSON to POST /api/export with Content-Type: application/json. GET endpoints take query parameters only. Production rate-limits by client IP at the Vercel WAF; over the limit you receive HTTP 429 (prefer RFC 9457 problem+json when the app handles the error; wait and retry).",
  },
]

export const webhooksBlocks: ContentBlock[] = [
  { type: "h", level: 1, text: "favi webhooks" },
  {
    type: "p",
    text: "favi webhooks are not part of this product. There is no webhook signing secret, no event catalog, and no callback URL to register. Polling is also unnecessary: search once, then POST /api/export once.",
  },
  { type: "h", level: 2, text: "What to use instead" },
  {
    type: "p",
    text: "Call the favi HTTP API. See favi developer resources at /docs, the OpenAPI spec at /openapi.json, and the agent skill at /skills/favi/SKILL.md.",
  },
]

export const mcpBlocks: ContentBlock[] = [
  { type: "h", level: 1, text: "favi MCP server" },
  {
    type: "p",
    text: "favi does not run an MCP server. There is no Model Context Protocol endpoint, stdio server, or OAuth-protected MCP transport for this product.",
  },
  { type: "h", level: 2, text: "What to use instead" },
  {
    type: "p",
    text: "Install the favi agent skill (`npx skills add JoeBuildsStuff/favi-next`) and call https://getfavi.vercel.app over HTTP. Developer resources: /docs, /openapi.json, /llms.txt.",
  },
]

export const openApiDocBlocks: ContentBlock[] = [
  { type: "h", level: 1, text: "favi OpenAPI spec" },
  {
    type: "p",
    text: "The machine-readable favi OpenAPI 3.1 document is https://getfavi.vercel.app/openapi.json (also listed from GET /api and /.well-known/api-catalog). Error responses are documented as RFC 9457 application/problem+json with a typed Problem schema.",
  },
  { type: "h", level: 2, text: "Related favi developer resources" },
  {
    type: "ul",
    items: [
      { href: abs("/openapi.json"), label: "favi OpenAPI JSON", note: "application/json" },
      { href: abs("/docs/errors"), label: "favi API errors" },
      { href: abs("/docs"), label: "favi developer resources" },
    ],
  },
]

export const vercelDocBlocks: ContentBlock[] = [
  { type: "h", level: 1, text: "Vercel developer resources for getfavi (favi)" },
  {
    type: "p",
    text: "This page is the Vercel developer resources index for getfavi (also called favi), the favicon picker and HTTP API hosted on Vercel at https://getfavi.vercel.app. Use it when searching for Vercel developer resources, getfavi developer resources, favi API docs, OpenAPI spec, auth docs, webhooks, or MCP server for this product. The same index is published at /vercel and /docs/vercel so name-based queries can land on a predictable URL.",
  },
  { type: "h", level: 2, text: "Vercel-hosted API" },
  {
    type: "p",
    text: "Production URL: https://getfavi.vercel.app (Vercel). OpenAPI spec: /openapi.json. Auth docs: /docs/auth (no API keys). Webhooks: /docs/webhooks (not offered). MCP server: /docs/mcp (not offered; use HTTP). Rate limits are enforced by the Vercel WAF per client IP. Public source: https://github.com/JoeBuildsStuff/favi-next. Deploy notes: this Next.js app is the production origin; there is no separate staging API hostname.",
  },
  { type: "h", level: 2, text: "Named developer docs" },
  {
    type: "ul",
    items: [
      { href: abs("/docs"), label: "getfavi developer resources" },
      { href: abs("/vercel"), label: "Vercel developer resources" },
      { href: abs("/docs/auth"), label: "favi authentication (auth docs)" },
      { href: abs("/docs/webhooks"), label: "favi webhooks" },
      { href: abs("/docs/mcp"), label: "favi MCP server" },
      { href: abs("/docs/openapi"), label: "favi OpenAPI spec" },
      { href: abs("/docs/errors"), label: "favi API errors" },
      { href: abs("/docs/api"), label: "favi API docs" },
      { href: abs("/docs/versioning"), label: "favi REST versioning" },
      { href: abs("/docs/rate-limits"), label: "favi rate limits" },
      { href: abs("/developers"), label: "favi developers" },
      { href: abs("/for-agents"), label: "favi for agents" },
    ],
  },
]

export const errorDocBlocks: ContentBlock[] = [
  { type: "h", level: 1, text: "favi API errors" },
  {
    type: "p",
    text: "favi returns RFC 9457 application/problem+json on API failures. Each document includes type (URI), title, status, detail, instance, a machine-readable code, and a hint for recovery. HTML error pages are not used under /api.",
  },
  { type: "h", level: 2, text: "Error codes" },
  {
    type: "p",
    text: "not_found, method_not_allowed, invalid_json, invalid_shape, invalid_bg_mode, invalid_text, missing_export_source, icon_not_found, index_unavailable, export_failed, rate_limited. Fragment identifiers on this page match those codes (for example /docs/errors#icon_not_found).",
  },
  { type: "h", level: 2, text: "Example" },
  {
    type: "pre",
    text: '{\n  "type": "https://getfavi.vercel.app/docs/errors#icon_not_found",\n  "title": "Icon not found",\n  "status": 404,\n  "detail": "No icon matches that library, name, and style.",\n  "instance": "/api/icons/lucide/missing",\n  "code": "icon_not_found",\n  "hint": "GET /api/libraries for slugs, then GET /api/icons?q= to find a name."\n}',
  },
]

export const versioningDocBlocks: ContentBlock[] = [
  { type: "h", level: 1, text: "favi REST versioning" },
  {
    type: "p",
    text: "favi versions the HTTP API in the URL path. The current version is 1 at /api/v1/. Unversioned /api/* paths are stable aliases of /api/v1/* and are not deprecated. Agents should prefer /api/v1/ in new integrations. An optional API-Version: 1 request header is documented in the OpenAPI spec; the path is authoritative.",
  },
  { type: "h", level: 2, text: "Deprecation policy" },
  {
    type: "p",
    text: "Breaking changes ship as /api/v2/ (and later). When a version is retired, every response for that version includes Deprecation: true and Sunset: <HTTP-date> (RFC 8594) for at least 90 days before the path is removed. v1 currently sends neither header. See /openapi.json and GET /api/v1.",
  },
]

export const rateLimitDocBlocks: ContentBlock[] = [
  { type: "h", level: 1, text: "favi rate limits" },
  {
    type: "p",
    text: "Production getfavi.vercel.app rate-limits by client IP at the Vercel WAF. Every favi HTTP API response includes RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset, RateLimit, RateLimit-Policy, and API-Version. HTTP 429 also includes Retry-After (seconds). Local http://127.0.0.1:3000 is not limited but still advertises the production policy in those headers.",
  },
  { type: "h", level: 2, text: "Quotas" },
  {
    type: "p",
    text: "POST /api/v1/export: 20 requests / 60 seconds / IP. GET /api/v1/icons and GET /api/v1/icons/{library}/{name}: 120 / 60s / IP. GET /api/v1/health, GET /api/v1/libraries, and GET /api/v1: 40 / 60s / IP. Remaining is advertised as the window limit from this app; the WAF may still return 429. Wait Retry-After seconds; do not poll.",
  },
]

export const apiDocBlocks: ContentBlock[] = [
  { type: "h", level: 1, text: "favi API docs" },
  {
    type: "p",
    text: "favi API docs for the public favicon HTTP API at getfavi.vercel.app. Canonical versioned paths: GET /api/v1/health, GET /api/v1/libraries, GET /api/v1/icons, GET /api/v1/icons/{library}/{name}, POST /api/v1/export. Machine-readable: /openapi.json. Auth docs: /docs/auth. Webhooks: /docs/webhooks. MCP server: /docs/mcp. Vercel developer resources: /docs/vercel.",
  },
  { type: "h", level: 2, text: "Full developer resources" },
  {
    type: "p",
    text: "The complete favi developer resources index (examples, rate limits, skill install) is /docs and /for-agents.",
  },
]
