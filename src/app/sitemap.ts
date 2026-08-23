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
    {
      url: absoluteUrl("/docs/vercel"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    { url: absoluteUrl("/docs/auth"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    {
      url: absoluteUrl("/docs/webhooks"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    { url: absoluteUrl("/docs/mcp"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    {
      url: absoluteUrl("/docs/openapi"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/docs/errors"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/docs/api"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/docs/versioning"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/docs/rate-limits"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/developers"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/getfavi"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/vercel"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/about"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/contact"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/privacy"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
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
