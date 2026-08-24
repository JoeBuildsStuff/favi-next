"use client"

import { useFaviconSelection } from "@/context/favicon-selection"
import { DEFAULT_SITE_NAME } from "@/lib/favicon-settings"
import { MockLabel } from "@/features/favicon-editor/previews/mock-label"
import {
  BrowserChrome,
  BrowserNotificationToast,
  CrowdedTabStrip,
  SearchResult,
  TabSizeRow,
} from "@/features/favicon-editor/previews/browser-preview"
import {
  AndroidLauncher,
  MaskableSafeZone,
  PhoneHomeScreen,
  PwaInstallBanner,
} from "@/features/favicon-editor/previews/mobile-previews"
import {
  MacOsDock,
  WindowsTaskbar,
} from "@/features/favicon-editor/previews/desktop-previews"

export function PreviewGallery() {
  const { selected, siteName } = useFaviconSelection()

  return (
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
  )
}
