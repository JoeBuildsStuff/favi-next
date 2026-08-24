import type { ExportBody, PlateShape } from "@/shared/api-contract"
import type { FaviconSettings } from "@/shared/favicon/types"

const SHAPE_TAGS = new Set([
  "path",
  "circle",
  "rect",
  "ellipse",
  "line",
  "polyline",
  "polygon",
])

export type ComposeOpts = {
  bg: string | null
  fill: string | null
  stroke: string | null
  padding: number
  strokeScale: number
  shape: PlateShape
  bgMode: "solid" | "linear"
  bgTo: string | null
  bgAngle: number
  canvas?: number
}

export function normalizeInitials(text: string): string {
  return text.replace(/[^a-zA-Z0-9]/g, "").slice(0, 2).toUpperCase()
}

export function settingsToCompose(settings: FaviconSettings): ComposeOpts {
  return {
    bg: settings.bg,
    fill: settings.fill,
    stroke: settings.stroke,
    padding: settings.padding,
    strokeScale: settings.strokeScale,
    shape: settings.shape,
    bgMode: settings.bgMode,
    bgTo: settings.bgTo,
    bgAngle: settings.bgAngle,
  }
}

export function bodyToCompose(body: ExportBody): ComposeOpts {
  const stroke = body.stroke ?? body.fg ?? "#ffffff"
  return {
    bg: body.bg === undefined ? "#075985" : body.bg,
    fill: body.fill ?? null,
    stroke,
    padding: clamp(body.padding ?? 0.18, 0, 0.4),
    strokeScale: clamp(body.stroke_scale ?? 1.25, 0.5, 3),
    shape: body.shape ?? "rounded-square",
    bgMode: body.bg_mode ?? "solid",
    bgTo: body.bg_to ?? "#0f172a",
    bgAngle: clamp(body.bg_angle ?? 135, 0, 360),
  }
}

export function darkCompose(opts: ComposeOpts, body: ExportBody): ComposeOpts {
  return {
    ...opts,
    bg: body.dark_bg ?? "#ffffff",
    bgTo: body.dark_bg_to ?? "#e2e8f0",
    fill: body.dark_fill ?? null,
    stroke: body.dark_stroke ?? body.dark_fg ?? "#075985",
  }
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

function setAttr(tagOpen: string, name: string, value: string): string {
  const re = new RegExp(`${name}=(["'])[^"']*\\1`, "i")
  if (re.test(tagOpen)) return tagOpen.replace(re, `${name}="${value}"`)
  return tagOpen.replace(/\/?>$/, (end) => ` ${name}="${value}"${end}`)
}

export function recolorSvg(
  svg: string,
  opts: { fill: string | null; stroke: string | null; strokeScale: number }
): string {
  const fillColor = opts.fill?.trim() || null
  const strokeColor = opts.stroke?.trim() || null
  const current = strokeColor ?? fillColor ?? "#ffffff"
  let out = svg.replaceAll("currentColor", current)

  out = out.replace(/<svg\b[^>]*>/i, (open) => {
    let next = setAttr(open, "fill", fillColor ?? "none")
    next = setAttr(next, "stroke", strokeColor ?? "none")
    if (strokeColor && opts.strokeScale !== 1) {
      const m = /stroke-width=(["'])([^"']+)\1/i.exec(next)
      if (m) {
        const n = Number(m[2])
        if (Number.isFinite(n)) {
          next = setAttr(next, "stroke-width", String(n * opts.strokeScale))
        }
      }
    }
    return next
  })

  out = out.replace(
    /<(path|circle|rect|ellipse|line|polyline|polygon)\b[^>]*>/gi,
    (open) => {
      let next = open
      const fillVal = /\bfill=(["'])([^"']*)\1/i.exec(open)?.[2]
      const strokeVal = /\bstroke=(["'])([^"']*)\1/i.exec(open)?.[2]
      const tag = /^<(\w+)/.exec(open)?.[1]?.toLowerCase() ?? ""

      if (fillColor) {
        if (SHAPE_TAGS.has(tag) || (fillVal && fillVal !== "none")) {
          next = setAttr(next, "fill", fillColor)
        }
      } else if (fillVal && fillVal !== "none" && fillVal !== "transparent") {
        next = setAttr(next, "fill", strokeColor ?? "none")
      }

      if (strokeColor) {
        if (strokeVal && strokeVal !== "none") {
          next = setAttr(next, "stroke", strokeColor)
        }
        if (opts.strokeScale !== 1) {
          const sw = /stroke-width=(["'])([^"']+)\1/i.exec(next)
          if (sw) {
            const n = Number(sw[2])
            if (Number.isFinite(n)) {
              next = setAttr(next, "stroke-width", String(n * opts.strokeScale))
            }
          }
        }
      } else if (strokeVal && strokeVal !== "none") {
        next = setAttr(next, "stroke", "none")
      }
      return next
    }
  )
  return out
}

function platePaint(opts: ComposeOpts, canvas: number): { defs: string; fill: string } {
  if (opts.bgMode === "linear") {
    const from = opts.bg ?? "#075985"
    const to = opts.bgTo ?? "#082f49"
    const rad = ((opts.bgAngle - 90) * Math.PI) / 180
    const x1 = 50 - Math.cos(rad) * 50
    const y1 = 50 - Math.sin(rad) * 50
    const x2 = 50 + Math.cos(rad) * 50
    const y2 = 50 + Math.sin(rad) * 50
    const id = `plate-${canvas}`
    return {
      defs: `<defs><linearGradient id="${id}" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%"><stop offset="0%" stop-color="${from}"/><stop offset="100%" stop-color="${to}"/></linearGradient></defs>`,
      fill: `url(#${id})`,
    }
  }
  return { defs: "", fill: opts.bg ?? "" }
}

function plateShapeXml(opts: ComposeOpts, canvas: number, fill: string): string {
  if (!fill || opts.shape === "none") return ""
  if (opts.shape === "circle") {
    const r = canvas / 2
    return `<circle cx="${r}" cy="${r}" r="${r}" fill="${fill}"/>`
  }
  const radius = canvas * 0.22
  return `<rect width="${canvas}" height="${canvas}" rx="${radius}" ry="${radius}" fill="${fill}"/>`
}

export function composeIconSvg(svgRaw: string, opts: ComposeOpts): string {
  const canvas = opts.canvas ?? 32
  const pad = clamp(opts.padding, 0, 0.4)
  const inner = canvas * (1 - 2 * pad)
  const offset = canvas * pad
  const colored = recolorSvg(svgRaw, {
    fill: opts.fill,
    stroke: opts.stroke,
    strokeScale: opts.strokeScale,
  })
  const open = colored.match(/<svg\b[^>]*>/i)?.[0] ?? ""
  const vb = /viewBox=(["'])([^"']+)\1/i.exec(open)?.[2] ?? "0 0 24 24"
  const parts = vb.replace(/,/g, " ").trim().split(/\s+/).map(Number)
  const [vbX, vbY, vbW, vbH] =
    parts.length === 4 ? parts : [0, 0, 24, 24]
  const innerXml = colored
    .replace(/<\?xml[^>]*>/i, "")
    .replace(/<svg\b[^>]*>/i, "")
    .replace(/<\/svg>\s*$/i, "")
    .trim()
  const { defs, fill } = platePaint(opts, canvas)
  const rootFill = opts.fill ?? "none"
  const rootStroke = opts.stroke ?? "none"
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas}" height="${canvas}" viewBox="0 0 ${canvas} ${canvas}">`,
    defs,
    plateShapeXml(opts, canvas, fill),
    `<g transform="translate(${offset},${offset}) scale(${inner / vbW},${inner / vbH}) translate(${-vbX},${-vbY})" fill="${rootFill}" stroke="${rootStroke}">`,
    innerXml,
    `</g></svg>`,
  ].join("\n")
}

export function composeInitialsSvg(text: string, opts: ComposeOpts): string {
  const glyph = normalizeInitials(text)
  if (!glyph) throw new Error("text must contain 1–2 Latin letters or digits")
  const canvas = opts.canvas ?? 32
  const pad = clamp(opts.padding, 0, 0.4)
  const inner = canvas * (1 - 2 * pad)
  const fontSize = inner * (glyph.length === 1 ? 0.85 : 0.58)
  const cx = canvas / 2
  const cy = canvas / 2
  const textY = cy + fontSize * 0.35
  const color = opts.fill || opts.stroke || "#ffffff"
  const { defs, fill } = platePaint(opts, canvas)
  const safe = glyph.replaceAll("&", "&amp;").replaceAll("<", "&lt;")
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas}" height="${canvas}" viewBox="0 0 ${canvas} ${canvas}">`,
    defs,
    plateShapeXml(opts, canvas, fill),
    `<text x="${cx.toFixed(4)}" y="${textY.toFixed(4)}" text-anchor="middle" font-family="ui-sans-serif, system-ui, sans-serif" font-weight="700" font-size="${fontSize.toFixed(4)}" fill="${color}">${safe}</text>`,
    `</svg>`,
  ].join("\n")
}

export function plateBackground(settings: FaviconSettings): string {
  if (settings.bgMode === "linear") {
    const from = settings.bg ?? "#075985"
    const to = settings.bgTo ?? "#082f49"
    return `linear-gradient(${settings.bgAngle}deg, ${from}, ${to})`
  }
  return settings.bg ?? "transparent"
}

export function plateBorderRadius(shape: PlateShape): string {
  if (shape === "circle") return "9999px"
  if (shape === "rounded-square") return "22%"
  return "0"
}

export function glyphColor(settings: FaviconSettings): string {
  return settings.fill ?? settings.stroke ?? "#ffffff"
}
