import { describe, expect, it } from "vitest"

import {
  blocksToHtml,
  blocksToMarkdown,
  blocksToPlainText,
  getAgentPage,
  homepageBlocks,
  markdownHeaders,
  nestBlocks,
  notFoundBlocks,
} from "@/lib/agent-pages"

describe("homepage crawler content", () => {
  it("has an H1 and nested headings that are not trapped in links", () => {
    const headings = homepageBlocks.filter((block) => block.type === "h")
    expect(headings[0]).toMatchObject({
      level: 1,
      text: "getfavi (favi) — favicon picker and HTTP API",
    })
    expect(headings.some((block) => block.type === "h" && block.level === 2)).toBe(
      true
    )
    expect(headings.some((block) => block.type === "h" && block.level === 3)).toBe(
      true
    )
  })

  it("exposes 500+ characters of readable text", () => {
    expect(blocksToPlainText(homepageBlocks).length).toBeGreaterThanOrEqual(500)
  })

  it("nests H2/H3 inside H1 sections in HTML", () => {
    const tree = nestBlocks(homepageBlocks)
    expect(tree).toHaveLength(1)
    const h1 = tree[0]
    expect(h1).toMatchObject({ type: "section", heading: { level: 1 } })
    if (h1?.type !== "section") throw new Error("expected section")
    expect(h1.children.some((node) => node.type === "section")).toBe(true)
    const html = blocksToHtml(homepageBlocks)
    expect(html).toMatch(/<article>[\s\S]*<section>[\s\S]*<h1>/)
    expect(html).toMatch(/<h1>[\s\S]*<section>[\s\S]*<h2>/)
    expect(html).toMatch(/<h2>[\s\S]*<section>[\s\S]*<h3>/)
  })
})

describe("getAgentPage", () => {
  it("serves developer resources at /for-agents and /docs", () => {
    const forAgents = getAgentPage("/for-agents")
    const docs = getAgentPage("/docs")
    expect(forAgents.status).toBe(200)
    expect(forAgents.title).toBe("favi developer resources")
    expect(docs.status).toBe(200)
    expect(docs.title).toBe("favi developer resources")
    expect(blocksToPlainText(forAgents.blocks)).toMatch(/OpenAPI/)
    expect(blocksToPlainText(forAgents.blocks)).toMatch(/getfavi\.vercel\.app/)
    expect(getAgentPage("/developers").title).toBe("favi developer resources")
    expect(getAgentPage("/getfavi").title).toBe("getfavi")
    expect(getAgentPage("/docs/vercel").title).toBe(
      "Vercel developer resources for favi"
    )
    expect(getAgentPage("/docs/auth").title).toBe(
      "favi authentication (auth docs)"
    )
    expect(getAgentPage("/docs/webhooks").title).toBe("favi webhooks")
    expect(getAgentPage("/docs/mcp").title).toBe("favi MCP server")
    expect(getAgentPage("/docs/openapi").title).toBe("favi OpenAPI spec")
    expect(getAgentPage("/docs/errors").title).toBe("favi API errors")
    expect(getAgentPage("/docs/api").title).toBe("favi API docs")
    expect(getAgentPage("/docs/versioning").title).toBe("favi REST versioning")
    expect(getAgentPage("/docs/rate-limits").title).toBe("favi rate limits")
  })

  it("returns a markdown recovery body for unknown paths", () => {
    const page = getAgentPage("/some-path-that-does-not-exist")
    expect(page.status).toBe(404)
    const markdown = blocksToMarkdown(page.blocks)
    expect(markdown).toMatch(/^# Page not found/m)
    expect(markdown).toContain("/llms.txt")
    expect(markdown).toContain("/sitemap.xml")
    expect(markdown).toContain("/for-agents")
  })

  it("treats /index.md as the homepage", () => {
    expect(getAgentPage("/index.md").status).toBe(200)
    expect(getAgentPage("/index.md").blocks).toEqual(homepageBlocks)
  })
})

describe("not-found recovery list", () => {
  it("points agents at sitemap, llms.txt, and developer resources", () => {
    const text = blocksToPlainText(notFoundBlocks)
    expect(text).toMatch(/llms\.txt/)
    expect(text).toMatch(/sitemap\.xml/)
    expect(text).toMatch(/favi developer resources/)
  })
})

describe("markdownHeaders", () => {
  it("sets text/markdown and Vary: Accept", () => {
    const headers = new Headers(markdownHeaders())
    expect(headers.get("Content-Type")).toBe("text/markdown; charset=utf-8")
    expect(headers.get("Vary")?.toLowerCase()).toContain("accept")
  })
})
