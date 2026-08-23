import { describe, expect, it } from "vitest"

import {
  API_VERSION,
  applyApiHeaders,
  canonicalApiPath,
  policyForPath,
} from "@/lib/rate-limit"

describe("API versioning paths", () => {
  it("maps /api/v1 to unversioned aliases", () => {
    expect(canonicalApiPath("/api/v1")).toBe("/api")
    expect(canonicalApiPath("/api/v1/health")).toBe("/api/health")
    expect(canonicalApiPath("/api/v1/icons/lucide/image")).toBe(
      "/api/icons/lucide/image"
    )
    expect(canonicalApiPath("/api/health")).toBe("/api/health")
  })
})

describe("rate limit policies", () => {
  it("uses export quota for POST export paths", () => {
    expect(policyForPath("/api/v1/export")).toEqual({
      name: "export",
      limit: 20,
      windowSec: 60,
    })
  })

  it("uses icons quota for search and lookup", () => {
    expect(policyForPath("/api/icons").limit).toBe(120)
    expect(policyForPath("/api/v1/icons/lucide/image").limit).toBe(120)
  })
})

describe("applyApiHeaders", () => {
  it("sets RFC RateLimit fields and API-Version", () => {
    const headers = new Headers()
    applyApiHeaders(
      headers,
      new Request("http://127.0.0.1:3000/api/v1/icons"),
      200
    )
    expect(headers.get("API-Version")).toBe(API_VERSION)
    expect(headers.get("RateLimit-Limit")).toBe("120")
    expect(headers.get("RateLimit-Remaining")).toBe("120")
    expect(headers.get("RateLimit-Reset")).toBe("60")
    expect(headers.get("RateLimit")).toMatch(/limit=120/)
    expect(headers.get("Retry-After")).toBeNull()
  })

  it("sets Retry-After on 429", () => {
    const headers = new Headers()
    applyApiHeaders(
      headers,
      new Request("http://127.0.0.1:3000/api/v1/export"),
      429
    )
    expect(headers.get("Retry-After")).toBe("60")
    expect(headers.get("RateLimit-Limit")).toBe("20")
  })
})
