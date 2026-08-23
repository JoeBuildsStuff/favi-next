import { describe, expect, it } from "vitest"

import { API_CATALOG, API_CATALOG_CONTENT_TYPE } from "@/lib/api-catalog"
import { OPENAPI_SPEC } from "@/lib/openapi"

describe("OPENAPI_SPEC", () => {
  it("describes the public favi HTTP API", () => {
    expect(OPENAPI_SPEC.openapi).toBe("3.1.0")
    expect(OPENAPI_SPEC.info.title).toMatch(/favi/i)
    expect(OPENAPI_SPEC.info.version).toBe("1.0.0")
    expect(OPENAPI_SPEC.paths).toHaveProperty("/api/v1/health")
    expect(OPENAPI_SPEC.paths).toHaveProperty("/api/v1/libraries")
    expect(OPENAPI_SPEC.paths).toHaveProperty("/api/v1/icons")
    expect(OPENAPI_SPEC.paths).toHaveProperty("/api/v1/icons/{library}/{name}")
    expect(OPENAPI_SPEC.paths).toHaveProperty("/api/v1/export")
    expect(OPENAPI_SPEC.paths).toHaveProperty("/api/health")
    expect(OPENAPI_SPEC.paths).toHaveProperty("/api/libraries")
    expect(OPENAPI_SPEC.paths).toHaveProperty("/api/icons")
    expect(OPENAPI_SPEC.paths).toHaveProperty("/api/icons/{library}/{name}")
    expect(OPENAPI_SPEC.paths).toHaveProperty("/api/export")
    expect(OPENAPI_SPEC.info.description).toMatch(/Sunset/)
    expect(OPENAPI_SPEC.components.parameters).toHaveProperty("ApiVersion")
    expect(OPENAPI_SPEC.components.headers).toHaveProperty("RateLimitLimit")
    expect(OPENAPI_SPEC.components.headers).toHaveProperty("RetryAfter")
    expect(OPENAPI_SPEC.components.headers).toHaveProperty("Sunset")
    expect(OPENAPI_SPEC.externalDocs?.url).toContain("/docs")
    expect(OPENAPI_SPEC.components.schemas).toHaveProperty("Problem")
    const problem = OPENAPI_SPEC.components.schemas.Problem
    expect(problem.required).toEqual(
      expect.arrayContaining(["type", "title", "status", "detail", "code", "hint"])
    )
    const exportErrors = OPENAPI_SPEC.paths["/api/v1/export"].post.responses
    for (const status of ["400", "404", "405", "429", "500"] as const) {
      expect(exportErrors[status].content["application/problem+json"].schema).toEqual(
        { $ref: "#/components/schemas/Problem" }
      )
    }
  })
})

describe("API_CATALOG", () => {
  it("is an RFC 9727 linkset pointing at OpenAPI and docs", () => {
    expect(API_CATALOG_CONTENT_TYPE).toContain("application/linkset+json")
    expect(API_CATALOG_CONTENT_TYPE).toContain("rfc9727")
    const [entry] = API_CATALOG.linkset
    expect(entry?.["service-desc"]?.[0]?.href).toContain("/openapi.json")
    expect(
      entry?.["service-doc"]?.some((link) => link.href.endsWith("/for-agents"))
    ).toBe(true)
    expect(entry?.["service-doc"]?.some((link) => link.href.endsWith("/docs"))).toBe(
      true
    )
    expect(
      entry?.["service-doc"]?.some((link) => link.href.endsWith("/docs/vercel"))
    ).toBe(true)
    expect(entry?.item?.some((link) => link.href.endsWith("/api/v1/export"))).toBe(
      true
    )
  })
})
