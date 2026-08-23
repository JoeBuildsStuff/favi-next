"use client"

import { useEffect, useMemo, useState, type MouseEvent } from "react"
import { SearchIcon, StarIcon } from "lucide-react"

import { fetchIcons, fetchLibraries, type IconItem, type Library } from "@/lib/api"
import { AppBrandHeader } from "@/components/app-brand-header"
import { FaviconTile } from "@/components/favicon-tile"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useFaviconSelection } from "@/context/favicon-selection"
import { useDebounced } from "@/hooks/use-debounced"
import {
  addRecent,
  entryToIconItem,
  isFavorite,
  loadIconHistory,
  sameIconRef,
  toggleFavorite,
  type IconHistoryEntry,
  type IconHistoryStore,
} from "@/lib/icon-history"
import { cn } from "@/lib/utils"

const LIMIT = 72

function filterHistoryEntries(
  entries: IconHistoryEntry[],
  query: string,
  libraryFilter: string,
  styleFilter: string
): IconHistoryEntry[] {
  const needle = query.trim().toLowerCase()
  return entries.filter((entry) => {
    if (libraryFilter !== "all" && entry.library !== libraryFilter) return false
    if (styleFilter !== "all" && entry.style !== styleFilter) return false
    if (!needle) return true
    return (
      entry.name.toLowerCase().includes(needle) ||
      entry.library.toLowerCase().includes(needle) ||
      entry.library_name.toLowerCase().includes(needle) ||
      entry.style.toLowerCase().includes(needle)
    )
  })
}

export function IconBrowserSidebar({
  className,
  onSelect,
}: {
  className?: string
  onSelect?: () => void
}) {
  const { selected, setSelected, settings, patchSettings, siteName, setSiteName } =
    useFaviconSelection()
  const [libraries, setLibraries] = useState<Library[]>([])
  const [icons, setIcons] = useState<
    Awaited<ReturnType<typeof fetchIcons>>["icons"]
  >([])
  const [total, setTotal] = useState(0)
  const [q, setQ] = useState("")
  const [library, setLibrary] = useState<string>("all")
  const [style, setStyle] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [offset, setOffset] = useState(0)
  const [history, setHistory] = useState<IconHistoryStore>(() => loadIconHistory())

  const debouncedQ = useDebounced(q, 250)

  const styleOptions = useMemo(() => {
    if (library === "all") {
      const all = new Set<string>()
      for (const lib of libraries) {
        for (const s of lib.styles) all.add(s)
      }
      return Array.from(all).sort()
    }
    return libraries.find((l) => l.slug === library)?.styles ?? []
  }, [libraries, library])

  const filteredFavorites = useMemo(
    () => filterHistoryEntries(history.favorites, q, library, style),
    [history.favorites, q, library, style]
  )
  const filteredRecents = useMemo(
    () => filterHistoryEntries(history.recents, q, library, style),
    [history.recents, q, library, style]
  )

  useEffect(() => {
    fetchLibraries()
      .then((data) => setLibraries(data.libraries))
      .catch((err: Error) => setError(err.message))
  }, [])

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const data = await fetchIcons({
          q: debouncedQ,
          library: library === "all" ? null : library,
          style: style === "all" ? null : style,
          limit: LIMIT,
          offset,
        })
        if (cancelled) return
        setIcons(data.icons)
        setTotal(data.total)
        setError(null)
        setLoading(false)
      } catch (err) {
        if (cancelled) return
        setError(err instanceof Error ? err.message : "Failed to load icons")
        setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [debouncedQ, library, style, offset])

  function setLibraryFilter(value: string) {
    setLibrary(value)
    setStyle("all")
    setOffset(0)
    setLoading(true)
  }

  function setStyleFilter(value: string) {
    setStyle(value)
    setOffset(0)
    setLoading(true)
  }

  function setQuery(value: string) {
    setQ(value)
    setOffset(0)
    setLoading(true)
  }

  function selectIcon(icon: IconItem) {
    setSelected(icon)
    setHistory(addRecent(icon, settings, siteName))
    onSelect?.()
  }

  function selectHistoryEntry(entry: IconHistoryEntry) {
    const icon = entryToIconItem(entry)
    setSelected(icon)
    patchSettings(entry.settings)
    setSiteName(entry.siteName)
    setHistory(addRecent(icon, entry.settings, entry.siteName))
    onSelect?.()
  }

  function onToggleFavorite(icon: IconItem, event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    const { store } = toggleFavorite(icon, settings, siteName)
    setHistory(store)
  }

  function onToggleFavoriteEntry(entry: IconHistoryEntry, event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    setHistory(
      toggleFavorite(entryToIconItem(entry), entry.settings, entry.siteName)
        .store
    )
  }

  return (
    <div className={cn("bg-sidebar text-sidebar-foreground flex h-full flex-col", className)}>
      <div className="flex flex-col gap-2 p-2">
        <AppBrandHeader />
        <div className="px-0.5">
          <p className="text-sm font-semibold tracking-tight">Icons</p>
          <p className="text-muted-foreground text-[11px]">
            {loading ? "Loading…" : `${total.toLocaleString()} matches`}
          </p>
        </div>
        <div className="relative">
          <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
          <Input
            value={q}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search icons…"
            className="h-8 pl-8"
            autoFocus
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Select
            value={library}
            onValueChange={(v) => setLibraryFilter(v ?? "all")}
          >
            <SelectTrigger className="w-full" size="sm">
              <SelectValue placeholder="Library" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All libraries</SelectItem>
              {libraries.map((lib) => (
                <SelectItem key={lib.slug} value={lib.slug}>
                  {lib.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={style}
            onValueChange={(v) => setStyleFilter(v ?? "all")}
          >
            <SelectTrigger className="w-full" size="sm">
              <SelectValue placeholder="Style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All styles</SelectItem>
              {styleOptions.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1" viewportClassName="scroll-fade">
        <div className="flex flex-col gap-3 p-2">
          {filteredFavorites.length > 0 ? (
            <HistorySection
              title="Favorites"
              entries={filteredFavorites}
              selected={selected}
              settings={settings}
              history={history}
              onSelect={selectHistoryEntry}
              onToggleFavorite={onToggleFavoriteEntry}
            />
          ) : null}

          {filteredRecents.length > 0 ? (
            <HistorySection
              title="Recent"
              entries={filteredRecents}
              selected={selected}
              settings={settings}
              history={history}
              onSelect={selectHistoryEntry}
              onToggleFavorite={onToggleFavoriteEntry}
            />
          ) : null}

          {(filteredFavorites.length > 0 || filteredRecents.length > 0) && (
            <div className="px-0.5">
              <p className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">
                Browse
              </p>
            </div>
          )}

          {error ? (
            <p className="text-destructive px-1 text-xs">{error}</p>
          ) : (
            <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4 lg:grid-cols-3">
              {icons.map((icon) => (
                <IconPickButton
                  key={icon.id}
                  icon={icon}
                  selected={sameIconRef(selected, icon)}
                  favorited={isFavorite(icon, history)}
                  settings={settings}
                  title={`${icon.library_name}: ${icon.name} (${icon.style})`}
                  onSelect={() => selectIcon(icon)}
                  onToggleFavorite={(e) => onToggleFavorite(icon, e)}
                />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="flex items-center justify-between gap-2 p-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex-1"
          disabled={offset === 0 || loading}
          onClick={() => {
            setLoading(true)
            setOffset(Math.max(0, offset - LIMIT))
          }}
        >
          Prev
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex-1"
          disabled={offset + LIMIT >= total || loading}
          onClick={() => {
            setLoading(true)
            setOffset(offset + LIMIT)
          }}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

function HistorySection({
  title,
  entries,
  selected,
  settings,
  history,
  onSelect,
  onToggleFavorite,
}: {
  title: string
  entries: IconHistoryEntry[]
  selected: IconItem | null
  settings: ReturnType<typeof useFaviconSelection>["settings"]
  history: IconHistoryStore
  onSelect: (entry: IconHistoryEntry) => void
  onToggleFavorite: (entry: IconHistoryEntry, event: MouseEvent) => void
}) {
  return (
    <section className="flex flex-col gap-1.5">
      <p className="text-muted-foreground px-0.5 text-[10px] font-medium tracking-wide uppercase">
        {title}
      </p>
      <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4 lg:grid-cols-3">
        {entries.map((entry) => {
          const icon = entryToIconItem(entry)
          return (
            <IconPickButton
              key={`${title}:${entry.library}:${entry.name}:${entry.style}`}
              icon={icon}
              selected={sameIconRef(selected, entry)}
              favorited={isFavorite(entry, history)}
              settings={settings}
              title={`${entry.library_name}: ${entry.name} (${entry.style})`}
              onSelect={() => onSelect(entry)}
              onToggleFavorite={(e) => onToggleFavorite(entry, e)}
            />
          )
        })}
      </div>
    </section>
  )
}

function IconPickButton({
  icon,
  selected,
  favorited,
  settings,
  title,
  onSelect,
  onToggleFavorite,
}: {
  icon: IconItem
  selected: boolean
  favorited: boolean
  settings: ReturnType<typeof useFaviconSelection>["settings"]
  title: string
  onSelect: () => void
  onToggleFavorite: (event: MouseEvent) => void
}) {
  return (
    <div
      className={cn(
        "group relative flex flex-col items-center gap-1 rounded-md border border-transparent p-1.5 transition-colors",
        "hover:bg-sidebar-accent",
        selected && "bg-sidebar-accent"
      )}
    >
      <button
        type="button"
        onClick={onSelect}
        className="flex w-full flex-col items-center gap-1"
        title={title}
      >
        <FaviconTile svg={icon.svg} settings={settings} size={32} />
        <span className="text-muted-foreground w-full truncate text-center text-[9px]">
          {icon.name}
        </span>
      </button>
      <button
        type="button"
        aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
        aria-pressed={favorited}
        onClick={onToggleFavorite}
        className={cn(
          "absolute top-0.5 right-0.5 rounded p-0.5 transition-opacity",
          "text-muted-foreground hover:text-foreground",
          favorited
            ? "text-amber-500 opacity-100 hover:text-amber-600"
            : "opacity-0 group-hover:opacity-100 focus-visible:opacity-100",
          selected && !favorited && "opacity-70"
        )}
      >
        <StarIcon
          className="size-3"
          fill={favorited ? "currentColor" : "none"}
        />
      </button>
    </div>
  )
}
