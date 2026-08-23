import { SITE, absoluteUrl } from "@/lib/site"

/** RFC 9727 / RFC 9264 linkset for /.well-known/api-catalog */
export const API_CATALOG_PROFILE = "https://www.rfc-editor.org/info/rfc9727"

export const API_CATALOG = {
  linkset: [
    {
      anchor: `${SITE.url}/`,
      item: [
        { href: absoluteUrl("/api/v1/health"), type: "application/json" },
        { href: absoluteUrl("/api/v1/libraries"), type: "application/json" },
        { href: absoluteUrl("/api/v1/icons"), type: "application/json" },
        { href: absoluteUrl("/api/v1/export"), type: "application/zip" },
      ],
      "service-desc": [
        { href: absoluteUrl("/openapi.json"), type: "application/json" },
      ],
      "service-doc": [
        { href: absoluteUrl("/docs"), type: "text/html" },
        { href: absoluteUrl("/developers"), type: "text/html" },
        { href: absoluteUrl("/docs/api"), type: "text/html" },
        { href: absoluteUrl("/docs/vercel"), type: "text/html" },
        { href: absoluteUrl("/vercel"), type: "text/html" },
        { href: absoluteUrl("/docs/versioning"), type: "text/html" },
        { href: absoluteUrl("/docs/rate-limits"), type: "text/html" },
        { href: absoluteUrl("/docs/auth"), type: "text/html" },
        { href: absoluteUrl("/docs/webhooks"), type: "text/html" },
        { href: absoluteUrl("/docs/mcp"), type: "text/html" },
        { href: absoluteUrl("/for-agents"), type: "text/html" },
        { href: absoluteUrl("/llms.txt"), type: "text/plain" },
        { href: absoluteUrl("/skills/favi/SKILL.md"), type: "text/markdown" },
      ],
    },
  ],
} as const

export const API_CATALOG_CONTENT_TYPE = `application/linkset+json; profile="${API_CATALOG_PROFILE}"`

export const API_CATALOG_LINK = `</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"`

export const API_CATALOG_MARKDOWN = `# favi API catalog

The favi API is a public, keyless HTTP API hosted at ${SITE.url}. Use it to search free icon libraries and export favicon packages.

## Machine-readable resources

- [OpenAPI 3.1 specification](${absoluteUrl("/openapi.json")})
- [API index](${absoluteUrl("/api/v1")})
- [Developer resources](${absoluteUrl("/docs")})
- [Agent index](${absoluteUrl("/llms.txt")})
- [Agent skill](${absoluteUrl("/skills/favi/SKILL.md")})

## Endpoints

- GET ${absoluteUrl("/api/v1/health")} — service status and indexed icon count
- GET ${absoluteUrl("/api/v1/libraries")} — supported icon packs, licenses, and styles
- GET ${absoluteUrl("/api/v1/icons")} — search the icon catalog
- GET ${absoluteUrl("/api/v1/icons/{library}/{name}")} — fetch an exact icon
- POST ${absoluteUrl("/api/v1/export")} — export a favicon zip

Authentication is not required. Prefer the canonical \`/api/v1/\` paths; unversioned \`/api/\` paths are stable aliases. Production responses are rate-limited by client IP and return standard RateLimit headers. Errors use RFC 9457 \`application/problem+json\`.
`

export const API_CATALOG_MARKDOWN_CONTENT_TYPE = "text/markdown; charset=utf-8"
