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
]

export const homepageBlocks: ContentBlock[] = [
  { type: "h", level: 1, text: "favi (getfavi) — favicon picker and HTTP API" },
  { type: "p", text: SITE_DESCRIPTION },
  {
    type: "p",
    text: "The canonical domain for favi is getfavi.vercel.app. Search for getfavi or favi favicon API to reach this origin (https://getfavi.vercel.app), not a generic “favi” dictionary sense. The public Next.js app is hosted on Vercel.",
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
    text: "Prefer curl or fetch against the public HTTP API. Do not drive the browser UI unless the user asks for visual QA. Typical flow: GET /api/libraries, GET /api/icons?q=…, GET /api/icons/:library/:name, then one POST /api/export. Production at getfavi.vercel.app is rate-limited by client IP at the Vercel WAF (429 means wait and retry; do not poll). Local http://127.0.0.1:3000 is not limited. JSON errors use RFC 9457 application/problem+json with code, message (detail), and hint.",
  },
  { type: "h", level: 2, text: "favi developer resources on Vercel" },
  { type: "h", level: 3, text: "HTTP API, OpenAPI, auth, webhooks, and MCP" },
  {
    type: "p",
    text: "favi developer resources for the Vercel-hosted favicon HTTP API live at predictable URLs. There is no authentication, no webhooks, and no MCP server — use the HTTP API and the favi skill. Named docs: /docs (index), /docs/auth, /docs/webhooks, /docs/mcp, /docs/openapi, /docs/errors, /docs/vercel.",
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
  { type: "h", level: 1, text: "favi developer resources" },
  {
    type: "p",
    text: "This page is the favi developer resources index for the public favicon HTTP API hosted on Vercel at getfavi.vercel.app. Use it when you need API docs, the OpenAPI spec, authentication notes, or the agent skill. No account is required.",
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
    ],
  },
  { type: "h", level: 2, text: "HTTP API" },
  { type: "h", level: 3, text: "Health" },
  { type: "p", text: "GET /api/health → { status, icons } with the indexed icon count." },
  { type: "pre", text: `curl -sS ${SITE_ORIGIN}/api/health` },
  { type: "h", level: 3, text: "Libraries" },
  {
    type: "p",
    text: "GET /api/libraries lists packs (lucide, tabler, phosphor, hugeicons, remix), licenses, styles, and counts.",
  },
  { type: "pre", text: `curl -sS ${SITE_ORIGIN}/api/libraries` },
  { type: "h", level: 3, text: "Search icons" },
  {
    type: "p",
    text: "GET /api/icons?q=&library=&style=&limit=&offset=. q expands curated synonyms. Each hit includes library, name, style, and svg.",
  },
  {
    type: "pre",
    text: `curl -sS "${SITE_ORIGIN}/api/icons?q=image&library=lucide&style=outline&limit=12"`,
  },
  { type: "h", level: 3, text: "Exact icon" },
  { type: "p", text: "GET /api/icons/:library/:name?style= returns one icon or 404." },
  {
    type: "pre",
    text: `curl -sS "${SITE_ORIGIN}/api/icons/lucide/image?style=outline"`,
  },
  { type: "h", level: 3, text: "Export favicon zip" },
  {
    type: "p",
    text: "POST /api/export with JSON {library,name,style} or {text} plus optional bg, bg_mode, bg_to, bg_angle, fill, stroke, padding, stroke_scale, shape, include_dark_mode, dark_*, site_name. Response is application/zip.",
  },
  {
    type: "pre",
    text: `curl -sS -X POST ${SITE_ORIGIN}/api/export \\\n  -H 'Content-Type: application/json' \\\n  -d '{"library":"lucide","name":"image","style":"outline","bg":"#075985","stroke":"#ffffff"}' \\\n  -o favicon.zip`,
  },
  { type: "h", level: 2, text: "Rate limits" },
  {
    type: "p",
    text: "Production only. POST /api/export: 20 / 60s / IP. GET /api/icons and /api/icons/:library/:name: 120 / 60s / IP. GET /api/health and /api/libraries: 40 / 60s / IP. Search, look up, then export once.",
  },
  { type: "h", level: 2, text: "Webhooks and MCP" },
  {
    type: "p",
    text: "favi does not publish webhooks and does not run an MCP server. Dedicated pages: /docs/webhooks and /docs/mcp. Agents should call the HTTP API and read this page, /llms.txt, /openapi.json, and /skills/favi/SKILL.md.",
  },
]

export const authBlocks: ContentBlock[] = [
  { type: "h", level: 1, text: "favi authentication" },
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
  { type: "h", level: 1, text: "favi Vercel developer resources" },
  {
    type: "p",
    text: "This page is the favi developer resources index for the Vercel-hosted origin getfavi.vercel.app. Use it when searching for “favi Vercel”, “Vercel developer resources” for this product, or the public favicon HTTP API deployed on Vercel.",
  },
  { type: "h", level: 2, text: "Vercel-hosted API" },
  {
    type: "p",
    text: "Production URL: https://getfavi.vercel.app. OpenAPI: /openapi.json. Auth: none (see /docs/auth). Rate limits are enforced by the Vercel WAF per client IP. Source: https://github.com/JoeBuildsStuff/favi-next.",
  },
  { type: "h", level: 2, text: "Named developer docs" },
  {
    type: "ul",
    items: [
      { href: abs("/docs"), label: "favi developer resources" },
      { href: abs("/docs/auth"), label: "favi authentication" },
      { href: abs("/docs/webhooks"), label: "favi webhooks" },
      { href: abs("/docs/mcp"), label: "favi MCP server" },
      { href: abs("/docs/openapi"), label: "favi OpenAPI spec" },
      { href: abs("/docs/errors"), label: "favi API errors" },
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

export const DEVELOPER_DOC_SLUGS = [
  "auth",
  "webhooks",
  "mcp",
  "openapi",
  "vercel",
  "errors",
] as const

export type DeveloperDocSlug = (typeof DEVELOPER_DOC_SLUGS)[number]

const topicPages: Record<DeveloperDocSlug, AgentPage> = {
  auth: {
    status: 200,
    title: "favi authentication",
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
    title: "favi Vercel developer resources",
    blocks: vercelDocBlocks,
  },
  errors: {
    status: 200,
    title: "favi API errors",
    blocks: errorDocBlocks,
  },
}

const pages: Record<string, AgentPage> = {
  "/": {
    status: 200,
    title: `${SITE_NAME} — favicon picker and HTTP API`,
    blocks: homepageBlocks,
  },
  "/for-agents": {
    status: 200,
    title: "favi developer resources",
    blocks: developerBlocks,
  },
  "/docs": {
    status: 200,
    title: "favi developer resources",
    blocks: developerBlocks,
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

/** Nest heading blocks into <section> trees so the outline is not a flat sibling list. */
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

function htmlFromNested(nodes: NestedNode[]): string {
  return nodes
    .map((node) => {
      if (node.type === "section") {
        const inner = htmlFromNested(node.children)
        return `<section>\n<h${node.heading.level}>${escapeHtml(node.heading.text)}</h${node.heading.level}>\n${inner}\n</section>`
      }
      if (node.type === "p") {
        return `<p>${escapeHtml(node.text)}</p>`
      }
      if (node.type === "pre") {
        return `<pre><code>${escapeHtml(node.text)}</code></pre>`
      }
      const items = node.items
        .map((item) => {
          const note = item.note ? ` — ${escapeHtml(item.note)}` : ""
          return `<li><a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>${note}</li>`
        })
        .join("")
      return `<ul>${items}</ul>`
    })
    .join("\n")
}

export function blocksToHtml(blocks: ContentBlock[]): string {
  return `<article>\n${htmlFromNested(nestBlocks(blocks))}\n</article>`
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
