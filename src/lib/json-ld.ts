import { SITE } from "@/lib/site"

export const SITE_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: SITE.name,
      alternateName: [...SITE.alternateNames],
      url: SITE.url,
      description: SITE.description,
    },
    {
      "@type": "SoftwareApplication",
      name: SITE.name,
      alternateName: [...SITE.alternateNames],
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
      url: `${SITE.url}/for-agents`,
      documentation: `${SITE.url}/openapi.json`,
      description:
        "Public favi HTTP API on Vercel: search icon libraries and export favicon zips. No authentication.",
    },
  ],
} as const

export function jsonLdScript(): string {
  return JSON.stringify(SITE_JSON_LD).replace(/</g, "\\u003c")
}
