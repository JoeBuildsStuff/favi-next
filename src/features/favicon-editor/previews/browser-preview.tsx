"use client"

import type { ReactNode } from "react"

import { Glyph } from "@/features/favicon-editor/glyph"
import {
  BrandBookmark,
  BRAND_BY_ID,
} from "@/features/favicon-editor/previews/brand-bookmark"
import { AppleTouchIcon } from "@/features/favicon-editor/previews/mobile-previews"
import {
  BOOKMARK_BRANDS,
  BRAND_MARKS,
  type BrandMarkId,
} from "@/lib/brand-mock-icons"
import { cn } from "@/lib/utils"

export function BrowserChrome({
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
export const COMPARISON_SEARCH_RESULTS: {
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

export function SearchResultFavicon({ children }: { children: ReactNode }) {
  // Real Google SERPs put the favicon in a ~28px circle; the glyph is ~16–18px.
  return (
    <span className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-100 ring-1 ring-zinc-200/80 dark:bg-zinc-800 dark:ring-zinc-700">
      {children}
    </span>
  )
}

export function SearchResultRow({
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

export function SearchResult({ siteName }: { siteName: string }) {
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

export function CrowdedTabStrip({
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

export function BrowserNotificationToast({ siteName }: { siteName: string }) {
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

export function TabSizeRow() {
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
