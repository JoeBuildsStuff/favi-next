import { describe, expect, it } from "vitest"

import { GET as getUnknown, HEAD as headUnknown } from "@/app/api/[...path]/route"
import { GET as getExport, POST as postExport } from "@/app/api/export/route"
import { GET as getHealth } from "@/app/api/health/route"
import { GET as getApiIndex } from "@/app/api/route"
import { PROBLEM_JSON } from "@/lib/api-error"

describe("JSON API errors", () => {
  it("GET /api returns a JSON endpoint index", async () => {
    const response = getApiIndex(
      new Request("http://127.0.0.1:3000/api", { method: "GET" })
    )
    expect(response.headers.get("Content-Type")).toMatch(/application\/json/)
    const body = await response.json()
    expect(body.name).toMatch(/favi/i)
    expect(body.openapi).toContain("/openapi.json")
    expect(body.endpoints.length).toBeGreaterThan(0)
    expect(body.version).toBe("1")
    expect(response.headers.get("API-Version")).toBe("1")
    expect(response.headers.get("RateLimit-Limit")).toBeTruthy()
  })

  it("unknown /api paths return problem+json 404", async () => {
    const request = new Request("http://127.0.0.1:3000/api/does-not-exist")
    const response = getUnknown(request)
    expect(response.status).toBe(404)
    expect(response.headers.get("Content-Type")).toBe(PROBLEM_JSON)
    const body = await response.json()
    expect(body.code).toBe("not_found")
    expect(body.hint).toMatch(/\/api/)
  })

  it("HEAD unknown /api paths have no body", async () => {
    const response = headUnknown(
      new Request("http://127.0.0.1:3000/api/does-not-exist", { method: "HEAD" })
    )
    expect(response.status).toBe(404)
    expect(await response.text()).toBe("")
  })

  it("GET /api/export is 405 problem+json", async () => {
    const response = getExport(
      new Request("http://127.0.0.1:3000/api/export", { method: "GET" })
    )
    expect(response.status).toBe(405)
    expect(response.headers.get("Allow")).toContain("POST")
    const body = await response.json()
    expect(body.code).toBe("method_not_allowed")
  })

  it("POST /api/export with invalid JSON is 400 problem+json", async () => {
    const response = await postExport(
      new Request("http://127.0.0.1:3000/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{",
      })
    )
    expect(response.status).toBe(400)
    expect(response.headers.get("Content-Type")).toBe(PROBLEM_JSON)
    const body = await response.json()
    expect(body.code).toBe("invalid_json")
  })

  it("GET /api/v1/health matches GET /api/health and sends RateLimit headers", async () => {
    const unversioned = await getHealth(
      new Request("http://127.0.0.1:3000/api/health")
    )
    const versioned = await getHealth(
      new Request("http://127.0.0.1:3000/api/v1/health")
    )
    expect(unversioned.status).toBe(200)
    expect(versioned.status).toBe(200)
    expect(versioned.headers.get("API-Version")).toBe("1")
    expect(versioned.headers.get("RateLimit-Limit")).toBe("40")
    const a = await unversioned.json()
    const b = await versioned.json()
    expect(a.status).toBe("ok")
    expect(b.status).toBe("ok")
    expect(a.icons).toBe(b.icons)
  })
})
