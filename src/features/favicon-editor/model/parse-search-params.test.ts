import { describe, expect, it } from "vitest"

import { parseFaviconConfigFromRecord } from "./parse-search-params"

describe("parseFaviconConfigFromRecord", () => {
  it("parses a deep-linked icon from a Next.js searchParams record", () => {
    const config = parseFaviconConfigFromRecord({
      library: "lucide",
      name: "star",
      style: "outline",
      site: "Acme",
    })
    expect(config.hasConfig).toBe(true)
    expect(config.icon).toEqual({
      library: "lucide",
      name: "star",
      style: "outline",
    })
    expect(config.siteName).toBe("Acme")
    expect(config.sourceMode).toBe("library")
  })

  it("uses the first value when a param is an array", () => {
    const config = parseFaviconConfigFromRecord({
      mode: ["initials", "library"],
      text: ["JT"],
    })
    expect(config.sourceMode).toBe("initials")
    expect(config.initialsText).toBe("JT")
  })

  it("returns defaults for an empty record", () => {
    const config = parseFaviconConfigFromRecord({})
    expect(config.hasConfig).toBe(false)
    expect(config.icon).toBeNull()
    expect(config.sourceMode).toBe("library")
  })
})
