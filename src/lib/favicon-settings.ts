import { normalizeHex } from "@/lib/color"
import {
  glyphColor,
  normalizeInitials,
  plateBackground,
  plateBorderRadius,
  recolorSvg,
} from "@/lib/favicon-svg"
import {
  APP_FAVICON,
  BRAND_BG,
  BRAND_BG_TO,
  DEFAULT_FAVICON_SETTINGS,
  DEFAULT_SITE_NAME,
  type FaviconSettings,
} from "@/lib/types"

export type { FaviconSettings }
export type FaviconSourceMode = "library" | "initials"

export type FaviconIconRef = {
  library: string
  name: string
  style: string
}

export type ParsedFaviconConfig = {
  hasConfig: boolean
  icon: FaviconIconRef | null
  settings: FaviconSettings
  siteName: string
  sourceMode: FaviconSourceMode
  initialsText: string
}

export {
  APP_FAVICON,
  BRAND_BG,
  BRAND_BG_TO,
  DEFAULT_FAVICON_SETTINGS,
  DEFAULT_SITE_NAME,
  glyphColor,
  normalizeInitials,
  plateBackground,
  plateBorderRadius,
}

export const previewIconSvg = recolorSvg

const SHAPES = new Set<FaviconSettings["shape"]>([
  "rounded-square",
  "circle",
  "none",
])

const BG_MODES = new Set<FaviconSettings["bgMode"]>(["solid", "linear"])

const CONFIG_PARAM_KEYS = [
  "library",
  "name",
  "style",
  "mode",
  "text",
  "bg",
  "bgMode",
  "bg_mode",
  "bgTo",
  "bg_to",
  "bgAngle",
  "bg_angle",
  "fill",
  "stroke",
  "padding",
  "strokeScale",
  "stroke_scale",
  "shape",
  "dark",
  "include_dark_mode",
  "darkBg",
  "dark_bg",
  "darkBgTo",
  "dark_bg_to",
  "darkFill",
  "dark_fill",
  "darkStroke",
  "dark_stroke",
  "site",
] as const

export function initialsFromSiteName(siteName: string): string {
  const parts = siteName
    .trim()
    .split(/\s+/)
    .map((p) => p.replace(/[^a-zA-Z0-9]/g, ""))
    .filter(Boolean)
  if (parts.length >= 2) {
    return normalizeInitials(parts[0][0] + parts[1][0])
  }
  return normalizeInitials(parts[0] ?? siteName) || "F"
}

export function settingsForScheme(
  settings: FaviconSettings,
  scheme: "light" | "dark"
): FaviconSettings {
  if (scheme !== "dark" || !settings.includeDarkMode) return settings
  return {
    ...settings,
    bg: settings.darkBg,
    bgTo: settings.darkBgTo,
    fill: settings.darkFill,
    stroke: settings.darkStroke,
  }
}

function parseColorParam(raw: string | null): string | null | undefined {
  if (raw == null || raw === "") return undefined
  const trimmed = raw.trim()
  if (trimmed === "none" || trimmed === "null") return null
  return normalizeHex(trimmed.startsWith("#") ? trimmed : `#${trimmed}`) ?? undefined
}

function formatColorParam(value: string | null): string {
  if (value == null) return "none"
  return (normalizeHex(value) ?? value).replace(/^#/, "")
}

function parseNumberParam(
  raw: string | null,
  min: number,
  max: number
): number | undefined {
  if (raw == null || raw === "") return undefined
  const n = Number(raw)
  if (!Number.isFinite(n)) return undefined
  return Math.min(max, Math.max(min, n))
}

function parseBoolParam(raw: string | null): boolean | undefined {
  if (raw == null || raw === "") return undefined
  const v = raw.trim().toLowerCase()
  if (v === "1" || v === "true" || v === "yes") return true
  if (v === "0" || v === "false" || v === "no") return false
  return undefined
}

export function parseFaviconConfigSearch(
  params: URLSearchParams
): ParsedFaviconConfig {
  const hasConfig = CONFIG_PARAM_KEYS.some((key) => params.has(key))

  const library = params.get("library")?.trim() || null
  const name = params.get("name")?.trim() || null
  const style = params.get("style")?.trim() || "outline"
  const icon =
    library && name ? { library, name, style: style || "outline" } : null

  const settings: FaviconSettings = { ...DEFAULT_FAVICON_SETTINGS }
  const bg = parseColorParam(params.get("bg"))
  if (bg !== undefined) settings.bg = bg
  const fill = parseColorParam(params.get("fill"))
  if (fill !== undefined) settings.fill = fill
  const stroke = parseColorParam(params.get("stroke"))
  if (stroke !== undefined) settings.stroke = stroke

  const bgModeRaw = (params.get("bgMode") ?? params.get("bg_mode"))?.trim()
  if (bgModeRaw && BG_MODES.has(bgModeRaw as FaviconSettings["bgMode"])) {
    settings.bgMode = bgModeRaw as FaviconSettings["bgMode"]
  }
  const bgTo = parseColorParam(params.get("bgTo") ?? params.get("bg_to"))
  if (bgTo !== undefined) settings.bgTo = bgTo
  const bgAngle = parseNumberParam(
    params.get("bgAngle") ?? params.get("bg_angle"),
    0,
    360
  )
  if (bgAngle !== undefined) settings.bgAngle = bgAngle

  const padding = parseNumberParam(params.get("padding"), 0, 0.4)
  if (padding !== undefined) settings.padding = padding
  const strokeScale = parseNumberParam(
    params.get("strokeScale") ?? params.get("stroke_scale"),
    0.5,
    3
  )
  if (strokeScale !== undefined) settings.strokeScale = strokeScale

  const shapeRaw = params.get("shape")?.trim()
  if (shapeRaw && SHAPES.has(shapeRaw as FaviconSettings["shape"])) {
    settings.shape = shapeRaw as FaviconSettings["shape"]
  }

  const dark = parseBoolParam(
    params.get("dark") ?? params.get("include_dark_mode")
  )
  if (dark !== undefined) settings.includeDarkMode = dark

  const darkBg = parseColorParam(params.get("darkBg") ?? params.get("dark_bg"))
  if (darkBg !== undefined) settings.darkBg = darkBg
  const darkBgTo = parseColorParam(
    params.get("darkBgTo") ?? params.get("dark_bg_to")
  )
  if (darkBgTo !== undefined) settings.darkBgTo = darkBgTo
  const darkFill = parseColorParam(
    params.get("darkFill") ?? params.get("dark_fill")
  )
  if (darkFill !== undefined) settings.darkFill = darkFill
  const darkStroke = parseColorParam(
    params.get("darkStroke") ?? params.get("dark_stroke")
  )
  if (darkStroke !== undefined) settings.darkStroke = darkStroke

  const siteRaw = params.get("site")?.trim()
  const siteName = siteRaw || DEFAULT_SITE_NAME

  const modeRaw = params.get("mode")?.trim().toLowerCase()
  const textRaw = params.get("text")?.trim() ?? ""
  const initialsText =
    normalizeInitials(textRaw) || initialsFromSiteName(siteName)
  const sourceMode: FaviconSourceMode =
    modeRaw === "initials" ||
    modeRaw === "letters" ||
    (textRaw !== "" && !icon)
      ? "initials"
      : "library"

  return { hasConfig, icon, settings, siteName, sourceMode, initialsText }
}

export function serializeFaviconConfigSearch(input: {
  icon: FaviconIconRef | null
  settings: FaviconSettings
  siteName: string
  sourceMode?: FaviconSourceMode
  initialsText?: string
}): string {
  const params = new URLSearchParams()
  const { icon, settings, siteName } = input
  const sourceMode = input.sourceMode ?? "library"
  const initialsText = normalizeInitials(input.initialsText ?? "")
  const defaults = DEFAULT_FAVICON_SETTINGS

  if (sourceMode === "initials") {
    params.set("mode", "initials")
    if (initialsText) params.set("text", initialsText)
  } else if (icon) {
    params.set("library", icon.library)
    params.set("name", icon.name)
    params.set("style", icon.style || "outline")
  }

  if (settings.bg !== defaults.bg) {
    params.set("bg", formatColorParam(settings.bg))
  }
  if (settings.bgMode !== defaults.bgMode) {
    params.set("bgMode", settings.bgMode)
  }
  if (settings.bgMode === "linear") {
    if (settings.bgTo !== defaults.bgTo) {
      params.set("bgTo", formatColorParam(settings.bgTo))
    }
    if (settings.bgAngle !== defaults.bgAngle) {
      params.set("bgAngle", String(settings.bgAngle))
    }
  }
  if (settings.fill !== defaults.fill) {
    params.set("fill", formatColorParam(settings.fill))
  }
  if (settings.stroke !== defaults.stroke) {
    params.set("stroke", formatColorParam(settings.stroke))
  }
  if (settings.padding !== defaults.padding) {
    params.set("padding", String(settings.padding))
  }
  if (settings.strokeScale !== defaults.strokeScale) {
    params.set("strokeScale", String(settings.strokeScale))
  }
  if (settings.shape !== defaults.shape) {
    params.set("shape", settings.shape)
  }
  if (settings.includeDarkMode !== defaults.includeDarkMode) {
    params.set("dark", settings.includeDarkMode ? "1" : "0")
  }
  if (settings.includeDarkMode) {
    if (settings.darkBg !== defaults.darkBg) {
      params.set("darkBg", formatColorParam(settings.darkBg))
    }
    if (settings.bgMode === "linear" && settings.darkBgTo !== defaults.darkBgTo) {
      params.set("darkBgTo", formatColorParam(settings.darkBgTo))
    }
    if (settings.darkFill !== defaults.darkFill) {
      params.set("darkFill", formatColorParam(settings.darkFill))
    }
    if (settings.darkStroke !== defaults.darkStroke) {
      params.set("darkStroke", formatColorParam(settings.darkStroke))
    }
  }

  const site = siteName.trim()
  if (site && site !== DEFAULT_SITE_NAME) {
    params.set("site", site)
  }

  return params.toString()
}

export function replaceFaviconConfigUrl(query: string): void {
  const path = window.location.pathname
  const hash = window.location.hash
  const next = query ? `${path}?${query}${hash}` : `${path}${hash}`
  const current = `${path}${window.location.search}${hash}`
  if (next !== current) {
    window.history.replaceState(window.history.state, "", next)
  }
}
