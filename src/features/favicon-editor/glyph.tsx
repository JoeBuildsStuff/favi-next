"use client"

import { FaviconTile } from "@/components/favicon-tile"
import { useFaviconSelection } from "@/context/favicon-selection"
import {
  normalizeInitials,
  plateBorderRadius,
  settingsForScheme,
} from "@/lib/favicon-settings"
import { cn } from "@/lib/utils"

export function Glyph({
  size,
  className,
  scheme = "light",
}: {
  size: number
  className?: string
  scheme?: "light" | "dark"
}) {
  const { selected, settings, sourceMode, initialsText } = useFaviconSelection()
  const paint = settingsForScheme(settings, scheme)
  const letters =
    sourceMode === "initials" ? normalizeInitials(initialsText) : ""
  if (sourceMode === "initials" ? !letters : !selected) {
    return (
      <span
        className={cn("bg-muted inline-block", className)}
        style={{
          width: size,
          height: size,
          borderRadius: plateBorderRadius(paint.shape),
        }}
      />
    )
  }
  return (
    <FaviconTile
      svg={selected?.svg}
      letters={letters || undefined}
      settings={paint}
      size={size}
      className={className}
    />
  )
}
