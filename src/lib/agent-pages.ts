import { SITE_DESCRIPTION, SITE_NAME, SITE_ORIGIN } from "@/lib/site"

export type ContentLink = { href: string; label: string; note?: string }

export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h"; level: 1 | 2 | 3; text: string }
  | { type: "ul"; items: ContentLink[] }
  | { type: "pre"; text: string }

export type AgentPage = {
  status: 200 | 404
  title: string
  blocks: ContentBlock[]
}

export const MACHINE_PATHS = [
  "/llms.txt",
  "/sitemap.xml",
  "/robots.txt",
  "/openapi.json",
  "/.well-known/api-catalog",
  "/.well-known/api-catalog.md",
  "/skills/favi/SKILL.md",
  "/for-agents",
] as const

function abs(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path
  return `${SITE_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`
}

export function normalizeAgentPath(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, "") || "/"
  if (trimmed.endsWith(".md")) {
    const withoutMd = trimmed.slice(0, -3) || "/"
    return withoutMd === "/index" ? "/" : withoutMd
  }
  return trimmed === "/index" ? "/" : trimmed
}

const recoveryLinks: ContentLink[] = [
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

export const homepageBlocks: ContentBlock[] = [
  { type: "h", level: 1, text: "getfavi (favi) — favicon picker and HTTP API" },
  { type: "p", text: SITE_DESCRIPTION },
  {
    type: "p",
    text: "The canonical domain for favi is getfavi.vercel.app. Search for getfavi or favi favicon API to reach this origin (https://getfavi.vercel.app), not a generic “favi” dictionary sense. The public Next.js app is hosted on Vercel. Brand listings should use the name getfavi, the URL https://getfavi.vercel.app, and the public source https://github.com/JoeBuildsStuff/favi-next.",
  },
  { type: "h", level: 2, text: "How to read getfavi" },
  { type: "h", level: 3, text: "For people using the picker" },
  {
    type: "p",
    text: "The visual homepage is a favicon picker: search an icon library, recolor the plate, optionally compose initials, and download a zip. That UI hydrates in the browser. The same facts are written in this article so a crawler that never runs JavaScript still sees an H1, nested H2 and H3 headings, and more than five hundred characters of product copy.",
  },
  { type: "h", level: 3, text: "For agents using the HTTP API" },
  {
    type: "p",
    text: "Agents should ignore the picker and call the public HTTP API. Start at /llms.txt or getfavi developer resources (/docs, /developers, /agents, /for-agents). Named Vercel developer resources, OpenAPI spec, auth docs, webhooks, and MCP server pages live at /vercel and /docs/vercel. Trust pages: /about, /contact, /privacy. Brand page: /getfavi.",
  },
  { type: "h", level: 2, text: "What favi is" },
  { type: "h", level: 3, text: "Icon libraries" },
  {
    type: "p",
    text: "The favi catalog indexes Lucide, Tabler, Phosphor, Hugeicons (free), and Remix Icon from their npm packages. Search accepts q, library, style, limit (1–300), and offset. Common synonyms such as photo→image, trash→delete, and gear→settings are expanded before matching. Each hit includes library, name, style, and raw SVG.",
  },
  { type: "h", level: 3, text: "Favicon export" },
  {
    type: "p",
    text: "POST /api/export returns a zip. Send library+name+style, or text for 1–2 initials, plus plate color, optional two-stop linear gradient, padding, stroke scale, shape, site name, and optional dark-mode SVG. The zip always includes favicon.svg, favicon.ico, apple-touch-icon.png, Android chrome 192/512 icons, site.webmanifest, and a README with HTML / Next.js install notes.",
  },
  { type: "h", level: 2, text: "How agents use favi" },
  { type: "h", level: 3, text: "Search then export" },
  {
    type: "p",
    text: "Prefer curl or fetch against the public HTTP API. Do not drive the browser UI unless the user asks for visual QA. Canonical paths are /api/v1/… (unversioned /api/… is a stable alias). Typical flow: GET /api/v1/libraries, GET /api/v1/icons?q=…, GET /api/v1/icons/:library/:name, then one POST /api/v1/export. Production at getfavi.vercel.app is rate-limited by client IP at the Vercel WAF. Responses include RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset, and Retry-After on 429. Local http://127.0.0.1:3000 is not limited. JSON errors use RFC 9457 application/problem+json with code, message (detail), and hint.",
  },
  { type: "h", level: 2, text: "favi developer resources on Vercel" },
  { type: "h", level: 3, text: "HTTP API, OpenAPI, auth, webhooks, and MCP" },
  {
    type: "p",
    text: "favi developer resources for the Vercel-hosted favicon HTTP API live at predictable URLs. Search for getfavi, favi API docs, favi OpenAPI spec, favi auth docs, favi webhooks, favi MCP server, or Vercel developer resources. There is no authentication, no webhooks, and no MCP server — use the HTTP API and the favi skill. Named docs: /docs, /developers, /agents, /docs/api, /docs/auth, /docs/webhooks, /docs/mcp, /docs/openapi, /docs/errors, /docs/vercel, /vercel, /docs/versioning, /docs/rate-limits, /getfavi, /about, /contact, /privacy.",
  },
  { type: "ul", items: recoveryLinks.slice(1) },
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

export const developerBlocks: ContentBlock[] = [
  { type: "h", level: 1, text: "getfavi (favi) developer resources" },
  {
    type: "p",
    text: "This page is the getfavi (favi) developer resources index for the public favicon HTTP API hosted on Vercel at getfavi.vercel.app. Use it when you need favi API docs, the OpenAPI spec, auth docs, webhooks, MCP server notes, or the agent skill. Search for “Vercel developer resources”, “getfavi developer resources”, or “favi OpenAPI spec”. No account is required.",
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

export const getfaviBlocks: ContentBlock[] = [
  { type: "h", level: 1, text: "getfavi" },
  {
    type: "p",
    text: "getfavi is the brand name of favi, a public favicon picker and HTTP API. The canonical domain is https://getfavi.vercel.app (hosted on Vercel). Search for getfavi, getfavi.vercel.app, or favi favicon API to reach this origin rather than an unrelated dictionary sense of “favi”. The GitHub repository is https://github.com/JoeBuildsStuff/favi-next. This page is the brand landing so a clean search for getfavi can resolve to getfavi.vercel.app.",
  },
  { type: "h", level: 2, text: "Product" },
  {
    type: "p",
    text: "getfavi indexes Lucide, Tabler, Phosphor, Hugeicons (free), and Remix Icon. People use the visual picker on the homepage. Agents search icons and export a favicon zip over HTTP with no authentication. Developer resources: /docs and Vercel developer resources at /vercel. Visual picker: /.",
  },
  { type: "h", level: 2, text: "Name, origin, and listings" },
  {
    type: "p",
    text: "NAP for getfavi: Name getfavi (also favi). Address: online-only, no storefront. Phone: none. URL: https://getfavi.vercel.app. Contact: https://github.com/JoeBuildsStuff/favi-next/issues. SameAs: the GitHub repository. Use this exact name and URL in directories, READMEs, and press mentions so search engines associate getfavi with getfavi.vercel.app instead of a generic string. There is no redirect chain in front of the apex production host; https://getfavi.vercel.app is the canonical origin.",
  },
]

export const aboutBlocks: ContentBlock[] = [
  { type: "h", level: 1, text: "About getfavi" },
  {
    type: "p",
    text: "getfavi (product name favi) is a free, public favicon picker and HTTP API. It indexes open icon libraries — Lucide, Tabler, Phosphor, Hugeicons (free subset), and Remix Icon — so you can search an icon, recolor it, compose one or two initials, and download a favicon zip that includes SVG, ICO, apple-touch, and PWA / maskable assets. The canonical website is https://getfavi.vercel.app.",
  },
  { type: "h", level: 2, text: "Who maintains getfavi" },
  {
    type: "p",
    text: "getfavi is maintained as a public Next.js application. Source code, issues, and license notes live in the GitHub repository https://github.com/JoeBuildsStuff/favi-next. There is no separate company storefront. Hosting is Vercel. Icon artwork remains the property of each library under that library’s license; getfavi does not sell icons and does not generate original artwork.",
  },
  { type: "h", level: 2, text: "How to use it" },
  {
    type: "p",
    text: "People can use the visual picker on the homepage. Agents should call the HTTP API documented under getfavi developer resources (/docs) and Vercel developer resources (/vercel). Trust pages: /about, /contact, /privacy. No account is required.",
  },
]

export const contactBlocks: ContentBlock[] = [
  { type: "h", level: 1, text: "Contact getfavi" },
  {
    type: "p",
    text: "The public contact channel for getfavi is GitHub Issues on the favi-next repository. Open a bug, API question, or documentation request at https://github.com/JoeBuildsStuff/favi-next/issues. Include the getfavi URL you hit (https://getfavi.vercel.app), the HTTP method and path, and any RFC 9457 problem+json body. Do not send API keys; getfavi does not issue them.",
  },
  { type: "h", level: 2, text: "Name, address, phone" },
  {
    type: "p",
    text: "Name: getfavi (favi). Canonical URL: https://getfavi.vercel.app. Public source: https://github.com/JoeBuildsStuff/favi-next. getfavi is an online-only service. There is no telephone number, no walk-in office, and no postal storefront. Support is through GitHub Issues. For security-sensitive reports, prefer a private GitHub security advisory on that repository if the issue would put users at risk; otherwise a public issue is enough.",
  },
  { type: "h", level: 2, text: "What we can help with" },
  {
    type: "p",
    text: "Icon search mismatches, export zip contents, rate-limit 429s on Vercel, OpenAPI drift, and agent-skill steps. We cannot grant paid icon licenses, run an MCP server, or configure webhooks, because those are not part of getfavi.",
  },
]

export const privacyBlocks: ContentBlock[] = [
  { type: "h", level: 1, text: "getfavi privacy" },
  {
    type: "p",
    text: "getfavi does not offer user accounts, billing, or login. You can search icons and export a favicon zip without creating a profile. This page describes what the public site and HTTP API process when you use https://getfavi.vercel.app.",
  },
  { type: "h", level: 2, text: "What we process" },
  {
    type: "p",
    text: "Browser and API requests reach Vercel’s network. Vercel may log standard request metadata (time, path, status, user-agent, and client IP) for hosting, DDoS protection, and the production WAF rate limits described in /docs/rate-limits. Search queries and export JSON bodies are used to build a response; getfavi does not keep a product database of your searches or downloaded zips. Theme preference in the visual picker is stored in the browser (typically localStorage), not as a getfavi account cookie.",
  },
  { type: "h", level: 2, text: "Third parties and your choices" },
  {
    type: "p",
    text: "Icon SVG comes from npm packages of Lucide, Tabler, Phosphor, Hugeicons, and Remix Icon; those projects have their own licenses. We do not sell personal information. To ask a privacy question, use GitHub Issues at https://github.com/JoeBuildsStuff/favi-next/issues. If you block the origin, you simply do not use the service; there is no marketing list to unsubscribe from.",
  },
]

export const DEVELOPER_DOC_SLUGS = [
  "auth",
  "webhooks",
  "mcp",
  "openapi",
  "vercel",
  "errors",
  "api",
  "versioning",
  "rate-limits",
] as const

export type DeveloperDocSlug = (typeof DEVELOPER_DOC_SLUGS)[number]

const topicPages: Record<DeveloperDocSlug, AgentPage> = {
  auth: {
    status: 200,
    title: "favi authentication (auth docs)",
    blocks: authBlocks,
  },
  webhooks: {
    status: 200,
    title: "favi webhooks",
    blocks: webhooksBlocks,
  },
  mcp: {
    status: 200,
    title: "favi MCP server",
    blocks: mcpBlocks,
  },
  openapi: {
    status: 200,
    title: "favi OpenAPI spec",
    blocks: openApiDocBlocks,
  },
  vercel: {
    status: 200,
    title: "Vercel developer resources for getfavi (favi)",
    blocks: vercelDocBlocks,
  },
  errors: {
    status: 200,
    title: "favi API errors",
    blocks: errorDocBlocks,
  },
  api: {
    status: 200,
    title: "favi API docs",
    blocks: apiDocBlocks,
  },
  versioning: {
    status: 200,
    title: "favi REST versioning",
    blocks: versioningDocBlocks,
  },
  "rate-limits": {
    status: 200,
    title: "favi rate limits",
    blocks: rateLimitDocBlocks,
  },
}

const pages: Record<string, AgentPage> = {
  "/": {
    status: 200,
    title: "getfavi (favi) — favicon picker and HTTP API",
    blocks: homepageBlocks,
  },
  "/getfavi": {
    status: 200,
    title: "getfavi",
    blocks: getfaviBlocks,
  },
  "/for-agents": {
    status: 200,
    title: "getfavi (favi) developer resources",
    blocks: developerBlocks,
  },
  "/developers": {
    status: 200,
    title: "getfavi (favi) developer resources",
    blocks: developerBlocks,
  },
  "/agents": {
    status: 200,
    title: "getfavi (favi) agent resources",
    blocks: developerBlocks,
  },
  "/docs": {
    status: 200,
    title: "getfavi (favi) developer resources",
    blocks: developerBlocks,
  },
  "/vercel": {
    status: 200,
    title: "Vercel developer resources for getfavi (favi)",
    blocks: vercelDocBlocks,
  },
  "/about": {
    status: 200,
    title: "About getfavi",
    blocks: aboutBlocks,
  },
  "/contact": {
    status: 200,
    title: "Contact getfavi",
    blocks: contactBlocks,
  },
  "/privacy": {
    status: 200,
    title: "getfavi privacy",
    blocks: privacyBlocks,
  },
  ...Object.fromEntries(
    DEVELOPER_DOC_SLUGS.map((slug) => [`/docs/${slug}`, topicPages[slug]])
  ),
}

export function getAgentPage(pathname: string): AgentPage {
  const path = normalizeAgentPath(pathname)
  return (
    pages[path] ?? {
      status: 404,
      title: "Page not found",
      blocks: notFoundBlocks,
    }
  )
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

export type NestedNode =
  | Exclude<ContentBlock, { type: "h" }>
  | {
      type: "section"
      heading: Extract<ContentBlock, { type: "h" }>
      children: NestedNode[]
    }

/** Nest heading blocks into a tree by level (H1 → H2 → H3) for outline checks. */
export function nestBlocks(blocks: ContentBlock[]): NestedNode[] {
  const root: NestedNode[] = []
  const stack: { level: number; children: NestedNode[] }[] = [
    { level: 0, children: root },
  ]

  for (const block of blocks) {
    if (block.type === "h") {
      while (stack.length > 1 && stack[stack.length - 1]!.level >= block.level) {
        stack.pop()
      }
      const children: NestedNode[] = []
      stack[stack.length - 1]!.children.push({
        type: "section",
        heading: block,
        children,
      })
      stack.push({ level: block.level, children })
    } else {
      stack[stack.length - 1]!.children.push(block)
    }
  }

  return root
}

function htmlFromBlock(block: ContentBlock): string {
  if (block.type === "h") {
    return `<h${block.level}>${escapeHtml(block.text)}</h${block.level}>`
  }
  if (block.type === "p") {
    return `<p>${escapeHtml(block.text)}</p>`
  }
  if (block.type === "pre") {
    return `<pre><code>${escapeHtml(block.text)}</code></pre>`
  }
  const items = block.items
    .map((item) => {
      const note = item.note ? ` — ${escapeHtml(item.note)}` : ""
      return `<li><a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>${note}</li>`
    })
    .join("")
  return `<ul>${items}</ul>`
}

export function blocksToHtml(blocks: ContentBlock[]): string {
  return `<article>\n${blocks.map(htmlFromBlock).join("\n")}\n</article>`
}

export function blocksToMarkdown(blocks: ContentBlock[]): string {
  return (
    blocks
      .map((block) => {
        if (block.type === "h") {
          return `${"#".repeat(block.level)} ${block.text}`
        }
        if (block.type === "p") {
          return block.text
        }
        if (block.type === "pre") {
          return `\`\`\`\n${block.text}\n\`\`\``
        }
        return block.items
          .map((item) => {
            const note = item.note ? `: ${item.note}` : ""
            return `- [${item.label}](${item.href})${note}`
          })
          .join("\n")
      })
      .join("\n\n") + "\n"
  )
}

export function blocksToPlainText(blocks: ContentBlock[]): string {
  return blocks
    .map((block) => {
      if (block.type === "ul") {
        return block.items
          .map((item) => `${item.label} ${item.note ?? ""} ${item.href}`)
          .join(" ")
      }
      if (block.type === "pre") return block.text
      return block.text
    })
    .join(" ")
    .replace(/\s+/g, " ")
    .trim()
}

export function markdownHeaders(): HeadersInit {
  return {
    "Content-Type": "text/markdown; charset=utf-8",
    Vary: "Accept, Accept-Encoding",
    "Cache-Control": "public, max-age=60, stale-while-revalidate=86400",
  }
}
