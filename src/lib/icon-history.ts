import type { IconItem } from "@/lib/api"
import {
  DEFAULT_FAVICON_SETTINGS,
  DEFAULT_SITE_NAME,
  type FaviconSettings,
} from "@/lib/favicon-settings"

export type IconHistoryEntry = {
  library: string
  name: string
  style: string
  library_name: string
  svg: string
  settings: FaviconSettings
  siteName: string
  updatedAt: number
}

export type IconHistoryStore = {
  version: 1
  recents: IconHistoryEntry[]
  favorites: IconHistoryEntry[]
}

const STORAGE_KEY = "favi:icon-history:v1"
const MAX_RECENTS = 18
const MAX_FAVORITES = 48

export function iconHistoryKey(icon: {
  library: string
  name: string
  style: string
}): string {
  return `${icon.library}:${icon.name}:${icon.style}`
}

function emptyStore(): IconHistoryStore {
  return { version: 1, recents: [], favorites: [] }
}

function normalizeSettings(value: unknown): FaviconSettings {
  if (!value || typeof value !== "object") {
    return { ...DEFAULT_FAVICON_SETTINGS }
  }
  const raw = value as Partial<FaviconSettings>
  const bgMode =
    raw.bgMode === "solid" || raw.bgMode === "linear"
      ? raw.bgMode
      : DEFAULT_FAVICON_SETTINGS.bgMode
  const bgAngle =
    typeof raw.bgAngle === "number" && Number.isFinite(raw.bgAngle)
      ? Math.min(360, Math.max(0, raw.bgAngle))
      : DEFAULT_FAVICON_SETTINGS.bgAngle
  return {
    ...DEFAULT_FAVICON_SETTINGS,
    ...raw,
    bg: raw.bg === undefined ? DEFAULT_FAVICON_SETTINGS.bg : raw.bg,
    bgMode,
    bgTo: raw.bgTo === undefined ? DEFAULT_FAVICON_SETTINGS.bgTo : raw.bgTo,
    bgAngle,
    fill: raw.fill === undefined ? DEFAULT_FAVICON_SETTINGS.fill : raw.fill,
    stroke:
      raw.stroke === undefined ? DEFAULT_FAVICON_SETTINGS.stroke : raw.stroke,
    darkBg:
      raw.darkBg === undefined ? DEFAULT_FAVICON_SETTINGS.darkBg : raw.darkBg,
    darkBgTo:
      raw.darkBgTo === undefined
        ? DEFAULT_FAVICON_SETTINGS.darkBgTo
        : raw.darkBgTo,
    darkFill:
      raw.darkFill === undefined
        ? DEFAULT_FAVICON_SETTINGS.darkFill
        : raw.darkFill,
    darkStroke:
      raw.darkStroke === undefined
        ? DEFAULT_FAVICON_SETTINGS.darkStroke
        : raw.darkStroke,
    includeDarkMode:
      typeof raw.includeDarkMode === "boolean"
        ? raw.includeDarkMode
        : DEFAULT_FAVICON_SETTINGS.includeDarkMode,
  }
}

function parseEntry(value: unknown): IconHistoryEntry | null {
  if (!value || typeof value !== "object") return null
  const e = value as Record<string, unknown>
  if (
    typeof e.library !== "string" ||
    typeof e.name !== "string" ||
    typeof e.style !== "string" ||
    typeof e.svg !== "string"
  ) {
    return null
  }
  const updatedAt =
    typeof e.updatedAt === "number" && Number.isFinite(e.updatedAt)
      ? e.updatedAt
      : Date.now()
  return {
    library: e.library,
    name: e.name,
    style: e.style,
    library_name:
      typeof e.library_name === "string" ? e.library_name : e.library,
    svg: e.svg,
    settings: normalizeSettings(e.settings),
    siteName: typeof e.siteName === "string" ? e.siteName : DEFAULT_SITE_NAME,
    updatedAt,
  }
}

/** Load history; invalid / missing / blocked storage → empty store. */
export function loadIconHistory(): IconHistoryStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyStore()
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== "object") return emptyStore()
    const data = parsed as Record<string, unknown>
    if (data.version !== 1) return emptyStore()
    if (!Array.isArray(data.recents) || !Array.isArray(data.favorites)) {
      return emptyStore()
    }
    return {
      version: 1,
      recents: data.recents
        .map(parseEntry)
        .filter((e): e is IconHistoryEntry => e != null),
      favorites: data.favorites
        .map(parseEntry)
        .filter((e): e is IconHistoryEntry => e != null),
    }
  } catch {
    return emptyStore()
  }
}

function saveIconHistory(store: IconHistoryStore): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch {
    // private mode / quota — fail quietly
  }
}

function toEntry(
  icon: IconItem,
  settings: FaviconSettings,
  siteName: string
): IconHistoryEntry {
  return {
    library: icon.library,
    name: icon.name,
    style: icon.style,
    library_name: icon.library_name,
    svg: icon.svg,
    settings: { ...settings },
    siteName,
    updatedAt: Date.now(),
  }
}

/** Convert a stored entry into a selectable IconItem (synthetic id). */
export function entryToIconItem(entry: IconHistoryEntry): IconItem {
  return {
    id: -Math.abs(
      Array.from(iconHistoryKey(entry)).reduce(
        (acc, ch) => (acc * 31 + ch.charCodeAt(0)) | 0,
        7
      )
    ),
    name: entry.name,
    style: entry.style,
    tags: "",
    library: entry.library,
    library_name: entry.library_name,
    license: "",
    svg: entry.svg,
  }
}

export function sameIconRef(
  a: { library: string; name: string; style: string } | null | undefined,
  b: { library: string; name: string; style: string } | null | undefined
): boolean {
  if (!a || !b) return false
  return a.library === b.library && a.name === b.name && a.style === b.style
}

export function isFavorite(
  icon: { library: string; name: string; style: string },
  store: IconHistoryStore = loadIconHistory()
): boolean {
  const key = iconHistoryKey(icon)
  return store.favorites.some((e) => iconHistoryKey(e) === key)
}

/** Push / bump an icon in recents (newest first). Caps list length. */
export function addRecent(
  icon: IconItem,
  settings: FaviconSettings,
  siteName: string
): IconHistoryStore {
  const store = loadIconHistory()
  const key = iconHistoryKey(icon)
  const entry = toEntry(icon, settings, siteName)
  store.recents = [
    entry,
    ...store.recents.filter((e) => iconHistoryKey(e) !== key),
  ].slice(0, MAX_RECENTS)
  saveIconHistory(store)
  return store
}

/**
 * Toggle favorite for an icon. When adding, snapshots current settings.
 * Returns the updated store and whether the icon is now favorited.
 */
export function toggleFavorite(
  icon: IconItem,
  settings: FaviconSettings,
  siteName: string
): { store: IconHistoryStore; favorited: boolean } {
  const store = loadIconHistory()
  const key = iconHistoryKey(icon)
  const existing = store.favorites.findIndex((e) => iconHistoryKey(e) === key)
  if (existing >= 0) {
    store.favorites = store.favorites.filter((_, i) => i !== existing)
    saveIconHistory(store)
    return { store, favorited: false }
  }
  const entry = toEntry(icon, settings, siteName)
  store.favorites = [entry, ...store.favorites].slice(0, MAX_FAVORITES)
  saveIconHistory(store)
  return { store, favorited: true }
}
