import fs from "node:fs"
import path from "node:path"

import { expandQueryTokens, tokenizeQuery } from "@/lib/synonyms"
import type { IconIndex, IconItem, IconRecord, Library } from "@/lib/types"

const INDEX_PATH = path.join(process.cwd(), "generated", "icon-index.json")

type Catalog = {
  index: IconIndex
  byKey: Map<string, IconRecord>
}

declare global {
  var __faviCatalog: Catalog | undefined
}

function loadCatalog(): Catalog {
  if (globalThis.__faviCatalog) return globalThis.__faviCatalog
  if (!fs.existsSync(INDEX_PATH)) {
    throw new Error(
      "Icon index missing. Run `pnpm icons:index` from the project root."
    )
  }
  const index = JSON.parse(fs.readFileSync(INDEX_PATH, "utf8")) as IconIndex
  const byKey = new Map<string, IconRecord>()
  for (const icon of index.icons) {
    byKey.set(`${icon.library}/${icon.name}/${icon.style}`, icon)
    const fallback = `${icon.library}/${icon.name}`
    if (!byKey.has(fallback)) byKey.set(fallback, icon)
  }
  const catalog = { index, byKey }
  globalThis.__faviCatalog = catalog
  return catalog
}

export function iconCount(): number {
  return loadCatalog().index.icons.length
}

export function listLibraries(): Library[] {
  return loadCatalog().index.libraries
}

function libraryMeta(slug: string): Library | undefined {
  return loadCatalog().index.libraries.find((l) => l.slug === slug)
}

export function readSvg(record: IconRecord): string {
  const abs = path.join(process.cwd(), record.file)
  return fs.readFileSync(abs, "utf8")
}

function toItem(record: IconRecord, svg: string): IconItem {
  const lib = libraryMeta(record.library)
  return {
    id: record.id,
    name: record.name,
    style: record.style,
    tags: record.tags,
    library: record.library,
    library_name: lib?.name ?? record.library,
    license: lib?.license ?? "",
    attribution_note: lib?.attribution_note,
    svg,
  }
}

function haystack(record: IconRecord): string {
  return `${record.name} ${record.tags} ${record.style} ${record.library}`.toLowerCase()
}

export function searchIcons(opts: {
  q?: string
  library?: string | null
  style?: string | null
  limit?: number
  offset?: number
}): { total: number; limit: number; offset: number; icons: IconItem[] } {
  const catalog = loadCatalog()
  const limit = Math.min(300, Math.max(1, opts.limit ?? 96))
  const offset = Math.max(0, opts.offset ?? 0)
  const q = (opts.q ?? "").trim()
  const groups = expandQueryTokens(q)
  const primary = tokenizeQuery(q)

  let rows = catalog.index.icons
  if (opts.library) {
    rows = rows.filter((r) => r.library === opts.library)
  }
  if (opts.style) {
    rows = rows.filter((r) => r.style === opts.style)
  }
  if (groups.length) {
    rows = rows.filter((r) => {
      const hay = haystack(r)
      return groups.every((group) => group.some((term) => hay.includes(term)))
    })
    rows = [...rows].sort((a, b) => {
      const rank = (r: IconRecord) => {
        const name = r.name.toLowerCase()
        const tags = r.tags.toLowerCase()
        let score = 0
        for (const token of primary) {
          if (!name.includes(token)) score += 2
          if (!tags.includes(token)) score += 1
        }
        return score
      }
      const d = rank(a) - rank(b)
      if (d !== 0) return d
      return a.name.localeCompare(b.name) || a.library.localeCompare(b.library)
    })
  } else {
    rows = [...rows].sort(
      (a, b) =>
        a.name.localeCompare(b.name) || a.library.localeCompare(b.library)
    )
  }

  const total = rows.length
  const page = rows.slice(offset, offset + limit)
  const icons = page.map((record) => toItem(record, readSvg(record)))
  return { total, limit, offset, icons }
}

export function getIcon(
  library: string,
  name: string,
  style?: string | null
): IconItem | null {
  const catalog = loadCatalog()
  const key =
    style != null && style !== ""
      ? `${library}/${name}/${style}`
      : `${library}/${name}`
  const record = catalog.byKey.get(key)
  if (!record) return null
  return toItem(record, readSvg(record))
}
