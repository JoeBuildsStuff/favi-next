"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"

import { fetchIcon, type IconItem } from "@/lib/api"
import {
  APP_FAVICON,
  initialsFromSiteName,
  normalizeInitials,
  replaceFaviconConfigUrl,
  serializeFaviconConfigSearch,
  type FaviconIconRef,
  type FaviconSettings,
  type FaviconSourceMode,
  type ParsedFaviconConfig,
} from "@/lib/favicon-settings"

type FaviconSelectionContextValue = {
  selected: IconItem | null
  setSelected: (icon: IconItem | null) => void
  settings: FaviconSettings
  patchSettings: (next: Partial<FaviconSettings>) => void
  siteName: string
  setSiteName: (name: string) => void
  sourceMode: FaviconSourceMode
  setSourceMode: (mode: FaviconSourceMode) => void
  initialsText: string
  setInitialsText: (text: string) => void
  /** Set when a deep-linked icon could not be loaded. */
  selectionError: string | null
}

const FaviconSelectionContext = createContext<FaviconSelectionContextValue | null>(
  null
)

export function FaviconSelectionProvider({
  children,
  initialConfig,
}: {
  children: ReactNode
  initialConfig: ParsedFaviconConfig
}) {
  const [selected, setSelectedState] = useState<IconItem | null>(null)
  const [settings, setSettings] = useState<FaviconSettings>(
    () => initialConfig.settings
  )
  const [siteName, setSiteName] = useState(() => initialConfig.siteName)
  const [sourceMode, setSourceModeState] = useState<FaviconSourceMode>(
    () => initialConfig.sourceMode
  )
  const [initialsText, setInitialsTextState] = useState(
    () => initialConfig.initialsText
  )
  const [selectionError, setSelectionError] = useState<string | null>(null)
  const [urlReady, setUrlReady] = useState(false)
  /** Keeps deep-link identity in the URL if the fetch fails or is in flight. */
  const fallbackIconRef = useRef<FaviconIconRef | null>(initialConfig.icon)

  const setSelected = useCallback((icon: IconItem | null) => {
    setSelectionError(null)
    if (icon) {
      fallbackIconRef.current = {
        library: icon.library,
        name: icon.name,
        style: icon.style,
      }
      setSourceModeState("library")
    }
    setSelectedState(icon)
  }, [])

  const setSourceMode = useCallback(
    (mode: FaviconSourceMode) => {
      setSourceModeState(mode)
      if (mode === "initials") {
        setInitialsTextState((prev) => {
          const current = normalizeInitials(prev)
          if (current) return current
          return initialsFromSiteName(siteName)
        })
      }
    },
    [siteName]
  )

  const setInitialsText = useCallback((text: string) => {
    setInitialsTextState(normalizeInitials(text))
  }, [])

  useEffect(() => {
    let cancelled = false
    const fromUrl = initialConfig.icon
    const target = fromUrl ?? APP_FAVICON

    fetchIcon(target.library, target.name, target.style)
      .then((icon) => {
        if (cancelled) return
        setSelectedState((prev) => {
          if (prev) return prev
          fallbackIconRef.current = {
            library: icon.library,
            name: icon.name,
            style: icon.style,
          }
          return icon
        })
        setSelectionError(null)
      })
      .catch(() => {
        if (cancelled) return
        if (fromUrl) {
          setSelectionError(
            `Couldn’t load ${fromUrl.library}/${fromUrl.name} (${fromUrl.style}). Pick another icon.`
          )
        }
      })
      .finally(() => {
        if (!cancelled) setUrlReady(true)
      })

    return () => {
      cancelled = true
    }
  }, [initialConfig.icon])

  useEffect(() => {
    if (!urlReady) return
    const icon: FaviconIconRef | null = selected
      ? {
          library: selected.library,
          name: selected.name,
          style: selected.style,
        }
      : fallbackIconRef.current
    const query = serializeFaviconConfigSearch({
      icon,
      settings,
      siteName,
      sourceMode,
      initialsText,
    })
    replaceFaviconConfigUrl(query)
  }, [selected, settings, siteName, sourceMode, initialsText, urlReady])

  const patchSettings = useCallback((next: Partial<FaviconSettings>) => {
    setSettings((prev) => ({ ...prev, ...next }))
  }, [])

  const value = useMemo(
    () => ({
      selected,
      setSelected,
      settings,
      patchSettings,
      siteName,
      setSiteName,
      sourceMode,
      setSourceMode,
      initialsText,
      setInitialsText,
      selectionError,
    }),
    [
      selected,
      setSelected,
      settings,
      patchSettings,
      siteName,
      sourceMode,
      setSourceMode,
      initialsText,
      setInitialsText,
      selectionError,
    ]
  )

  return (
    <FaviconSelectionContext.Provider value={value}>
      {children}
    </FaviconSelectionContext.Provider>
  )
}

export function useFaviconSelection() {
  const ctx = useContext(FaviconSelectionContext)
  if (!ctx) {
    throw new Error("useFaviconSelection must be used within FaviconSelectionProvider")
  }
  return ctx
}
