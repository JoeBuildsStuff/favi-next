import { SITE } from "@/lib/site"

export const SITE_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "getfavi",
      alternateName: ["favi", ...SITE.alternateNames],
      url: SITE.url,
      description: SITE.description,
      identifier: "getfavi",
    },
    {
      "@type": "Organization",
      name: "getfavi",
      legalName: "favi",
      alternateName: [...SITE.alternateNames, "favi"],
      url: SITE.url,
      sameAs: [SITE.github, SITE.url],
      identifier: "getfavi",
      logo: `${SITE.url}/opengraph-image`,
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        url: SITE.contact,
      },
      brand: {
        "@type": "Brand",
        name: "getfavi",
        alternateName: ["favi", "getfavi.vercel.app"],
        url: SITE.url,
      },
    },
    {
      "@type": "SoftwareApplication",
      name: "getfavi",
      alternateName: ["favi", ...SITE.alternateNames],
      url: SITE.url,
      description: SITE.description,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      sameAs: [SITE.github],
    },
    {
      "@type": "WebAPI",
      name: "favi HTTP API",
      url: `${SITE.url}/api/v1`,
      documentation: `${SITE.url}/openapi.json`,
      description:
        "Public getfavi (favi) HTTP API on Vercel: search icon libraries and export favicon zips. Versioned at /api/v1/. No authentication. Vercel developer resources at /vercel and /docs/vercel. OpenAPI spec, auth docs, webhooks, and MCP notes are listed from /docs.",
    },
  ],
} as const

export function jsonLdScript(): string {
  return JSON.stringify(SITE_JSON_LD).replace(/</g, "\\u003c")
}
