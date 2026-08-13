export type LibrarySlug = "lucide" | "tabler" | "phosphor" | "hugeicons" | "remix"

export type Library = {
  slug: LibrarySlug | string
  name: string
  license: string
  attribution_note: string
  icon_count: number
  styles: string[]
}

export type IconRecord = {
  id: number
  library: string
  name: string
  style: string
  tags: string
  file: string
}

export type IconItem = {
  id: number
  name: string
  style: string
  tags: string
  library: string
  library_name: string
  license: string
  svg: string
  attribution_note?: string
}

export type IconIndex = {
  generated_at: string
  libraries: Library[]
  icons: IconRecord[]
}

export type PlateShape = "rounded-square" | "circle" | "none"

export type ExportBody = {
  library?: string | null
  name?: string | null
  style?: string
  text?: string | null
  bg?: string | null
  fg?: string | null
  stroke?: string | null
  fill?: string | null
  padding?: number
  stroke_scale?: number
  shape?: PlateShape
  bg_mode?: "solid" | "linear"
  bg_to?: string | null
  bg_angle?: number
  include_dark_mode?: boolean
  dark_bg?: string | null
  dark_bg_to?: string | null
  dark_fg?: string | null
  dark_stroke?: string | null
  dark_fill?: string | null
  site_name?: string
}

export type FaviconSettings = {
  bg: string | null
  bgMode: "solid" | "linear"
  bgTo: string | null
  bgAngle: number
  fill: string | null
  stroke: string | null
  padding: number
  strokeScale: number
  shape: PlateShape
  includeDarkMode: boolean
  darkBg: string | null
  darkBgTo: string | null
  darkFill: string | null
  darkStroke: string | null
}

export const BRAND_BG = "#075985"
export const BRAND_BG_TO = "#082f49"

export const DEFAULT_FAVICON_SETTINGS: FaviconSettings = {
  bg: BRAND_BG,
  bgMode: "solid",
  bgTo: BRAND_BG_TO,
  bgAngle: 135,
  fill: null,
  stroke: "#ffffff",
  padding: 0.08,
  strokeScale: 0.8,
  shape: "rounded-square",
  includeDarkMode: false,
  darkBg: "#ffffff",
  darkBgTo: "#e2e8f0",
  darkFill: null,
  darkStroke: BRAND_BG,
}

export const APP_FAVICON = {
  library: "tabler",
  name: "icons",
  style: "outline",
} as const

export const DEFAULT_SITE_NAME = "favi"

export type ExportOptions = ExportBody
