"use client"

import { FaviconTile } from "@/components/favicon-tile"
import { useFaviconSelection } from "@/context/favicon-selection"
import {
  initialsFromSiteName,
  normalizeInitials,
  plateBackground,
  plateBorderRadius,
  DEFAULT_SITE_NAME,
} from "@/lib/favicon-settings"
import { cn } from "@/lib/utils"

export function EmptyPlateSwatch({
  shape,
  settings,
}: {
  shape: "rounded-square" | "circle" | "none"
  settings: Parameters<typeof plateBackground>[0]
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "size-7 shrink-0 border",
        shape === "none"
          ? "border-foreground/45 bg-transparent"
          : "border-transparent"
      )}
      style={{
        borderRadius: plateBorderRadius(shape),
        background: shape === "none" ? undefined : plateBackground(settings),
      }}
    />
  )
}

export function StyleSwatch({ mode }: { mode: "library" | "initials" }) {
  const { selected, settings, initialsText, siteName } = useFaviconSelection()
  const size = 28
  const letters =
    normalizeInitials(initialsText) ||
    initialsFromSiteName(siteName || DEFAULT_SITE_NAME)

  if (mode === "library") {
    if (!selected) {
      return <EmptyPlateSwatch shape={settings.shape} settings={settings} />
    }
    return (
      <span aria-hidden className="inline-flex shrink-0">
        <FaviconTile
          svg={selected.svg}
          settings={settings}
          size={size}
          className={cn(
            settings.shape === "none" && "ring-1 ring-foreground/25 ring-inset"
          )}
        />
      </span>
    )
  }

  return (
    <span aria-hidden className="inline-flex shrink-0">
      <FaviconTile
        letters={letters}
        settings={settings}
        size={size}
        className={cn(
          settings.shape === "none" && "ring-1 ring-foreground/25 ring-inset"
        )}
      />
    </span>
  )
}

export function ShapeSwatch({
  shape,
}: {
  shape: "rounded-square" | "circle" | "none"
}) {
  const { selected, settings, sourceMode, initialsText } = useFaviconSelection()
  const letters =
    sourceMode === "initials" ? normalizeInitials(initialsText) : ""
  const hasContent =
    sourceMode === "initials" ? letters.length > 0 : Boolean(selected)
  const paint = { ...settings, shape }
  const size = 28

  if (!hasContent) {
    return <EmptyPlateSwatch shape={shape} settings={paint} />
  }

  return (
    <span aria-hidden className="inline-flex shrink-0">
      <FaviconTile
        svg={selected?.svg}
        letters={letters || undefined}
        settings={paint}
        size={size}
        className={cn(
          shape === "none" && "ring-1 ring-foreground/25 ring-inset"
        )}
      />
    </span>
  )
}
