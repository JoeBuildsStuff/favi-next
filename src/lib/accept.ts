/**
 * Accept parsing for acceptmarkdown.com content negotiation.
 * Algorithm matches https://acceptmarkdown.com/recipes/nextjs
 */

export const PRODUCES = ["text/html", "text/markdown"] as const

export type ProducedType = (typeof PRODUCES)[number]

type AcceptEntry = { type: string; q: number; specificity: number }

export function parseAccept(header: string): AcceptEntry[] {
  return header.split(",").map((raw) => {
    const parts = raw
      .trim()
      .split(";")
      .map((s) => s.trim())
    const type = (parts[0] ?? "").toLowerCase()
    let q = 1
    for (const param of parts.slice(1)) {
      const [name, value] = param.split("=").map((s) => s.trim())
      if (name === "q") {
        const parsed = Number(value)
        if (!Number.isNaN(parsed)) q = Math.max(0, Math.min(1, parsed))
      }
    }
    const specificity = type === "*/*" ? 0 : type.endsWith("/*") ? 1 : 2
    return { type, q, specificity }
  })
}

function matches(entry: AcceptEntry, candidate: string): boolean {
  if (entry.type === "*/*") return true
  if (entry.type.endsWith("/*")) {
    return candidate.startsWith(entry.type.slice(0, -1))
  }
  return entry.type === candidate
}

/** RFC 9110 §12.5.1: most specific matching range wins, then q, then client order. */
export function preferredType(header: string | null): ProducedType | null {
  if (!header) return PRODUCES[0]
  const entries = parseAccept(header)
  if (entries.length === 0) return PRODUCES[0]

  let bestType: ProducedType | null = null
  let bestQ = -1
  let bestPosition = Infinity

  for (const candidate of PRODUCES) {
    let matched: AcceptEntry | null = null
    let matchedPosition = Infinity
    for (let idx = 0; idx < entries.length; idx++) {
      const e = entries[idx]
      if (!e || !matches(e, candidate)) continue
      if (
        matched === null ||
        e.specificity > matched.specificity ||
        (e.specificity === matched.specificity && idx < matchedPosition)
      ) {
        matched = e
        matchedPosition = idx
      }
    }
    if (matched === null) continue
    if (matched.q <= 0) continue

    if (matched.q > bestQ || (matched.q === bestQ && matchedPosition < bestPosition)) {
      bestQ = matched.q
      bestPosition = matchedPosition
      bestType = candidate
    }
  }

  return bestType
}

export function appendVaryAccept(headers: Headers): void {
  appendVary(headers, [...VARY_ACCEPT])
}

export function isRscNavigationRequest(headers: Headers): boolean {
  return (
    headers.has("rsc") ||
    headers.has("next-router-state-tree") ||
    headers.has("next-router-prefetch") ||
    headers.has("next-router-segment-prefetch")
  )
}

export function appendVary(headers: Headers, tokens: string[]): void {
  const existing = headers.get("Vary")
  const current = existing
    ? existing.split(",").map((s) => s.trim()).filter(Boolean)
    : []
  const lower = new Set(current.map((s) => s.toLowerCase()))
  for (const token of tokens) {
    if (!lower.has(token.toLowerCase())) {
      current.push(token)
      lower.add(token.toLowerCase())
    }
  }
  headers.set("Vary", current.join(", "))
}

export const VARY_ACCEPT = ["Accept", "Accept-Encoding"] as const

export const MARKDOWN_CONTENT_TYPE = "text/markdown; charset=utf-8"

const SKIP_PREFIXES = [
  "/api/",
  "/_next/",
  "/_vercel/",
  "/skills/",
  "/.well-known/",
]

const SKIP_EXACT = new Set([
  "/llms.txt",
  "/robots.txt",
  "/sitemap.xml",
  "/openapi.json",
  "/favicon.svg",
  "/favicon.ico",
  "/apple-touch-icon.png",
  "/opengraph-image",
  "/opengraph-image.png",
])

const SKIP_EXTENSIONS = [
  ".svg",
  ".ico",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".gif",
  ".woff",
  ".woff2",
  ".webmanifest",
  ".json",
  ".txt",
  ".xml",
]

export function isNextDataRequest(headers: Headers, url: URL): boolean {
  return (
    headers.has("rsc") ||
    headers.has("next-router-state-tree") ||
    headers.has("next-router-prefetch") ||
    headers.has("next-router-segment-prefetch") ||
    url.searchParams.has("_rsc")
  )
}

export function shouldSkipNegotiation(pathname: string): boolean {
  if (SKIP_EXACT.has(pathname)) return true
  if (SKIP_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return true
  const lower = pathname.toLowerCase()
  return SKIP_EXTENSIONS.some((ext) => lower.endsWith(ext))
}

export type NegotiateDecision = "markdown" | "html" | "406" | "skip"

export function negotiate(args: {
  method: string
  pathname: string
  accept: string | null
  isRsc: boolean
}): NegotiateDecision {
  const method = args.method.toUpperCase()
  if (method !== "GET" && method !== "HEAD") return "skip"
  if (args.isRsc) return "skip"
  if (shouldSkipNegotiation(args.pathname)) return "skip"
  if (args.pathname.endsWith(".md")) return "markdown"

  const chosen = preferredType(args.accept)
  if (chosen === "text/markdown") return "markdown"
  if (chosen === null && args.accept) return "406"
  return "html"
}

export function markdownRewritePath(pathname: string): string {
  const stripped = pathname.endsWith(".md") ? pathname.slice(0, -3) : pathname
  const normalized =
    stripped === "" || stripped === "/" || stripped === "/index"
      ? "/"
      : stripped
  return `/api/markdown${normalized === "/" ? "" : normalized}`
}
