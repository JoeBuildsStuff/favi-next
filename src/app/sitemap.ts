import type { MetadataRoute } from "next"

import { absoluteUrl } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: absoluteUrl("/for-agents"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    { url: absoluteUrl("/docs"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/llms.txt"), lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/openapi.json"), lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    {
      url: absoluteUrl("/skills/favi/SKILL.md"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ]
}
