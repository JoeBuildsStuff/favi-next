"use client"

import { useEffect, useState, type ReactNode } from "react"
import { CheckIcon, CopyIcon, DownloadIcon, SidebarIcon } from "lucide-react"

import { exportFaviconZip } from "@/lib/api"
import { FaviconTile } from "@/components/favicon-tile"
import { IconBrowserSidebar } from "@/components/icon-browser-sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ColorPicker } from "@/components/ui/color-picker"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useFaviconSelection } from "@/context/favicon-selection"
import {
  BRAND_BG,
  BRAND_BG_TO,
  glyphColor,
  initialsFromSiteName,
  normalizeInitials,
  plateBackground,
  plateBorderRadius,
  previewIconSvg,
  settingsForScheme,
  DEFAULT_SITE_NAME,
} from "@/lib/favicon-settings"
import {
  BOOKMARK_BRANDS,
  BRAND_MARKS,
  CROWDED_TAB_BRANDS,
  type BrandMark,
  type BrandMarkId,
} from "@/lib/brand-mock-icons"
import { buildInstallPrompt } from "@/lib/install-prompt"
import { cn } from "@/lib/utils"

const BRAND_BY_ID = Object.fromEntries(
  BRAND_MARKS.map((b) => [b.id, b])
) as Record<BrandMarkId, BrandMark>

function Glyph({
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

/** Tabler brand marks mocked as tiny favicon plates for browser / home screens. */
function BrandBookmark({
  mark,
  size,
  shape = "rounded",
}: {
  mark: BrandMarkId | BrandMark
  size: number
  shape?: "rounded" | "squircle" | "soft" | "round"
}) {
  const brand = typeof mark === "string" ? BRAND_BY_ID[mark] : mark
  const pad =
    size *
    (size >= 40 ? 0.58 : 0.72) *
    (brand.glyphScale ?? 1)
  const radius =
    shape === "round"
      ? "50%"
      : shape === "squircle"
        ? size * 0.2237
        : "22%"
  const strokeWidth = size >= 40 ? 1.6 : 2

  return (
    <span
      className="inline-flex shrink-0 items-center justify-center overflow-hidden"
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: brand.bg,
        color: brand.fg,
      }}
      aria-hidden
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={pad}
        height={pad}
        fill={brand.filled ? "currentColor" : "none"}
        stroke={brand.filled ? "none" : "currentColor"}
        strokeWidth={brand.filled ? 0 : strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {brand.paths.map((d) => (
          <path key={d} d={d} />
        ))}
      </svg>
    </span>
  )
}

/** Soft-squircle mask used by iOS home-screen icons. */
function AppleTouchIcon({ size }: { size: number }) {
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

function MockLabel({
  children,
  subtitle,
}: {
  children: ReactNode
  subtitle: string
}) {
  return (
    <div className="mb-3">
      <p className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">
        {children}
      </p>
      <p className="text-muted-foreground mt-1 max-w-xl text-[11px] leading-snug">
        {subtitle}
      </p>
    </div>
  )
}

function BrowserChrome({
  tone,
  siteName,
}: {
  tone: "light" | "dark"
  siteName: string
}) {
  const dark = tone === "dark"
  const hostname = `${siteName.toLowerCase().replace(/\s+/g, "")}.com`

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border",
        dark ? "border-zinc-700 bg-zinc-800" : "border-zinc-200 bg-zinc-100"
      )}
    >
      <div
        className={cn(
          "flex items-end gap-0 px-2 pt-2",
          dark ? "bg-zinc-800" : "bg-zinc-200/80"
        )}
      >
        <div className="mb-2 flex gap-1.5 px-1">
          <span className={cn("size-2.5 rounded-full", dark ? "bg-zinc-600" : "bg-zinc-300")} />
          <span className={cn("size-2.5 rounded-full", dark ? "bg-zinc-600" : "bg-zinc-300")} />
          <span className={cn("size-2.5 rounded-full", dark ? "bg-zinc-600" : "bg-zinc-300")} />
        </div>
        <div className="ml-2 flex min-w-0 flex-1 items-end gap-0.5 overflow-hidden">
          <div
            className={cn(
              "flex max-w-[9.5rem] items-center gap-1.5 rounded-t-lg px-2.5 py-1.5 text-[11px]",
              dark ? "bg-zinc-700 text-zinc-100" : "bg-white text-zinc-800"
            )}
          >
            <Glyph size={14} className="shrink-0" scheme={tone} />
            <span className="truncate">{siteName}</span>
            <span className={cn("ml-0.5 text-[9px]", dark ? "text-zinc-400" : "text-zinc-400")}>
              ×
            </span>
          </div>
          <div
            className={cn(
              "flex max-w-[7rem] items-center gap-1.5 rounded-t-md px-2 py-1.5 text-[11px] opacity-70",
              dark ? "text-zinc-300" : "text-zinc-600"
            )}
          >
            <span
              className={cn(
                "size-3.5 shrink-0 rounded-sm",
                dark ? "bg-zinc-600" : "bg-zinc-300"
              )}
            />
            <span className="truncate">Docs</span>
          </div>
          <div
            className={cn(
              "mb-1.5 flex size-5 shrink-0 items-center justify-center rounded text-xs",
              dark ? "text-zinc-400" : "text-zinc-500"
            )}
          >
            +
          </div>
        </div>
      </div>

      <div className={cn("px-3 py-2", dark ? "bg-zinc-700" : "bg-white")}>
        <div
          className={cn(
            "flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px]",
            dark ? "bg-zinc-800 text-zinc-300" : "bg-zinc-100 text-zinc-600"
          )}
        >
          <Glyph size={14} className="shrink-0" scheme={tone} />
          <span className="truncate">
            <span className={dark ? "text-zinc-500" : "text-zinc-400"}>https://</span>
            {hostname}
          </span>
        </div>
      </div>

      <div
        className={cn(
          "flex items-center gap-3 overflow-x-auto border-t px-3 py-1.5 [scrollbar-width:none]",
          dark ? "border-zinc-600 bg-zinc-700" : "border-zinc-100 bg-white"
        )}
      >
        <span className="text-muted-foreground text-[10px]">Bookmarks</span>
        <span
          className={cn(
            "flex shrink-0 items-center gap-1 text-[11px]",
            dark ? "text-zinc-300" : "text-zinc-700"
          )}
        >
          <Glyph size={12} scheme={tone} />
          {siteName}
        </span>
        {BOOKMARK_BRANDS.map((id) => {
          const brand = BRAND_BY_ID[id]
          return (
            <span
              key={id}
              className={cn(
                "flex shrink-0 items-center gap-1 text-[11px]",
                dark ? "text-zinc-300" : "text-zinc-700"
              )}
            >
              <BrandBookmark mark={brand} size={12} />
              {brand.label}
            </span>
          )
        })}
      </div>

      <div
        className={cn(
          "h-28 px-4 py-3",
          dark ? "bg-zinc-900" : "bg-zinc-50"
        )}
      >
        <div
          className={cn(
            "mb-2 h-3 w-1/3 rounded",
            dark ? "bg-zinc-700" : "bg-zinc-200"
          )}
        />
        <div
          className={cn(
            "mb-1.5 h-2 w-full rounded",
            dark ? "bg-zinc-800" : "bg-zinc-200/80"
          )}
        />
        <div
          className={cn(
            "h-2 w-4/5 rounded",
            dark ? "bg-zinc-800" : "bg-zinc-200/80"
          )}
        />
      </div>
    </div>
  )
}

/** Real SERP copy for brands stacked under the user's Google-style result. */
const COMPARISON_SEARCH_RESULTS: {
  brandId: BrandMarkId
  url: string
  title: string
  description: ReactNode
}[] = [
  {
    brandId: "supabase",
    url: "https://supabase.com",
    title: "Supabase | The Postgres Development Platform",
    description:
      "Build production-grade applications with a Postgres database, Authentication, instant APIs, Realtime, Functions, Storage and Vector embeddings.",
  },
  {
    brandId: "vercel",
    url: "https://vercel.com",
    title: "Vercel: Agentic Infrastructure",
    description: (
      <>
        <span className="font-medium text-zinc-700 dark:text-zinc-300">
          Ship apps that scale from zero to millions instantly
        </span>
        {" · Features · Global Delivery · Deployment Environments · Serverless Functions · Web Application Firewall …"}
      </>
    ),
  },
]

function SearchResultFavicon({ children }: { children: ReactNode }) {
  // Real Google SERPs put the favicon in a ~28px circle; the glyph is ~16–18px.
  return (
    <span className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-100 ring-1 ring-zinc-200/80 dark:bg-zinc-800 dark:ring-zinc-700">
      {children}
    </span>
  )
}

function SearchResultRow({
  siteName,
  url,
  title,
  description,
  favicon,
}: {
  siteName: string
  url: string
  title: string
  description: ReactNode
  favicon: ReactNode
}) {
  return (
    <div className="text-left">
      <div className="mb-1.5 flex items-center gap-3">
        {favicon}
        <div className="min-w-0 leading-tight">
          <div className="truncate text-sm text-zinc-900 dark:text-zinc-100">
            {siteName}
          </div>
          <div className="truncate text-xs text-zinc-600 dark:text-zinc-400">
            {url}
          </div>
        </div>
      </div>
      <a className="text-xl leading-snug text-blue-800 hover:underline dark:text-blue-300">
        {title}
      </a>
      <p className="mt-1 text-sm leading-snug text-zinc-600 dark:text-zinc-400">
        {description}
      </p>
    </div>
  )
}

function SearchResult({ siteName }: { siteName: string }) {
  const hostname = `${siteName.toLowerCase().replace(/\s+/g, "")}.com`
  return (
    <div className="space-y-8 rounded-lg border bg-white p-4 dark:bg-zinc-950">
      <SearchResultRow
        siteName={siteName}
        url={`https://${hostname}`}
        title={`${siteName} — get started in minutes`}
        description={
          <>
            Ship faster with {siteName}. Docs, examples, and a free plan to try
            before you buy.
          </>
        }
        favicon={
          <SearchResultFavicon>
            <Glyph size={26} />
          </SearchResultFavicon>
        }
      />
      {COMPARISON_SEARCH_RESULTS.map((result) => {
        const brand = BRAND_BY_ID[result.brandId]
        return (
          <SearchResultRow
            key={result.brandId}
            siteName={brand.label}
            url={result.url}
            title={result.title}
            description={result.description}
            favicon={
              <SearchResultFavicon>
                <BrandBookmark mark={brand} size={28} shape="round" />
              </SearchResultFavicon>
            }
          />
        )
      })}
    </div>
  )
}

/** Muted app-icon placeholder — same language as browser chrome stubs. */
function WireAppIcon({
  size = 48,
  shape = "squircle",
}: {
  size?: number
  shape?: "squircle" | "round" | "soft"
}) {
  const radius =
    shape === "round" ? "50%" : shape === "soft" ? "22%" : size * 0.2237
  return (
    <span
      className="inline-block bg-zinc-300 dark:bg-zinc-600"
      style={{ width: size, height: size, borderRadius: radius }}
    />
  )
}

function PhoneHomeScreen({ siteName }: { siteName: string }) {
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

function AndroidLauncher({ siteName }: { siteName: string }) {
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

function PwaInstallBanner({ siteName }: { siteName: string }) {
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
const MASKABLE_SAFE_RATIO = 0.8

function MaskableSafeZoneCard({
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

function MaskableSafeZone() {
  return (
    <div className="flex flex-wrap items-end gap-8">
      <MaskableSafeZoneCard mask="circle" label="Circle · 80% safe zone" />
      <MaskableSafeZoneCard mask="squircle" label="Squircle · adaptive crop" />
    </div>
  )
}

function CrowdedTabStrip({
  tone,
  siteName,
}: {
  tone: "light" | "dark"
  siteName: string
}) {
  // Icon-only tabs: full home-screen brand row with the user mark in the middle.
  const dark = tone === "dark"
  const brands = BRAND_MARKS
  const mid = Math.floor(brands.length / 2)
  const before = brands.slice(0, mid)
  const after = brands.slice(mid)
  const hostname = `${siteName.toLowerCase().replace(/\s+/g, "")}.com`

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border",
        dark ? "border-zinc-700 bg-zinc-800" : "border-zinc-200 bg-zinc-100"
      )}
    >
      <div
        className={cn(
          "flex items-end gap-0 px-2 pt-2",
          dark ? "bg-zinc-800" : "bg-zinc-200/80"
        )}
      >
        <div className="mb-2 flex gap-1.5 px-1">
          <span
            className={cn(
              "size-2.5 rounded-full",
              dark ? "bg-zinc-600" : "bg-zinc-300"
            )}
          />
          <span
            className={cn(
              "size-2.5 rounded-full",
              dark ? "bg-zinc-600" : "bg-zinc-300"
            )}
          />
          <span
            className={cn(
              "size-2.5 rounded-full",
              dark ? "bg-zinc-600" : "bg-zinc-300"
            )}
          />
        </div>
        <div className="ml-1 flex min-w-0 flex-1 items-end gap-px overflow-hidden">
          {before.map((brand) => (
            <div
              key={brand.id}
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-t-md opacity-70",
                dark ? "text-zinc-300" : "text-zinc-600"
              )}
              title={brand.label}
            >
              <BrandBookmark mark={brand} size={14} />
            </div>
          ))}
          <div
            className={cn(
              "flex size-7 shrink-0 items-center justify-center rounded-t-lg shadow-sm",
              dark
                ? "bg-zinc-700 ring-1 ring-white/10"
                : "bg-white ring-1 ring-black/5"
            )}
            title={siteName}
          >
            <Glyph size={14} scheme={tone} />
          </div>
          {after.map((brand) => (
            <div
              key={brand.id}
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-t-md opacity-70",
                dark ? "text-zinc-300" : "text-zinc-600"
              )}
              title={brand.label}
            >
              <BrandBookmark mark={brand} size={14} />
            </div>
          ))}
          <div
            className={cn(
              "mb-1.5 flex size-5 shrink-0 items-center justify-center rounded text-xs",
              dark ? "text-zinc-400" : "text-zinc-500"
            )}
          >
            +
          </div>
        </div>
      </div>

      <div className={cn("px-3 py-2", dark ? "bg-zinc-700" : "bg-white")}>
        <div
          className={cn(
            "flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px]",
            dark ? "bg-zinc-800 text-zinc-300" : "bg-zinc-100 text-zinc-600"
          )}
        >
          <Glyph size={14} className="shrink-0" scheme={tone} />
          <span className="truncate">
            <span className={dark ? "text-zinc-500" : "text-zinc-400"}>
              https://
            </span>
            {hostname}
          </span>
        </div>
      </div>

      <div
        className={cn(
          "h-16 px-4 py-3",
          dark ? "bg-zinc-900" : "bg-zinc-50"
        )}
      >
        <div
          className={cn(
            "mb-2 h-2.5 w-1/3 rounded",
            dark ? "bg-zinc-700" : "bg-zinc-200"
          )}
        />
        <div
          className={cn(
            "h-2 w-4/5 rounded",
            dark ? "bg-zinc-800" : "bg-zinc-200/80"
          )}
        />
      </div>
    </div>
  )
}

function WindowsTaskbar({ siteName }: { siteName: string }) {
  const pinned = CROWDED_TAB_BRANDS.slice(0, 4)

  return (
    <div className="flex h-full min-h-64 flex-col overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800">
      <div className="relative min-h-0 flex-1">
        <div className="absolute top-3 right-3 flex flex-col items-center gap-1">
          <Glyph size={40} className="shadow-md" />
          <span className="max-w-[5rem] truncate rounded bg-zinc-900/70 px-1.5 py-0.5 text-[9px] text-white">
            {siteName}
          </span>
        </div>
      </div>
      <div className="flex h-12 shrink-0 items-center justify-center gap-1 bg-[#202020]/95 px-3 backdrop-blur">
        <span className="mr-1 flex size-8 items-center justify-center rounded-md text-sky-400">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
            <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
          </svg>
        </span>
        <span className="mr-2 h-6 w-28 rounded-full bg-white/10" />
        <div className="flex items-center gap-0.5">
          <span className="flex size-10 items-center justify-center rounded-md bg-white/10 ring-1 ring-white/20">
            <Glyph size={22} />
          </span>
          {pinned.map((id) => (
            <span
              key={id}
              className="flex size-10 items-center justify-center rounded-md hover:bg-white/5"
            >
              <BrandBookmark mark={id} size={22} shape="soft" />
            </span>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2 text-[10px] text-zinc-300">
          <span className="tabular-nums">9:41</span>
        </div>
      </div>
    </div>
  )
}

function MacOsDock({ siteName }: { siteName: string }) {
  const dockBrands = CROWDED_TAB_BRANDS.slice(0, 4)

  return (
    <div className="flex h-full min-h-64 min-w-0 flex-col overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800">
      <div className="relative min-h-0 flex-1">
        <div className="absolute top-3 right-3 flex flex-col items-center gap-1">
          <Glyph size={40} className="shadow-md" />
          <span className="max-w-[5.5rem] truncate rounded bg-zinc-900/70 px-1.5 py-0.5 text-[9px] text-white">
            {siteName}
          </span>
        </div>
      </div>
      <div className="flex min-w-0 shrink-0 justify-center px-2 pb-3">
        <div
          className="flex max-w-full items-end gap-1.5 border border-white/40 bg-white/35 px-2 py-1.5 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-zinc-800/60"
          style={{ borderRadius: 16 }}
        >
          <WireAppIcon size={32} shape="squircle" />
          <span className="mx-0.5 h-8 w-px shrink-0 self-center bg-zinc-400/50" />
          <Glyph size={34} className="shrink-0" />
          {dockBrands.map((id) => (
            <BrandBookmark key={id} mark={id} size={32} shape="squircle" />
          ))}
          <span className="mx-0.5 h-8 w-px shrink-0 self-center bg-zinc-400/50" />
          <WireAppIcon size={32} shape="soft" />
        </div>
      </div>
    </div>
  )
}

function BrowserNotificationToast({ siteName }: { siteName: string }) {
  return (
    <div className="max-w-sm overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex items-start gap-3 p-3">
        <Glyph size={28} className="mt-0.5 shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <span className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {siteName}
            </span>
            <span className="text-muted-foreground shrink-0 text-[10px]">
              now
            </span>
          </div>
          <p className="mt-0.5 truncate text-xs font-medium text-zinc-800 dark:text-zinc-200">
            New activity on your account
          </p>
          <p className="text-muted-foreground mt-0.5 line-clamp-2 text-xs leading-snug">
            Your {siteName} workspace has an update waiting. Open the app to
            continue.
          </p>
        </div>
      </div>
      <div className="flex border-t border-zinc-100 dark:border-zinc-800">
        <span className="text-muted-foreground flex-1 py-2 text-center text-xs">
          Close
        </span>
        <span className="flex-1 border-l border-zinc-100 py-2 text-center text-xs font-medium text-sky-700 dark:border-zinc-800 dark:text-sky-400">
          Open
        </span>
      </div>
    </div>
  )
}

function TabSizeRow() {
  const sizes = [
    { label: "16×16 tab", size: 16 },
    { label: "32×32", size: 32 },
    { label: "48×48", size: 48 },
    { label: "180 apple", size: 64 },
  ] as const

  return (
    <div className="flex flex-wrap items-end gap-6">
      {sizes.map(({ label, size }) => (
        <div key={label} className="flex flex-col items-center gap-2">
          <div className="flex items-center justify-center rounded-md border bg-zinc-100 p-3 dark:bg-zinc-900">
            {label.includes("apple") ? (
              <AppleTouchIcon size={size} />
            ) : (
              <Glyph size={size} />
            )}
          </div>
          <span className="text-muted-foreground text-[10px]">{label}</span>
        </div>
      ))}
    </div>
  )
}

async function copyText(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }
  const el = document.createElement("textarea")
  el.value = text
  el.setAttribute("readonly", "")
  el.style.position = "fixed"
  el.style.left = "-9999px"
  document.body.appendChild(el)
  el.select()
  document.execCommand("copy")
  document.body.removeChild(el)
}

function EmptyPlateSwatch({
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

function StyleSwatch({ mode }: { mode: "library" | "initials" }) {
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

function ShapeSwatch({
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

function PreviewSettings({
  className,
  busy,
  error,
  onDownload,
}: {
  className?: string
  busy: boolean
  error: string | null
  onDownload: () => void
}) {
  const {
    settings,
    patchSettings,
    siteName,
    setSiteName,
    selected,
    selectionError,
    sourceMode,
    setSourceMode,
    initialsText,
    setInitialsText,
  } = useFaviconSelection()
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState<string | null>(null)

  const letters = normalizeInitials(initialsText)
  const canExport =
    sourceMode === "initials" ? letters.length > 0 : Boolean(selected)

  const installPrompt = canExport
    ? buildInstallPrompt({
        selected: sourceMode === "library" ? selected : null,
        settings,
        siteName,
        sourceMode,
        initialsText: letters,
      })
    : null

  useEffect(() => {
    if (!copied) return
    const id = window.setTimeout(() => setCopied(false), 1600)
    return () => window.clearTimeout(id)
  }, [copied])

  async function onCopyPrompt() {
    if (!installPrompt) return
    setCopyError(null)
    try {
      await copyText(installPrompt)
      setCopied(true)
    } catch {
      setCopyError("Couldn’t copy — select the prompt and copy manually.")
    }
  }

  return (
    <div
      className={cn(
        "bg-sidebar text-sidebar-foreground flex h-full flex-col",
        className
      )}
    >
      <div className="flex shrink-0 flex-col gap-3 p-2">
        <div className="px-0.5">
          <p className="text-sm font-semibold tracking-tight">Settings</p>
          <p className="text-muted-foreground text-[11px]">
            Colors, plate, and export
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Selected</Label>
          <div className="flex items-center gap-3 rounded-lg border border-sidebar-border bg-background/50 p-2.5">
            <Glyph size={40} className="shrink-0" />
            <div className="min-w-0 flex-1">
              {sourceMode === "initials" ? (
                <>
                  <p className="truncate text-sm font-medium">
                    Initials · {letters || "—"}
                  </p>
                  <p className="text-muted-foreground truncate text-xs">
                    Letter plate
                  </p>
                </>
              ) : selected ? (
                <>
                  <p className="truncate text-sm font-medium">{selected.name}</p>
                  <p className="text-muted-foreground truncate text-xs">
                    {selected.library_name} · {selected.style}
                  </p>
                </>
              ) : (
                <p className="text-muted-foreground text-xs">No icon selected</p>
              )}
              {selectionError && sourceMode === "library" ? (
                <p className="text-destructive mt-1 text-xs">{selectionError}</p>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1" viewportClassName="scroll-fade">
        <div className="flex flex-col gap-5 p-2">
          <div className="flex flex-col gap-2">
            <Label>Style</Label>
            <ToggleGroup
              value={[sourceMode]}
              onValueChange={(next) => {
                const mode = next[0]
                if (mode === "library" || mode === "initials") {
                  setSourceMode(mode)
                }
              }}
              variant="outline"
              size="sm"
              spacing={0}
              className="w-full"
              aria-label="Style"
            >
              {(
                [
                  ["library", "Icon"],
                  ["initials", "Letters"],
                ] as const
              ).map(([value, label]) => (
                <ToggleGroupItem
                  key={value}
                  value={value}
                  className="h-auto flex-1 flex-col gap-1.5 py-2"
                >
                  <StyleSwatch mode={value} />
                  {label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          {sourceMode === "initials" ? (
            <div className="flex flex-col gap-2">
              <Label htmlFor="initials-text">Letters</Label>
              <Input
                id="initials-text"
                value={initialsText}
                onChange={(e) => setInitialsText(e.target.value)}
                placeholder="JT"
                maxLength={4}
                autoCapitalize="characters"
                spellCheck={false}
              />
              <p className="text-muted-foreground text-[11px]">
                1–2 Latin letters or digits.
              </p>
            </div>
          ) : null}

          <div className="flex flex-col gap-2">
            <Label htmlFor="site-name">Site name</Label>
            <Input
              id="site-name"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              placeholder={DEFAULT_SITE_NAME}
            />
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label>Background</Label>
              <ToggleGroup
                value={[settings.bgMode]}
                onValueChange={(next) => {
                  const bgMode = next[0]
                  if (bgMode !== "solid" && bgMode !== "linear") return
                  patchSettings({
                    bgMode,
                    ...(bgMode === "linear"
                      ? {
                          bg: settings.bg ?? BRAND_BG,
                          bgTo: settings.bgTo ?? BRAND_BG_TO,
                        }
                      : {}),
                  })
                }}
                variant="outline"
                size="sm"
                spacing={0}
                className="w-full"
                aria-label="Background"
              >
                <ToggleGroupItem value="solid" className="flex-1">
                  Solid
                </ToggleGroupItem>
                <ToggleGroupItem value="linear" className="flex-1">
                  Gradient
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            {settings.bgMode === "linear" ? (
              <>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="preview-bg-from">From</Label>
                  <ColorPicker
                    id="preview-bg-from"
                    value={settings.bg}
                    onChange={(bg) =>
                      patchSettings({ bg: bg ?? BRAND_BG })
                    }
                    aria-label="Gradient from color"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="preview-bg-to">To</Label>
                  <ColorPicker
                    id="preview-bg-to"
                    value={settings.bgTo}
                    onChange={(bgTo) =>
                      patchSettings({ bgTo: bgTo ?? BRAND_BG_TO })
                    }
                    aria-label="Gradient to color"
                  />
                </div>
                <div className="flex flex-col gap-2.5">
                  <div className="flex justify-between text-sm">
                    <Label>Angle</Label>
                    <span className="text-muted-foreground tabular-nums">
                      {Math.round(settings.bgAngle)}°
                    </span>
                  </div>
                  <Slider
                    value={[settings.bgAngle]}
                    min={0}
                    max={360}
                    step={1}
                    onValueChange={(v) => {
                      const next = Array.isArray(v) ? v[0] : v
                      patchSettings({
                        bgAngle: typeof next === "number" ? next : 135,
                      })
                    }}
                  />
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Label htmlFor="preview-bg">Color</Label>
                <ColorPicker
                  id="preview-bg"
                  value={settings.bg}
                  onChange={(bg) => patchSettings({ bg })}
                  aria-label="Background color"
                />
              </div>
            )}
            {sourceMode === "initials" ? (
              <div className="flex flex-col gap-2">
                <Label htmlFor="preview-letter">Letter color</Label>
                <ColorPicker
                  id="preview-letter"
                  value={settings.fill ?? settings.stroke}
                  onChange={(color) =>
                    patchSettings({
                      fill: color,
                      stroke: color,
                    })
                  }
                  aria-label="Letter color"
                />
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="preview-fill">Fill</Label>
                  <ColorPicker
                    id="preview-fill"
                    value={settings.fill}
                    onChange={(fill) => patchSettings({ fill })}
                    aria-label="Fill color"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="preview-stroke">Stroke</Label>
                  <ColorPicker
                    id="preview-stroke"
                    value={settings.stroke}
                    onChange={(stroke) => patchSettings({ stroke })}
                    aria-label="Stroke color"
                  />
                </div>
              </>
            )}
          </div>

          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={settings.includeDarkMode}
              onCheckedChange={(c) =>
                patchSettings({ includeDarkMode: c === true })
              }
            />
            Dark-mode favicon (dual SVG)
          </label>

          {settings.includeDarkMode ? (
            <div className="flex flex-col gap-5">
              <p className="text-muted-foreground text-[0.625rem]">
                Shown in the dark browser mock and exported as{" "}
                <code className="font-mono">favicon-dark.svg</code> with{" "}
                <code className="font-mono">prefers-color-scheme</code> link
                tags.
              </p>
              <div className="flex flex-col gap-2">
                <Label htmlFor="preview-dark-bg">Dark background</Label>
                <ColorPicker
                  id="preview-dark-bg"
                  value={settings.darkBg}
                  onChange={(darkBg) =>
                    patchSettings({
                      darkBg:
                        settings.bgMode === "linear"
                          ? (darkBg ?? "#ffffff")
                          : darkBg,
                    })
                  }
                  aria-label="Dark background color"
                />
              </div>
              {settings.bgMode === "linear" ? (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="preview-dark-bg-to">Dark to</Label>
                  <ColorPicker
                    id="preview-dark-bg-to"
                    value={settings.darkBgTo}
                    onChange={(darkBgTo) =>
                      patchSettings({
                        darkBgTo: darkBgTo ?? "#e2e8f0",
                      })
                    }
                    aria-label="Dark gradient to color"
                  />
                </div>
              ) : null}
              <div className="flex flex-col gap-2">
                <Label htmlFor="preview-dark-fill">Dark fill</Label>
                <ColorPicker
                  id="preview-dark-fill"
                  value={settings.darkFill}
                  onChange={(darkFill) => patchSettings({ darkFill })}
                  aria-label="Dark fill color"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="preview-dark-stroke">Dark stroke</Label>
                <ColorPicker
                  id="preview-dark-stroke"
                  value={settings.darkStroke}
                  onChange={(darkStroke) => patchSettings({ darkStroke })}
                  aria-label="Dark stroke color"
                />
              </div>
            </div>
          ) : null}

          <div className="flex flex-col gap-2">
            <Label>Shape</Label>
            <ToggleGroup
              value={[settings.shape]}
              onValueChange={(next) => {
                const shape = next[0]
                if (
                  shape === "rounded-square" ||
                  shape === "circle" ||
                  shape === "none"
                ) {
                  patchSettings({ shape })
                }
              }}
              variant="outline"
              size="sm"
              spacing={0}
              className="w-full"
              aria-label="Shape"
            >
              {(
                [
                  ["rounded-square", "Square"],
                  ["circle", "Circle"],
                  ["none", "None"],
                ] as const
              ).map(([value, label]) => (
                <ToggleGroupItem
                  key={value}
                  value={value}
                  className="h-auto flex-1 flex-col gap-1.5 py-2"
                >
                  <ShapeSwatch shape={value} />
                  {label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="flex justify-between text-sm">
              <Label>Padding</Label>
              <span className="text-muted-foreground tabular-nums">
                {Math.round(settings.padding * 100)}%
              </span>
            </div>
            <Slider
              value={[settings.padding]}
              min={0}
              max={0.4}
              step={0.01}
              onValueChange={(v) => {
                const next = Array.isArray(v) ? v[0] : v
                patchSettings({
                  padding: typeof next === "number" ? next : 0.08,
                })
              }}
            />
          </div>

          {sourceMode === "library" ? (
            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between text-sm">
                <Label>Stroke scale</Label>
                <span className="text-muted-foreground tabular-nums">
                  {settings.strokeScale.toFixed(2)}×
                </span>
              </div>
              <Slider
                value={[settings.strokeScale]}
                min={0.5}
                max={3}
                step={0.05}
                disabled={!settings.stroke}
                onValueChange={(v) => {
                  const next = Array.isArray(v) ? v[0] : v
                  patchSettings({
                    strokeScale: typeof next === "number" ? next : 0.8,
                  })
                }}
              />
              {!settings.stroke ? (
                <p className="text-muted-foreground text-[0.625rem]">
                  Stroke scale applies when a stroke color is set.
                </p>
              ) : null}
            </div>
          ) : null}

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="install-prompt">LLM install prompt</Label>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="text-muted-foreground"
                disabled={!installPrompt}
                aria-label={copied ? "Copied install prompt" : "Copy install prompt"}
                onClick={() => void onCopyPrompt()}
              >
                {copied ? <CheckIcon /> : <CopyIcon />}
              </Button>
            </div>
            {installPrompt ? (
              <textarea
                id="install-prompt"
                readOnly
                value={installPrompt}
                rows={8}
                className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/30 w-full resize-y rounded-md border px-2 py-1.5 font-mono text-[0.625rem]/relaxed outline-none focus-visible:ring-2"
                onFocus={(e) => e.currentTarget.select()}
              />
            ) : (
              <p className="text-muted-foreground border-input rounded-md border border-dashed px-2 py-3 text-xs">
                {sourceMode === "initials"
                  ? "Enter 1–2 letters to generate a paste-ready install prompt."
                  : "Select an icon to generate a paste-ready install prompt for an LLM."}
              </p>
            )}
          </div>
        </div>
      </ScrollArea>

      <div className="flex shrink-0 flex-col gap-2 p-2">
        {error ? <p className="text-destructive text-xs">{error}</p> : null}
        {copyError ? (
          <p className="text-destructive text-xs">{copyError}</p>
        ) : null}
        <Button
          type="button"
          variant="secondary"
          className="w-full gap-2"
          disabled={!installPrompt}
          onClick={() => void onCopyPrompt()}
        >
          {copied ? (
            <CheckIcon data-icon="inline-start" />
          ) : (
            <CopyIcon data-icon="inline-start" />
          )}
          {copied ? "Copied install prompt" : "Copy install prompt"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="w-full gap-2"
          disabled={!canExport || busy}
          onClick={onDownload}
        >
          <DownloadIcon data-icon="inline-start" />
          {busy ? "Building…" : "Download favicon zip"}
        </Button>
      </div>
    </div>
  )
}

export function PreviewPage() {
  const { selected, settings, siteName, sourceMode, initialsText } =
    useFaviconSelection()
  const [iconsSheetOpen, setIconsSheetOpen] = useState(false)
  const [settingsSheetOpen, setSettingsSheetOpen] = useState(false)
  const [iconsExpanded, setIconsExpanded] = useState(true)
  const [settingsExpanded, setSettingsExpanded] = useState(true)
  const [busy, setBusy] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)

  const letters = normalizeInitials(initialsText)
  const canExport =
    sourceMode === "initials" ? letters.length > 0 : Boolean(selected)

  async function onDownload() {
    if (!canExport) return
    setBusy(true)
    setExportError(null)
    try {
      const shared = {
        bg:
          settings.bgMode === "solid" &&
          settings.shape === "none" &&
          !settings.bg
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
        dark_bg_to:
          settings.bgMode === "linear" ? settings.darkBgTo : undefined,
        dark_fill: settings.darkFill,
        dark_stroke: settings.darkStroke ?? "none",
        site_name: siteName.trim() || DEFAULT_SITE_NAME,
      }
      const blob = await exportFaviconZip(
        sourceMode === "initials"
          ? { ...shared, text: letters }
          : {
              ...shared,
              library: selected!.library,
              name: selected!.name,
              style: selected!.style,
            }
      )
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download =
        sourceMode === "initials"
          ? `initials-${letters.toLowerCase()}-favicon.zip`
          : `${selected!.library}-${selected!.name}-favicon.zip`
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      setExportError(e instanceof Error ? e.message : "Export failed")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="bg-background flex h-svh overflow-hidden">
      {/* Left icons sidebar — full height; unmounted when collapsed */}
      {iconsExpanded ? (
        <aside className="border-sidebar-border hidden w-72 shrink-0 border-r lg:block">
          <IconBrowserSidebar />
        </aside>
      ) : null}

      {/* Center column: header + mockups */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-12 shrink-0 items-center gap-2 bg-background/90 px-3 backdrop-blur">
          {/* Desktop: expand/collapse docked icons sidebar */}
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="hidden lg:inline-flex"
            aria-label={
              iconsExpanded ? "Collapse icons sidebar" : "Expand icons sidebar"
            }
            title={iconsExpanded ? "Collapse icons" : "Expand icons"}
            onClick={() => setIconsExpanded((v) => !v)}
          >
            <SidebarIcon />
          </Button>

          {/* Mobile: same control opens icons sheet */}
          <Sheet open={iconsSheetOpen} onOpenChange={setIconsSheetOpen}>
            <SheetTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="lg:hidden"
                  aria-label="Open icons"
                  title="Open icons"
                />
              }
            >
              <SidebarIcon />
            </SheetTrigger>
            <SheetContent side="left" className="w-[min(100%,20rem)] p-0">
              <SheetHeader className="sr-only">
                <SheetTitle>Icons</SheetTitle>
              </SheetHeader>
              <IconBrowserSidebar onSelect={() => setIconsSheetOpen(false)} />
            </SheetContent>
          </Sheet>

          <div className="flex-1" />

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled={!canExport || busy}
            onClick={() => void onDownload()}
            aria-label={
              busy ? "Building favicon zip" : "Download favicon zip"
            }
            title={
              canExport
                ? "Download favicon zip"
                : sourceMode === "initials"
                  ? "Enter letters first"
                  : "Select an icon first"
            }
          >
            <DownloadIcon />
          </Button>

          <ModeToggle />

          {/* Mobile: same control opens settings sheet */}
          <Sheet open={settingsSheetOpen} onOpenChange={setSettingsSheetOpen}>
            <SheetTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="lg:hidden"
                  aria-label="Open settings"
                  title="Open settings"
                />
              }
            >
              <SidebarIcon className="scale-x-[-1]" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(100%,20rem)] p-0">
              <SheetHeader className="sr-only">
                <SheetTitle>Settings</SheetTitle>
              </SheetHeader>
              <PreviewSettings
                busy={busy}
                error={exportError}
                onDownload={() => void onDownload()}
              />
            </SheetContent>
          </Sheet>

          {/* Desktop: expand/collapse docked settings sidebar */}
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="hidden lg:inline-flex"
            aria-label={
              settingsExpanded
                ? "Collapse settings sidebar"
                : "Expand settings sidebar"
            }
            title={settingsExpanded ? "Collapse settings" : "Expand settings"}
            onClick={() => setSettingsExpanded((v) => !v)}
          >
            <SidebarIcon className="scale-x-[-1]" />
          </Button>
        </header>

        <main className="min-h-0 flex-1">
          <ScrollArea className="h-full">
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 pt-0 pb-16 sm:px-6">
              {!selected ? (
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <p className="text-muted-foreground text-sm">
                    Select an icon from the left sidebar to preview it in
                    context.
                  </p>
                </div>
              ) : null}

              <section>
                <MockLabel subtitle="How the mark reads from tiny tab sizes up to touch-icon scale.">
                  Size ladder
                </MockLabel>
                <TabSizeRow />
              </section>

              <section>
                <MockLabel subtitle="Shaded areas sit outside Android / maskable crops. Keep important glyph detail inside the dashed ring.">
                  Maskable / adaptive safe zone
                </MockLabel>
                <MaskableSafeZone />
              </section>

              <section className="grid gap-6 xl:grid-cols-2">
                <div>
                  <MockLabel subtitle="Favicon in a light browser chrome and address bar.">
                    Browser · light
                  </MockLabel>
                  <BrowserChrome tone="light" siteName={siteName || DEFAULT_SITE_NAME} />
                </div>
                <div>
                  <MockLabel subtitle="Favicon in a dark browser chrome and address bar.">
                    Browser · dark
                  </MockLabel>
                  <BrowserChrome tone="dark" siteName={siteName || DEFAULT_SITE_NAME} />
                </div>
              </section>

              <section className="grid gap-6 xl:grid-cols-2">
                <div>
                  <MockLabel subtitle="Icon-only tabs competing with other bookmarks in a light strip.">
                    Crowded tabs · light
                  </MockLabel>
                  <CrowdedTabStrip
                    tone="light"
                    siteName={siteName || DEFAULT_SITE_NAME}
                  />
                </div>
                <div>
                  <MockLabel subtitle="Icon-only tabs competing with other bookmarks in a dark strip.">
                    Crowded tabs · dark
                  </MockLabel>
                  <CrowdedTabStrip
                    tone="dark"
                    siteName={siteName || DEFAULT_SITE_NAME}
                  />
                </div>
              </section>

              <section>
                <MockLabel subtitle="Site icon next to the result title and URL in a search listing.">
                  Google-style search results
                </MockLabel>
                <div className="max-w-xl">
                  <SearchResult siteName={siteName || DEFAULT_SITE_NAME} />
                </div>
              </section>

              <section>
                <MockLabel subtitle="How the icon appears in a system-style notification toast.">
                  Browser notification
                </MockLabel>
                <BrowserNotificationToast
                  siteName={siteName || DEFAULT_SITE_NAME}
                />
              </section>

              <section>
                <MockLabel subtitle="Install prompt with the app icon and site name.">
                  PWA install prompt
                </MockLabel>
                <div className="max-w-md">
                  <PwaInstallBanner siteName={siteName || DEFAULT_SITE_NAME} />
                </div>
              </section>

              <section className="grid items-stretch gap-8 sm:grid-cols-2">
                <div className="flex min-h-0 flex-col">
                  <MockLabel subtitle="Home screen icon under iOS rounding and labeling.">
                    iOS home screen
                  </MockLabel>
                  <div className="flex min-h-0 flex-1 flex-col">
                    <PhoneHomeScreen siteName={siteName || DEFAULT_SITE_NAME} />
                  </div>
                </div>
                <div className="flex min-h-0 flex-col">
                  <MockLabel subtitle="Launcher icon with Android adaptive masking.">
                    Android launcher
                  </MockLabel>
                  <div className="flex min-h-0 flex-1 flex-col">
                    <AndroidLauncher siteName={siteName || DEFAULT_SITE_NAME} />
                  </div>
                </div>
              </section>

              <section className="grid items-stretch gap-8 lg:grid-cols-2">
                <div className="flex min-h-0 flex-col">
                  <MockLabel subtitle="Dock tile at desktop resolution among other apps.">
                    macOS Dock
                  </MockLabel>
                  <div className="flex min-h-0 flex-1 flex-col">
                    <MacOsDock siteName={siteName || DEFAULT_SITE_NAME} />
                  </div>
                </div>
                <div className="flex min-h-0 flex-col">
                  <MockLabel subtitle="Taskbar and Start tile appearance on Windows.">
                    Windows taskbar / Start
                  </MockLabel>
                  <div className="flex min-h-0 flex-1 flex-col">
                    <WindowsTaskbar siteName={siteName || DEFAULT_SITE_NAME} />
                  </div>
                </div>
              </section>
            </div>
          </ScrollArea>
        </main>
      </div>

      {/* Right settings sidebar — full height; unmounted when collapsed */}
      {settingsExpanded ? (
        <aside className="border-sidebar-border hidden w-72 shrink-0 border-l lg:block">
          <PreviewSettings
            busy={busy}
            error={exportError}
            onDownload={() => void onDownload()}
          />
        </aside>
      ) : null}
    </div>
  )
}
