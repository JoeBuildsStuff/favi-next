import type { ExportBody, IconItem } from "@/lib/types"
import {
  DEFAULT_SITE_NAME,
  normalizeInitials,
  type FaviconSettings,
  type FaviconSourceMode,
} from "@/lib/favicon-settings"

export type FaviconExportInput = {
  selected: IconItem | null
  settings: FaviconSettings
  siteName: string
  sourceMode: FaviconSourceMode
  initialsText: string
}

export type FaviconExportRequest = {
  body: ExportBody
  filename: string
}

export function buildFaviconExportRequest(
  input: FaviconExportInput
): FaviconExportRequest | null {
  const { selected, settings, siteName, sourceMode, initialsText } = input
  const letters = normalizeInitials(initialsText)
  if (sourceMode === "initials") {
    if (!letters) return null
  } else if (!selected) {
    return null
  }

  const shared: ExportBody = {
    bg:
      settings.bgMode === "solid" && settings.shape === "none" && !settings.bg
        ? null
        : settings.bg,
    fill: settings.fill,
    stroke: settings.stroke ?? "none",
    padding: settings.padding,
    stroke_scale: settings.strokeScale,
    shape: settings.shape,
    bg_mode: settings.bgMode,
    bg_to: settings.bgMode === "linear" ? settings.bgTo : undefined,
    bg_angle: settings.bgMode === "linear" ? settings.bgAngle : undefined,
    include_dark_mode: settings.includeDarkMode,
    dark_bg:
      settings.bgMode === "solid" &&
      settings.shape === "none" &&
      !settings.darkBg
        ? null
        : settings.darkBg,
    dark_bg_to: settings.bgMode === "linear" ? settings.darkBgTo : undefined,
    dark_fill: settings.darkFill,
    dark_stroke: settings.darkStroke ?? "none",
    site_name: siteName.trim() || DEFAULT_SITE_NAME,
  }

  if (sourceMode === "initials") {
    return {
      body: { ...shared, text: letters },
      filename: `initials-${letters.toLowerCase()}-favicon.zip`,
    }
  }

  return {
    body: {
      ...shared,
      library: selected!.library,
      name: selected!.name,
      style: selected!.style,
    },
    filename: `${selected!.library}-${selected!.name}-favicon.zip`,
  }
}
