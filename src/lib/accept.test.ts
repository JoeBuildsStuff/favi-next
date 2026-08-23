import { describe, expect, it } from "vitest"

import {
  appendVaryAccept,
  markdownRewritePath,
  negotiate,
  preferredType,
} from "@/lib/accept"

describe("preferredType", () => {
  it("defaults to HTML when Accept is missing", () => {
    expect(preferredType(null)).toBe("text/html")
  })

  it("prefers markdown when it appears first at equal q", () => {
    expect(preferredType("text/markdown, text/html, */*")).toBe("text/markdown")
  })

  it("prefers HTML when the browser Accept list ranks it higher", () => {
    expect(
      preferredType(
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      )
    ).toBe("text/html")
  })

  it("honors q-values so markdown;q=0.2 loses to html", () => {
    expect(preferredType("text/html, text/markdown;q=0.2")).toBe("text/html")
  })

  it("rejects an explicit q=0 type even when a wildcard would match", () => {
    expect(preferredType("text/html;q=0, text/markdown;q=0, */*;q=1")).toBe(null)
  })

  it("returns null when the client rejects every produced type", () => {
    expect(preferredType("application/pdf")).toBe(null)
  })
})

describe("negotiate", () => {
  it("skips RSC flights", () => {
    expect(
      negotiate({
        method: "GET",
        pathname: "/",
        accept: "text/markdown",
        isRsc: true,
      })
    ).toBe("skip")
  })

  it("skips llms.txt so the static file is not rewritten", () => {
    expect(
      negotiate({
        method: "GET",
        pathname: "/llms.txt",
        accept: "text/markdown",
        isRsc: false,
      })
    ).toBe("skip")
  })

  it("skips generated Open Graph image routes", () => {
    expect(
      negotiate({
        method: "GET",
        pathname: "/opengraph-image",
        accept: "text/markdown",
        isRsc: false,
      })
    ).toBe("skip")
  })

  it("forces markdown for .md siblings", () => {
    expect(
      negotiate({
        method: "GET",
        pathname: "/for-agents.md",
        accept: "text/html",
        isRsc: false,
      })
    ).toBe("markdown")
  })

  it("returns 406 when Accept rejects HTML and markdown", () => {
    expect(
      negotiate({
        method: "GET",
        pathname: "/",
        accept: "application/pdf",
        isRsc: false,
      })
    ).toBe("406")
  })

  it("selects markdown for Accept: text/markdown", () => {
    expect(
      negotiate({
        method: "GET",
        pathname: "/",
        accept: "text/markdown",
        isRsc: false,
      })
    ).toBe("markdown")
  })
})

describe("appendVaryAccept", () => {
  it("adds Accept and Accept-Encoding without duplicating", () => {
    const headers = new Headers({ Vary: "rsc" })
    appendVaryAccept(headers)
    appendVaryAccept(headers)
    const tokens = headers
      .get("Vary")
      ?.split(",")
      .map((s) => s.trim().toLowerCase())
    expect(tokens).toContain("accept")
    expect(tokens).toContain("accept-encoding")
    expect(tokens?.filter((t) => t === "accept")).toHaveLength(1)
  })
})

describe("markdownRewritePath", () => {
  it("maps / and /index.md onto the markdown homepage handler", () => {
    expect(markdownRewritePath("/")).toBe("/api/markdown")
    expect(markdownRewritePath("/index.md")).toBe("/api/markdown")
    expect(markdownRewritePath("/for-agents.md")).toBe("/api/markdown/for-agents")
  })
})
