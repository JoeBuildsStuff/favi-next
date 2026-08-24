import { describe, expect, it } from "vitest"

import type { IconItem } from "@/lib/api"
import { DEFAULT_FAVICON_SETTINGS } from "@/lib/favicon-settings"

import { buildFaviconExportRequest } from "./export-request"

const icon: IconItem = {
  id: 1,
  name: "star",
  style: "outline",
  tags: "",
  library: "lucide",
  library_name: "Lucide",
  license: "MIT",
  svg: "<svg></svg>",
}

describe("buildFaviconExportRequest", () => {
  it("builds a library zip payload and filename", () => {
    const request = buildFaviconExportRequest({
      selected: icon,
      settings: DEFAULT_FAVICON_SETTINGS,
      siteName: "Acme",
      sourceMode: "library",
      initialsText: "",
    })
    expect(request).not.toBeNull()
    expect(request?.filename).toBe("lucide-star-favicon.zip")
    expect(request?.body).toMatchObject({
      library: "lucide",
      name: "star",
      style: "outline",
      site_name: "Acme",
    })
  })

  it("builds an initials zip payload and filename", () => {
    const request = buildFaviconExportRequest({
      selected: null,
      settings: DEFAULT_FAVICON_SETTINGS,
      siteName: "Acme",
      sourceMode: "initials",
      initialsText: "JT",
    })
    expect(request).not.toBeNull()
    expect(request?.filename).toBe("initials-jt-favicon.zip")
    expect(request?.body.text).toBe("JT")
    expect(request?.body.library).toBeUndefined()
  })

  it("returns null when there is nothing to export", () => {
    expect(
      buildFaviconExportRequest({
        selected: null,
        settings: DEFAULT_FAVICON_SETTINGS,
        siteName: "Acme",
        sourceMode: "library",
        initialsText: "",
      })
    ).toBeNull()
  })
})
