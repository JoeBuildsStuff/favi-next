"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useFaviconSelection } from "@/context/favicon-selection"
import { DEFAULT_SITE_NAME } from "@/lib/favicon-settings"
import { StyleSwatch } from "./swatches"

export function SourceControls() {
  const {
    siteName,
    setSiteName,
    sourceMode,
    setSourceMode,
    initialsText,
    setInitialsText,
  } = useFaviconSelection()

  return (
    <>
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
    </>
  )
}
