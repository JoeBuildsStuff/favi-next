import { describe, expect, it } from "vitest"

import { SITE, SITE_OG_IMAGE } from "@/lib/site"

describe("SITE", () => {
  it("advertises getfavi brand, contact, and an Open Graph image path", () => {
    expect(SITE.brand).toBe("getfavi")
    expect(SITE.url).toBe("https://getfavi.vercel.app")
    expect(SITE.contact).toContain("github.com/JoeBuildsStuff/favi-next")
    expect(SITE_OG_IMAGE.url).toBe("/opengraph-image")
    expect(SITE_OG_IMAGE.width).toBe(1200)
    expect(SITE_OG_IMAGE.height).toBe(630)
  })
})
