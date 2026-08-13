#!/usr/bin/env node
/**
 * Build a metadata index from npm icon packs.
 * Hugeicons ships JS arrays — those are converted to SVG under generated/svgs.
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const NM = path.join(ROOT, "node_modules")
const OUT_DIR = path.join(ROOT, "generated")
const INDEX_PATH = path.join(OUT_DIR, "icon-index.json")
const HUGE_DIR = path.join(OUT_DIR, "svgs", "hugeicons")

const LIBRARIES = [
  {
    slug: "lucide",
    name: "Lucide",
    license: "ISC",
    attribution_note: "",
  },
  {
    slug: "tabler",
    name: "Tabler Icons",
    license: "MIT",
    attribution_note: "",
  },
  {
    slug: "phosphor",
    name: "Phosphor Icons",
    license: "MIT",
    attribution_note: "",
  },
  {
    slug: "hugeicons",
    name: "Hugeicons (free)",
    license: "MIT",
    attribution_note: "Free package only (@hugeicons/core-free-icons).",
  },
  {
    slug: "remix",
    name: "Remix Icon",
    license: "Remix Icon License v1.0",
    attribution_note: "Attribution appreciated: https://remixicon.com",
  },
]

const ifMissing = process.argv.includes("--if-missing")
if (ifMissing && fs.existsSync(INDEX_PATH)) {
  const existing = JSON.parse(fs.readFileSync(INDEX_PATH, "utf8"))
  console.log(`Index already exists (${existing.icons?.length ?? 0} icons). Skip.`)
  process.exit(0)
}

function rel(abs) {
  return path.relative(ROOT, abs).split(path.sep).join("/")
}

function normalizeName(stem) {
  let name = stem
  for (const suffix of [
    "-fill",
    "-line",
    "-bold",
    "-duotone",
    "-light",
    "-thin",
    "-regular",
  ]) {
    if (name.endsWith(suffix)) {
      name = name.slice(0, -suffix.length)
      break
    }
  }
  return name.toLowerCase().replace(/_/g, "-")
}

function camelToKebab(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/_/g, "-")
    .toLowerCase()
}

function walkSvgFiles(dir) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir).filter((n) => n.endsWith(".svg"))
}

function hugeiconsJsToSvg(jsText) {
  const match = jsText.match(/=\s*(\[[\s\S]*\]);?\s*export default/m)
  if (!match) return null
  let elements
  try {
    elements = Function(`"use strict"; return (${match[1]})`)()
  } catch {
    return null
  }
  if (!Array.isArray(elements)) return null
  const body = elements
    .map((el) => {
      if (!Array.isArray(el) || el.length < 2) return ""
      const [tag, props] = el
      const attrs = Object.entries(props || {})
        .filter(([k]) => k !== "key")
        .map(([k, v]) => {
          const kebab = k.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()
          return `${kebab}="${String(v)}"`
        })
        .join(" ")
      return `  <${tag} ${attrs} />`
    })
    .filter(Boolean)
    .join("\n")
  if (!body) return null
  return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">\n${body}\n</svg>`
}

const icons = []
let id = 1

function addIcon({ library, name, style, tags, file }) {
  icons.push({
    id: id++,
    library,
    name,
    style,
    tags,
    file,
  })
}

function ingestLucide() {
  const dir = path.join(NM, "lucide-static", "icons")
  let n = 0
  for (const fname of walkSvgFiles(dir)) {
    const name = normalizeName(path.basename(fname, ".svg"))
    addIcon({
      library: "lucide",
      name,
      style: "outline",
      tags: name.replace(/-/g, " "),
      file: rel(path.join(dir, fname)),
    })
    n++
  }
  return n
}

function ingestTabler() {
  const root = path.join(NM, "@tabler", "icons", "icons")
  let n = 0
  for (const style of fs.readdirSync(root)) {
    const styleDir = path.join(root, style)
    if (!fs.statSync(styleDir).isDirectory()) continue
    for (const fname of walkSvgFiles(styleDir)) {
      const name = normalizeName(path.basename(fname, ".svg"))
      addIcon({
        library: "tabler",
        name,
        style,
        tags: name.replace(/-/g, " "),
        file: rel(path.join(styleDir, fname)),
      })
      n++
    }
  }
  return n
}

function ingestPhosphor() {
  const root = path.join(NM, "@phosphor-icons", "core", "assets")
  let n = 0
  for (const style of fs.readdirSync(root)) {
    const styleDir = path.join(root, style)
    if (!fs.statSync(styleDir).isDirectory()) continue
    for (const fname of walkSvgFiles(styleDir)) {
      let name = normalizeName(path.basename(fname, ".svg"))
      if (name.endsWith(`-${style}`)) {
        name = name.slice(0, -(style.length + 1))
      }
      addIcon({
        library: "phosphor",
        name,
        style,
        tags: name.replace(/-/g, " "),
        file: rel(path.join(styleDir, fname)),
      })
      n++
    }
  }
  return n
}

function ingestRemix() {
  const root = path.join(NM, "remixicon", "icons")
  let n = 0
  for (const category of fs.readdirSync(root)) {
    const catDir = path.join(root, category)
    if (!fs.statSync(catDir).isDirectory()) continue
    for (const fname of walkSvgFiles(catDir)) {
      const stem = path.basename(fname, ".svg")
      let style = "default"
      let name = stem
      if (stem.endsWith("-fill")) {
        style = "fill"
        name = stem.slice(0, -"-fill".length)
      } else if (stem.endsWith("-line")) {
        style = "line"
        name = stem.slice(0, -"-line".length)
      }
      name = normalizeName(name)
      addIcon({
        library: "remix",
        name,
        style,
        tags: `${name.replace(/-/g, " ")} ${category.toLowerCase()}`,
        file: rel(path.join(catDir, fname)),
      })
      n++
    }
  }
  return n
}

function ingestHugeicons() {
  const dir = path.join(NM, "@hugeicons", "core-free-icons", "dist", "esm")
  fs.mkdirSync(HUGE_DIR, { recursive: true })
  let n = 0
  for (const fname of fs.readdirSync(dir)) {
    if (!fname.endsWith("Icon.js")) continue
    let raw = fname.slice(0, -".js".length)
    if (raw.endsWith("Icon")) raw = raw.slice(0, -"Icon".length)
    const name = normalizeName(camelToKebab(raw))
    const jsText = fs.readFileSync(path.join(dir, fname), "utf8")
    const svg = hugeiconsJsToSvg(jsText)
    if (!svg) continue
    const out = path.join(HUGE_DIR, `${name}.svg`)
    fs.writeFileSync(out, svg)
    addIcon({
      library: "hugeicons",
      name,
      style: "stroke-rounded",
      tags: name.replace(/-/g, " "),
      file: rel(out),
    })
    n++
  }
  return n
}

const ingestors = {
  lucide: ingestLucide,
  tabler: ingestTabler,
  phosphor: ingestPhosphor,
  hugeicons: ingestHugeicons,
  remix: ingestRemix,
}

const libraries = []
for (const lib of LIBRARIES) {
  console.log(`Indexing ${lib.slug}…`)
  const n = ingestors[lib.slug]()
  const styles = [
    ...new Set(icons.filter((i) => i.library === lib.slug).map((i) => i.style)),
  ].sort()
  libraries.push({ ...lib, icon_count: n, styles })
  console.log(`  ${n} icons`)
}

fs.mkdirSync(OUT_DIR, { recursive: true })
const payload = {
  generated_at: new Date().toISOString(),
  libraries,
  icons,
}
fs.writeFileSync(INDEX_PATH, JSON.stringify(payload))
const mb = (fs.statSync(INDEX_PATH).size / 1024 / 1024).toFixed(2)
console.log(`Done. ${icons.length} icons → ${rel(INDEX_PATH)} (${mb} MiB)`)
