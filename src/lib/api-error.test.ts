import { describe, expect, it } from "vitest"

import {
  API_ERROR_CATALOG,
  PROBLEM_JSON,
  problemDocument,
  problemResponse,
} from "@/lib/api-error"

describe("RFC 9457 problem responses", () => {
  it("includes type, status, code, message, and hint", () => {
    const problem = problemDocument("icon_not_found", "/api/icons/x/y")
    expect(problem.type).toContain("/docs/errors#icon_not_found")
    expect(problem.status).toBe(404)
    expect(problem.code).toBe("icon_not_found")
    expect(problem.detail.length).toBeGreaterThan(0)
    expect(problem.hint.length).toBeGreaterThan(0)
    expect(problem.title).toBe(API_ERROR_CATALOG.icon_not_found.title)
  })

  it("serializes as application/problem+json", async () => {
    const response = problemResponse(
      "invalid_json",
      new Request("http://127.0.0.1:3000/api/export", { method: "POST" })
    )
    expect(response.status).toBe(400)
    expect(response.headers.get("Content-Type")).toBe(PROBLEM_JSON)
    const body = await response.json()
    expect(body.code).toBe("invalid_json")
    expect(body.instance).toBe("/api/export")
    expect(body.hint).toMatch(/openapi/i)
  })

  it("adds Retry-After on rate_limited", () => {
    const response = problemResponse(
      "rate_limited",
      new Request("http://127.0.0.1:3000/api/v1/export", { method: "POST" })
    )
    expect(response.status).toBe(429)
    expect(response.headers.get("Retry-After")).toBe("60")
    expect(response.headers.get("RateLimit-Limit")).toBe("20")
  })
})
