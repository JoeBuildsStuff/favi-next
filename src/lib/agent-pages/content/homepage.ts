import { SITE_DESCRIPTION } from "@/lib/site"

import type { ContentBlock } from "../types"
import { recoveryLinks } from "./not-found"

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
