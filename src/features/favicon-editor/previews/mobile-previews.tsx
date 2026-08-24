"use client"

import { Glyph } from "@/features/favicon-editor/glyph"
import { BrandBookmark } from "@/features/favicon-editor/previews/brand-bookmark"
import { WireAppIcon } from "@/features/favicon-editor/previews/wire-app-icon"
import { Button } from "@/components/ui/button"
import { useFaviconSelection } from "@/context/favicon-selection"
import {
  glyphColor,
  normalizeInitials,
  plateBackground,
  previewIconSvg,
} from "@/lib/favicon-settings"
import { BRAND_MARKS } from "@/lib/brand-mock-icons"

/** Soft-squircle mask used by iOS home-screen icons. */
export function AppleTouchIcon({ size }: { size: number }) {
  const { selected, settings, sourceMode, initialsText } = useFaviconSelection()
  const radius = size * 0.2237
  const letters =
    sourceMode === "initials" ? normalizeInitials(initialsText) : ""
  const useLetters = letters.length > 0
  const glyph =
    !useLetters && selected
      ? previewIconSvg(selected.svg, {
          fill: settings.fill,
          stroke: settings.stroke,
          strokeScale: settings.strokeScale,
        })
      : null
  const pad = (1 - 2 * settings.padding) * size
  const color = glyphColor(settings)
  const fontSize = pad * (letters.length <= 1 ? 0.85 : 0.58)

  return (
    <span
      className="relative inline-flex items-center justify-center overflow-hidden"
      style={{
        width: size,
        height: size,
        background: plateBackground(settings),
        borderRadius: radius,
      }}
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
          {letters}
        </span>
      ) : glyph ? (
        <span
          className="inline-flex [&_svg]:h-full [&_svg]:w-full"
          style={{
            width: pad,
            height: pad,
            color: settings.stroke ?? settings.fill ?? undefined,
          }}
          dangerouslySetInnerHTML={{ __html: glyph }}
        />
      ) : null}
    </span>
  )
}

export function PhoneHomeScreen({ siteName }: { siteName: string }) {
  const dock = ["Phone", "Safari", "Messages", "Mail"] as const

  return (
    <div
      className="mx-auto flex h-full overflow-hidden rounded-[28px] border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800"
      style={{ width: 240 }}
    >
      <div className="relative flex min-h-0 w-full flex-1 flex-col px-3 pt-2.5 pb-2">
        <div className="relative mb-4 flex h-6 shrink-0 items-center justify-between px-2 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
          <span className="w-10 tabular-nums">9:41</span>
          <span
            className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full bg-zinc-300 dark:bg-zinc-600"
            style={{ height: 18, width: 64 }}
          />
          <span className="flex w-10 items-center justify-end gap-1">
            <span className="h-1.5 w-3.5 rounded-sm border border-zinc-400 dark:border-zinc-500" />
          </span>
        </div>

        <div className="grid shrink-0 grid-cols-4 gap-x-2 gap-y-3 px-1">
          <div className="flex flex-col items-center gap-1">
            <AppleTouchIcon size={44} />
            <span className="w-full truncate text-center text-[9px] text-zinc-700 dark:text-zinc-200">
              {siteName}
            </span>
          </div>
          {BRAND_MARKS.map((brand) => (
            <div key={brand.id} className="flex flex-col items-center gap-1">
              <BrandBookmark mark={brand} size={44} shape="squircle" />
              <span className="w-full truncate text-center text-[9px] text-zinc-700 dark:text-zinc-200">
                {brand.label}
              </span>
            </div>
          ))}
        </div>

        {/* Grow to match Android launcher height */}
        <div className="min-h-3 flex-1" aria-hidden />

        <div className="flex shrink-0 justify-center gap-1.5 py-2">
          <span className="size-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
          <span className="size-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
          <span className="size-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
        </div>

        <div
          className="mx-0.5 flex shrink-0 justify-between bg-zinc-200/80 px-3.5 py-2.5 dark:bg-zinc-700/80"
          style={{ borderRadius: 20 }}
        >
          {dock.map((label) => (
            <WireAppIcon key={label} size={36} shape="squircle" />
          ))}
        </div>

        <div className="mt-2 flex shrink-0 justify-center pb-0.5">
          <span className="h-1 w-24 rounded-full bg-zinc-300 dark:bg-zinc-600" />
        </div>
      </div>
    </div>
  )
}

export function AndroidLauncher({ siteName }: { siteName: string }) {
  const dock = [
    { label: "Phone", round: true },
    { label: "Messages", round: true },
    { label: "Play", round: false },
    { label: "Camera", round: true },
  ] as const

  return (
    <div
      className="mx-auto flex h-full overflow-hidden rounded-[24px] border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800"
      style={{ width: 240 }}
    >
      <div className="relative flex min-h-0 w-full flex-1 flex-col px-3 pt-2 pb-2">
        <div className="mb-3 flex shrink-0 items-center justify-between px-2 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
          <span className="tabular-nums">9:41</span>
          <span className="h-1.5 w-3.5 rounded-sm border border-zinc-400 dark:border-zinc-500" />
        </div>

        <div className="mx-1 mb-4 flex shrink-0 items-center gap-2.5 rounded-full bg-white px-3 py-2 dark:bg-zinc-700">
          <span className="size-5 shrink-0 rounded-full bg-zinc-300 dark:bg-zinc-500" />
          <span className="flex-1 text-xs text-zinc-400 dark:text-zinc-500">
            Search
          </span>
          <span className="size-3.5 rounded-full bg-zinc-300 dark:bg-zinc-500" />
          <span className="size-3.5 rounded-full bg-zinc-300 dark:bg-zinc-500" />
        </div>

        <div className="grid shrink-0 grid-cols-4 gap-x-2 gap-y-3.5 px-1">
          <div className="flex flex-col items-center gap-1">
            <Glyph size={44} />
            <span className="w-full truncate text-center text-[9px] text-zinc-700 dark:text-zinc-200">
              {siteName}
            </span>
          </div>
          {BRAND_MARKS.map((brand) => (
            <div key={brand.id} className="flex flex-col items-center gap-1">
              <BrandBookmark mark={brand} size={44} shape="soft" />
              <span className="w-full truncate text-center text-[9px] text-zinc-700 dark:text-zinc-200">
                {brand.label}
              </span>
            </div>
          ))}
        </div>

        <div className="min-h-4 flex-1" aria-hidden />

        <div
          className="mx-1 mb-1 flex shrink-0 justify-between bg-zinc-200/80 px-3.5 py-3 dark:bg-zinc-700/80"
          style={{ borderRadius: 20 }}
        >
          {dock.map((app) => (
            <WireAppIcon
              key={app.label}
              size={36}
              shape={app.round ? "round" : "soft"}
            />
          ))}
        </div>

        <div className="mt-2 flex shrink-0 justify-center pb-0.5">
          <span className="h-1 w-20 rounded-full bg-zinc-300 dark:bg-zinc-600" />
        </div>
      </div>
    </div>
  )
}

export function PwaInstallBanner({ siteName }: { siteName: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-white p-3 dark:bg-zinc-900">
      <Glyph size={40} className="shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{siteName}</div>
        <div className="text-muted-foreground truncate text-xs">
          Install app · {siteName.toLowerCase().replace(/\s+/g, "")}.com
        </div>
      </div>
      <Button type="button" size="sm" className="pointer-events-none shrink-0">
        Install
      </Button>
    </div>
  )
}

/** W3C maskable safe zone ≈ circle with 80% of canvas diameter. */
export const MASKABLE_SAFE_RATIO = 0.8

export function MaskableSafeZoneCard({
  mask,
  label,
}: {
  mask: "circle" | "squircle"
  label: string
}) {
  const size = 112
  const safe = size * MASKABLE_SAFE_RATIO
  const inset = (size - safe) / 2
  const squircleRadius = safe * 0.2237
  const maskId = `maskable-${mask}`

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="relative overflow-hidden rounded-md border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900"
        style={{ width: size, height: size }}
      >
        <Glyph size={size} />
        <svg
          className="pointer-events-none absolute inset-0"
          width={size}
          height={size}
          aria-hidden
        >
          <defs>
            <mask id={maskId}>
              <rect width={size} height={size} fill="white" />
              {mask === "circle" ? (
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={safe / 2}
                  fill="black"
                />
              ) : (
                <rect
                  x={inset}
                  y={inset}
                  width={safe}
                  height={safe}
                  rx={squircleRadius}
                  fill="black"
                />
              )}
            </mask>
          </defs>
          <rect
            width={size}
            height={size}
            fill="rgb(9 9 11 / 0.55)"
            mask={`url(#${maskId})`}
          />
          {mask === "circle" ? (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={safe / 2}
              fill="none"
              stroke="rgb(255 255 255 / 0.85)"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
          ) : (
            <rect
              x={inset}
              y={inset}
              width={safe}
              height={safe}
              rx={squircleRadius}
              fill="none"
              stroke="rgb(255 255 255 / 0.85)"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
          )}
        </svg>
      </div>
      <span className="text-muted-foreground text-[10px]">{label}</span>
    </div>
  )
}

export function MaskableSafeZone() {
  return (
    <div className="flex flex-wrap items-end gap-8">
      <MaskableSafeZoneCard mask="circle" label="Circle · 80% safe zone" />
      <MaskableSafeZoneCard mask="squircle" label="Squircle · adaptive crop" />
    </div>
  )
}
