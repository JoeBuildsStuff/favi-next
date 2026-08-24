import type { ContentBlock } from "../types"

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
