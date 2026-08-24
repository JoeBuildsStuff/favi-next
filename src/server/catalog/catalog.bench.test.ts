import { describe, it } from "vitest"

import { iconCount, searchIcons } from "@/server/catalog"

function fmtMs(ms: number): string {
  return `${ms.toFixed(1)}ms`
}

function fmtBytes(n: number): string {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KiB`
  return `${(n / 1024 / 1024).toFixed(2)} MiB`
}

describe.skipIf(!process.env.BENCH_CATALOG)("catalog bench", () => {
  it("prints load and search timings", () => {
    const before = process.memoryUsage()
    const loadStart = performance.now()
    const count = iconCount()
    const loadMs = performance.now() - loadStart
    const afterLoad = process.memoryUsage()

    console.log(`\nCatalog bench`)
    console.log(`  icons: ${count}`)
    console.log(`  cold load: ${fmtMs(loadMs)}`)
    console.log(
      `  memory after load: rss ${fmtBytes(afterLoad.rss)} (Δ ${fmtBytes(afterLoad.rss - before.rss)}), heap ${fmtBytes(afterLoad.heapUsed)} (Δ ${fmtBytes(afterLoad.heapUsed - before.heapUsed)})`
    )

    const cases: { label: string; q?: string; library?: string }[] = [
      { label: "empty query" },
      { label: "q=home", q: "home" },
      { label: "q=arrow", q: "arrow" },
      { label: "q=github", q: "github" },
      { label: "q=home library=lucide", q: "home", library: "lucide" },
    ]

    for (const c of cases) {
      const t0 = performance.now()
      const page = searchIcons({
        q: c.q,
        library: c.library,
        limit: 96,
        offset: 0,
      })
      const ms = performance.now() - t0
      const jsonBytes = Buffer.byteLength(JSON.stringify(page), "utf8")
      console.log(
        `  ${c.label}: ${fmtMs(ms)}  total=${page.total}  page=${page.icons.length}  json=${fmtBytes(jsonBytes)}`
      )
    }

    const warmStart = performance.now()
    searchIcons({ limit: 96 })
    console.log(
      `  empty query (warm svg cache): ${fmtMs(performance.now() - warmStart)}`
    )
  })
})
