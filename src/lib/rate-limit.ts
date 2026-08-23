/** Advertised production quotas (Vercel WAF, per client IP). Local dev is not limited. */
export const API_VERSION = "1"

export type RateLimitPolicy = {
  name: "export" | "icons" | "default"
  limit: number
  windowSec: number
}

export const RATE_LIMIT_POLICIES = {
  export: { name: "export", limit: 20, windowSec: 60 },
  icons: { name: "icons", limit: 120, windowSec: 60 },
  default: { name: "default", limit: 40, windowSec: 60 },
} as const satisfies Record<string, RateLimitPolicy>

export function canonicalApiPath(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, "") || "/"
  if (trimmed === "/api/v1") return "/api"
  if (trimmed.startsWith("/api/v1/")) return `/api/${trimmed.slice("/api/v1/".length)}`
  return trimmed
}

export function policyForPath(pathname: string): RateLimitPolicy {
  const path = canonicalApiPath(pathname)
  if (path === "/api/export") return RATE_LIMIT_POLICIES.export
  if (path === "/api/icons" || path.startsWith("/api/icons/")) {
    return RATE_LIMIT_POLICIES.icons
  }
  return RATE_LIMIT_POLICIES.default
}

/**
 * RFC-style RateLimit fields (Limit/Remaining/Reset) plus the combined RateLimit
 * header. Remaining equals the advertised limit: this process does not share a
 * quota store with the Vercel WAF, which may still return 429.
 */
export function applyApiHeaders(
  headers: Headers,
  request: Request,
  status: number
): void {
  const policy = policyForPath(new URL(request.url).pathname)
  headers.set("API-Version", API_VERSION)
  headers.set("RateLimit-Limit", String(policy.limit))
  headers.set("RateLimit-Remaining", String(policy.limit))
  headers.set("RateLimit-Reset", String(policy.windowSec))
  headers.set("RateLimit-Policy", `${policy.limit};w=${policy.windowSec}`)
  headers.set(
    "RateLimit",
    `limit=${policy.limit}, remaining=${policy.limit}, reset=${policy.windowSec}`
  )
  if (status === 429) {
    headers.set("Retry-After", String(policy.windowSec))
  }
}
