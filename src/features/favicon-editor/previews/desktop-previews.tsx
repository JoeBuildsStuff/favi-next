"use client"

import { Glyph } from "@/features/favicon-editor/glyph"
import { BrandBookmark } from "@/features/favicon-editor/previews/brand-bookmark"
import { WireAppIcon } from "@/features/favicon-editor/previews/wire-app-icon"
import { CROWDED_TAB_BRANDS } from "@/lib/brand-mock-icons"

export function WindowsTaskbar({ siteName }: { siteName: string }) {
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

export function MacOsDock({ siteName }: { siteName: string }) {
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
