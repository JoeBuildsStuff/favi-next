import type { PlateShape } from "@/shared/api-contract"

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
