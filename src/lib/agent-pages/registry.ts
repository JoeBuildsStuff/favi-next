import { developerBlocks } from "./content/developer"
import { getfaviBlocks } from "./content/getfavi"
import { homepageBlocks } from "./content/homepage"
import { notFoundBlocks } from "./content/not-found"
import {
  apiDocBlocks,
  authBlocks,
  errorDocBlocks,
  mcpBlocks,
  openApiDocBlocks,
  rateLimitDocBlocks,
  vercelDocBlocks,
  versioningDocBlocks,
  webhooksBlocks,
} from "./content/topics"
import { aboutBlocks, contactBlocks, privacyBlocks } from "./content/trust"
import { normalizeAgentPath } from "./paths"
import type { AgentPage } from "./types"

export const DEVELOPER_DOC_SLUGS = [
  "auth",
  "webhooks",
  "mcp",
  "openapi",
  "vercel",
  "errors",
  "api",
  "versioning",
  "rate-limits",
] as const

export type DeveloperDocSlug = (typeof DEVELOPER_DOC_SLUGS)[number]

const topicPages: Record<DeveloperDocSlug, AgentPage> = {
  auth: {
    status: 200,
    title: "favi authentication (auth docs)",
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
    title: "Vercel developer resources for getfavi (favi)",
    blocks: vercelDocBlocks,
  },
  errors: {
    status: 200,
    title: "favi API errors",
    blocks: errorDocBlocks,
  },
  api: {
    status: 200,
    title: "favi API docs",
    blocks: apiDocBlocks,
  },
  versioning: {
    status: 200,
    title: "favi REST versioning",
    blocks: versioningDocBlocks,
  },
  "rate-limits": {
    status: 200,
    title: "favi rate limits",
    blocks: rateLimitDocBlocks,
  },
}

const pages: Record<string, AgentPage> = {
  "/": {
    status: 200,
    title: "getfavi (favi) — favicon picker and HTTP API",
    blocks: homepageBlocks,
  },
  "/getfavi": {
    status: 200,
    title: "getfavi",
    blocks: getfaviBlocks,
  },
  // Intentional aliases for the same developerBlocks (not accidental duplication):
  // /for-agents — canonical agent-oriented URL (markdown / content-negotiation friendly)
  // /docs — conventional human docs URL
  // /developers — catalog/search synonym used in API catalogs
  // /agents — extra agent onboarding alias (title: "agent resources")
  "/for-agents": {
    status: 200,
    title: "getfavi (favi) developer resources",
    blocks: developerBlocks,
  },
  "/developers": {
    status: 200,
    title: "getfavi (favi) developer resources",
    blocks: developerBlocks,
  },
  "/agents": {
    status: 200,
    title: "getfavi (favi) agent resources",
    blocks: developerBlocks,
  },
  "/docs": {
    status: 200,
    title: "getfavi (favi) developer resources",
    blocks: developerBlocks,
  },
  "/vercel": {
    status: 200,
    title: "Vercel developer resources for getfavi (favi)",
    blocks: vercelDocBlocks,
  },
  "/about": {
    status: 200,
    title: "About getfavi",
    blocks: aboutBlocks,
  },
  "/contact": {
    status: 200,
    title: "Contact getfavi",
    blocks: contactBlocks,
  },
  "/privacy": {
    status: 200,
    title: "getfavi privacy",
    blocks: privacyBlocks,
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
