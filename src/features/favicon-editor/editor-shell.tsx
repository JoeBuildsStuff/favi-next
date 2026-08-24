"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { DownloadIcon, SidebarIcon } from "lucide-react"

import { IconBrowserSidebar } from "@/components/icon-browser-sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useFaviconSelection } from "@/context/favicon-selection"
import { PreviewSettings } from "@/features/favicon-editor/settings/settings-panel"
import { useFaviconExport } from "@/features/favicon-editor/hooks/use-favicon-export"

const PreviewGallery = dynamic(
  () =>
    import("@/features/favicon-editor/previews/preview-gallery").then(
      (mod) => mod.PreviewGallery
    ),
  {
    loading: () => (
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 pt-0 pb-16 sm:px-6" />
    ),
  }
)

export function EditorShell() {
  const { sourceMode } = useFaviconSelection()
  const [iconsSheetOpen, setIconsSheetOpen] = useState(false)
  const [settingsSheetOpen, setSettingsSheetOpen] = useState(false)
  const [iconsExpanded, setIconsExpanded] = useState(true)
  const [settingsExpanded, setSettingsExpanded] = useState(true)
  const { busy, exportError, canExport, onDownload } = useFaviconExport()

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
            <PreviewGallery />
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
