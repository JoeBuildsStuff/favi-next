import { describe, expect, it } from "vitest"

import { API_CATALOG, API_CATALOG_CONTENT_TYPE } from "@/lib/api-catalog"
import { OPENAPI_SPEC } from "@/lib/openapi"

describe("OPENAPI_SPEC", () => {
  it("describes the public favi HTTP API", () => {
    expect(OPENAPI_SPEC.openapi).toBe("3.1.0")
    expect(OPENAPI_SPEC.info.title).toMatch(/favi/i)
    expect(OPENAPI_SPEC.paths).toHaveProperty("/api/health")
    expect(OPENAPI_SPEC.paths).toHaveProperty("/api/libraries")
    expect(OPENAPI_SPEC.paths).toHaveProperty("/api/icons")
    expect(OPENAPI_SPEC.paths).toHaveProperty("/api/icons/{library}/{name}")
    expect(OPENAPI_SPEC.paths).toHaveProperty("/api/export")
    expect(OPENAPI_SPEC.externalDocs?.url).toContain("/docs")
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
    expect(entry?.item?.some((link) => link.href.endsWith("/api/export"))).toBe(
      true
    )
  })
})
