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
