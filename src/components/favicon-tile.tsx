import type { CSSProperties } from "react"

import {
  glyphColor,
  normalizeInitials,
  plateBackground,
  plateBorderRadius,
  previewIconSvg,
  type FaviconSettings,
} from "@/lib/favicon-settings"
import { cn } from "@/lib/utils"

export function FaviconTile({
  svg,
  letters,
  settings,
  size,
  className,
}: {
  svg?: string
  letters?: string
  settings: FaviconSettings
  size: number
  className?: string
}) {
  const glyph = normalizeInitials(letters ?? "")
  const useLetters = glyph.length > 0
  const coloredSvg =
    !useLetters && svg
      ? previewIconSvg(svg, {
          fill: settings.fill,
          stroke: settings.stroke,
          strokeScale: settings.strokeScale,
        })
      : null
  const pad = (1 - 2 * settings.padding) * size
  const style: CSSProperties = {
    width: size,
    height: size,
    background: plateBackground(settings),
    borderRadius: plateBorderRadius(settings.shape),
  }
  const color = glyphColor(settings)
  const fontSize = pad * (glyph.length <= 1 ? 0.85 : 0.58)

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center overflow-hidden",
        className
      )}
      style={style}
    >
      {useLetters ? (
        <span
          className="inline-flex items-center justify-center font-bold leading-none select-none"
          style={{
            width: pad,
            height: pad,
            color,
            fontSize,
            fontFamily:
              "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          }}
          aria-hidden
        >
          {glyph}
        </span>
      ) : coloredSvg ? (
        <span
          className="inline-flex items-center justify-center [&_svg]:size-full!"
          style={{
            width: pad,
            height: pad,
            color: settings.stroke ?? settings.fill ?? undefined,
          }}
          dangerouslySetInnerHTML={{ __html: coloredSvg }}
        />
      ) : null}
    </span>
  )
}
