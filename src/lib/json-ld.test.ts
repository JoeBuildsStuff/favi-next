import { describe, expect, it } from "vitest"

import { SITE_JSON_LD } from "@/lib/json-ld"

describe("SITE_JSON_LD", () => {
  it("names getfavi as the brand and points at the canonical domain", () => {
    const graph = SITE_JSON_LD["@graph"]
    const website = graph.find((node) => node["@type"] === "WebSite")
    expect(website?.name).toBe("getfavi")
    expect(website?.url).toContain("getfavi.vercel.app")
    const org = graph.find((node) => node["@type"] === "Organization")
    expect(org?.name).toBe("getfavi")
    expect(org?.sameAs).toContain("https://github.com/JoeBuildsStuff/favi-next")
    expect(org?.logo).toContain("opengraph-image")
    expect(org?.contactPoint?.url).toContain("github.com")
  })
})
