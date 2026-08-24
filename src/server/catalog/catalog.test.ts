import fs from "node:fs"
import path from "node:path"

import { describe, expect, it } from "vitest"

import { getIcon, iconCount, listLibraries, searchIcons } from "@/server/catalog"

const INDEX_PATH = path.join(process.cwd(), "generated", "icon-index.json")
const hasIndex = fs.existsSync(INDEX_PATH)

describe.skipIf(!hasIndex)("catalog", () => {
  it("reports a non-zero icon count and libraries", () => {
    expect(iconCount()).toBeGreaterThan(0)
    expect(listLibraries().length).toBeGreaterThan(0)
  })

  it("returns svg thumbnails on the default page", () => {
    const page = searchIcons({ limit: 8 })
    expect(page.icons.length).toBeGreaterThan(0)
    expect(page.icons.length).toBeLessThanOrEqual(8)
    expect(page.total).toBeGreaterThan(page.icons.length)
    for (const icon of page.icons) {
      expect(icon.svg).toMatch(/<svg/i)
      expect(icon.name).toBeTruthy()
      expect(icon.library).toBeTruthy()
    }
  })

  it("finds common queries and can filter by library", () => {
    const home = searchIcons({ q: "home", limit: 12 })
    expect(home.total).toBeGreaterThan(0)
    expect(home.icons.some((icon) => icon.svg.includes("<svg"))).toBe(true)

    const libraries = listLibraries()
    const lucide = searchIcons({
      q: "home",
      library: libraries[0]?.slug ?? "lucide",
      limit: 4,
    })
    expect(lucide.icons.every((icon) => icon.library === libraries[0]?.slug || lucide.total === 0)).toBe(
      true
    )
  })

  it("looks up an exact icon from a search hit", () => {
    const page = searchIcons({ q: "arrow", limit: 1 })
    expect(page.icons[0]).toBeTruthy()
    const hit = page.icons[0]
    const exact = getIcon(hit.library, hit.name, hit.style)
    expect(exact).not.toBeNull()
    expect(exact?.svg).toBe(hit.svg)
    expect(exact?.name).toBe(hit.name)
  })
})
