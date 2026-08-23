import { describe, expect, it } from "vitest"

import { GET as getUnknown, HEAD as headUnknown } from "@/app/api/[...path]/route"
import { GET as getApiIndex } from "@/app/api/route"
import { GET as getExport, POST as postExport } from "@/app/api/export/route"
import { PROBLEM_JSON } from "@/lib/api-error"

describe("JSON API errors", () => {
  it("GET /api returns a JSON endpoint index", async () => {
    const response = getApiIndex()
    expect(response.headers.get("Content-Type")).toMatch(/application\/json/)
    const body = await response.json()
    expect(body.name).toMatch(/favi/i)
    expect(body.openapi).toContain("/openapi.json")
    expect(body.endpoints.length).toBeGreaterThan(0)
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
})
