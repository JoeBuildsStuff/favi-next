import "server-only"

import fs from "node:fs"
import path from "node:path"

import { expandQueryTokens, tokenizeQuery } from "@/lib/synonyms"
import type { IconIndex, IconItem, IconRecord, Library } from "@/shared/api-contract"

const GENERATED_DIR = path.join(process.cwd(), "generated")
const INDEX_PATH = path.join(GENERATED_DIR, "icon-index.json")

type IndexedRecord = IconRecord & {
  searchHay: string
  nameLower: string
  tagsLower: string
}

type Catalog = {
  index: IconIndex
  icons: IndexedRecord[]
  defaultSorted: IndexedRecord[]
  byKey: Map<string, IndexedRecord>
  libraryBySlug: Map<string, Library>
}

const svgCache = new Map<string, string>()

function recordSearchHay(record: IconRecord): string {
  const raw =
    record.search ??
    `${record.name} ${record.tags} ${record.style} ${record.library}`
  return raw.toLowerCase()
}

function compareNameLibrary(a: IndexedRecord, b: IndexedRecord): number {
  return a.name.localeCompare(b.name) || a.library.localeCompare(b.library)
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
  const icons: IndexedRecord[] = index.icons.map((icon) => ({
    ...icon,
    searchHay: recordSearchHay(icon),
    nameLower: icon.name.toLowerCase(),
    tagsLower: icon.tags.toLowerCase(),
  }))
  const defaultSorted = icons.slice().sort(compareNameLibrary)
  const byKey = new Map<string, IndexedRecord>()
  for (const icon of icons) {
    byKey.set(`${icon.library}/${icon.name}/${icon.style}`, icon)
    const fallback = `${icon.library}/${icon.name}`
    if (!byKey.has(fallback)) byKey.set(fallback, icon)
  }
  const libraryBySlug = new Map<string, Library>()
  for (const lib of index.libraries) {
    libraryBySlug.set(lib.slug, lib)
  }
  const catalog: Catalog = {
    index,
    icons,
    defaultSorted,
    byKey,
    libraryBySlug,
  }
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
  return loadCatalog().libraryBySlug.get(slug)
}

export function readSvg(record: IconRecord): string {
  const relative = record.file.replace(/^generated[\\/]/, "")
  const abs = path.join(GENERATED_DIR, relative)
  const cached = svgCache.get(abs)
  if (cached !== undefined) return cached
  const svg = fs.readFileSync(abs, "utf8")
  svgCache.set(abs, svg)
  return svg
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

  let rows = catalog.defaultSorted
  if (opts.library) {
    rows = rows.filter((r) => r.library === opts.library)
  }
  if (opts.style) {
    rows = rows.filter((r) => r.style === opts.style)
  }
  if (groups.length) {
    rows = rows.filter((r) =>
      groups.every((group) => group.some((term) => r.searchHay.includes(term)))
    )
    rows.sort((a, b) => {
      const rank = (r: IndexedRecord) => {
        let score = 0
        for (const token of primary) {
          if (!r.nameLower.includes(token)) score += 2
          if (!r.tagsLower.includes(token)) score += 1
        }
        return score
      }
      const d = rank(a) - rank(b)
      if (d !== 0) return d
      return compareNameLibrary(a, b)
    })
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
