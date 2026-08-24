import { SITE_ORIGIN } from "@/lib/site"

export const MACHINE_PATHS = [
  "/llms.txt",
  "/sitemap.xml",
  "/robots.txt",
  "/openapi.json",
  "/.well-known/api-catalog",
  "/.well-known/api-catalog.md",
  "/skills/favi/SKILL.md",
  "/for-agents",
] as const

export function abs(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path
  return `${SITE_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`
}

export function normalizeAgentPath(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, "") || "/"
  if (trimmed.endsWith(".md")) {
    const withoutMd = trimmed.slice(0, -3) || "/"
    return withoutMd === "/index" ? "/" : withoutMd
  }
  return trimmed === "/index" ? "/" : trimmed
}
