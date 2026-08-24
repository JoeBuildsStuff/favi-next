"use client"

import { useEffect, useState } from "react"
import { CheckIcon, CopyIcon, DownloadIcon } from "lucide-react"

import { Glyph } from "@/features/favicon-editor/glyph"
import { copyText } from "@/features/favicon-editor/clipboard"
import { SourceControls } from "@/features/favicon-editor/settings/source-controls"
import { ShapeSwatch } from "@/features/favicon-editor/settings/swatches"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ColorPicker } from "@/components/ui/color-picker"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Slider } from "@/components/ui/slider"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useFaviconSelection } from "@/context/favicon-selection"
import {
  BRAND_BG,
  BRAND_BG_TO,
  normalizeInitials,
} from "@/lib/favicon-settings"
import { buildInstallPrompt } from "@/lib/install-prompt"
import { cn } from "@/lib/utils"

export function PreviewSettings({
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
    selected,
    selectionError,
    sourceMode,
    initialsText,
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
          <SourceControls />


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
