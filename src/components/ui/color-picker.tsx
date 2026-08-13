"use client"

import * as React from "react"
import { HexColorPicker } from "react-colorful"
import {
  ChevronLeftIcon,
  ChevronsUpDownIcon,
  PipetteIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  hexToHsv,
  hexToRgb,
  hsvToHex,
  normalizeHex,
  rgbToHex,
} from "@/lib/color"
import {
  TAILWIND_COLOR_NAMES,
  TAILWIND_COLORS,
  TAILWIND_SHADES,
} from "@/lib/tailwind-colors"
import { cn } from "@/lib/utils"

type ColorFormat = "hex" | "rgb"
type PickerView = "presets" | "custom"

type ColorPickerProps = {
  value: string | null
  onChange: (value: string | null) => void
  className?: string
  disabled?: boolean
  id?: string
  "aria-label"?: string
}

const RAINBOW_GRADIENT =
  "conic-gradient(from 0deg, #ef4444, #f59e0b, #eab308, #22c55e, #06b6d4, #3b82f6, #8b5cf6, #ec4899, #ef4444)"

const NONE_SWATCH_STYLE: React.CSSProperties = {
  backgroundColor: "#e4e4e7",
  backgroundImage:
    "linear-gradient(45deg,#a1a1aa 25%,transparent 25%),linear-gradient(-45deg,#a1a1aa 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#a1a1aa 75%),linear-gradient(-45deg,transparent 75%,#a1a1aa 75%)",
  backgroundSize: "8px 8px",
  backgroundPosition: "0 0,0 4px,4px -4px,-4px 0",
}

function HueSlider({
  hue,
  onChange,
}: {
  hue: number
  onChange: (hue: number) => void
}) {
  return (
    <input
      type="range"
      min={0}
      max={360}
      step={1}
      value={hue}
      aria-label="Hue"
      onChange={(e) => onChange(Number(e.target.value))}
      className={cn(
        "h-3 w-full cursor-pointer appearance-none rounded-full",
        "bg-[linear-gradient(to_right,#f00_0%,#ff0_17%,#0f0_33%,#0ff_50%,#00f_67%,#f0f_83%,#f00_100%)]",
        "[&::-webkit-slider-thumb]:size-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full",
        "[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white",
        "[&::-webkit-slider-thumb]:bg-(--thumb-color)",
        "[&::-moz-range-thumb]:size-3.5 [&::-moz-range-thumb]:rounded-full",
        "[&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white",
        "[&::-moz-range-thumb]:bg-(--thumb-color)"
      )}
      style={
        {
          "--thumb-color": `hsl(${hue} 100% 50%)`,
        } as React.CSSProperties
      }
    />
  )
}

function SwatchButton({
  label,
  color,
  selected,
  onSelect,
  className,
  style,
}: {
  label: string
  color?: string
  selected?: boolean
  onSelect: () => void
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onSelect}
      className={cn(
        "border-border size-4 shrink-0 rounded-sm border transition-[outline]",
        "hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        selected && "ring-2 ring-ring ring-offset-1 ring-offset-popover",
        className
      )}
      style={
        color
          ? { backgroundColor: color, ...style }
          : style
      }
    />
  )
}

function TailwindColorGrid({
  value,
  onChange,
  onOpenCustom,
}: {
  value: string | null
  onChange: (value: string | null) => void
  onOpenCustom: () => void
}) {
  const hex = value ? normalizeHex(value)?.toLowerCase() ?? "" : ""
  const isNone = value == null

  return (
    <div className="flex w-[260px] flex-col gap-2">
      <div className="flex flex-wrap items-center gap-1.5">
        <SwatchButton
          label="Custom color"
          selected={false}
          onSelect={onOpenCustom}
          className="size-5"
          style={{ background: RAINBOW_GRADIENT }}
        />
        <SwatchButton
          label="White"
          color="#ffffff"
          selected={hex === "#ffffff"}
          onSelect={() => onChange("#ffffff")}
          className="size-5"
        />
        <SwatchButton
          label="Black"
          color="#000000"
          selected={hex === "#000000"}
          onSelect={() => onChange("#000000")}
          className="size-5"
        />
        <SwatchButton
          label="None"
          selected={isNone}
          onSelect={() => onChange(null)}
          className="size-5"
          style={NONE_SWATCH_STYLE}
        />
      </div>

      <div className="flex max-h-[280px] flex-col gap-1 overflow-y-auto pr-0.5">
        {TAILWIND_COLOR_NAMES.map((name) => (
          <div key={name} className="flex items-center gap-1">
            <span className="text-muted-foreground w-12 shrink-0 truncate text-[10px] capitalize">
              {name}
            </span>
            <div className="flex gap-0.5">
              {TAILWIND_SHADES.map((shade) => {
                const color = TAILWIND_COLORS[name][shade]
                return (
                  <SwatchButton
                    key={shade}
                    label={`${name}-${shade}`}
                    color={color}
                    selected={hex === color}
                    onSelect={() => onChange(color)}
                    className="size-3.5"
                  />
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ColorPickerPanel({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const hex = normalizeHex(value) ?? "#000000"
  const rgb = hexToRgb(hex) ?? { r: 0, g: 0, b: 0 }
  const hsv = hexToHsv(hex) ?? { h: 0, s: 0, v: 0 }
  const [format, setFormat] = React.useState<ColorFormat>("rgb")
  const [hexDraft, setHexDraft] = React.useState(hex)
  const [prevHex, setPrevHex] = React.useState(hex)
  const supportsEyeDropper =
    typeof window !== "undefined" && "EyeDropper" in window

  if (hex !== prevHex) {
    setPrevHex(hex)
    setHexDraft(hex)
  }

  function setFromHue(h: number) {
    onChange(hsvToHex(h, hsv.s, hsv.v))
  }

  function setRgbChannel(channel: "r" | "g" | "b", raw: string) {
    const n = Number(raw)
    if (!Number.isFinite(n)) return
    onChange(
      rgbToHex(
        channel === "r" ? n : rgb.r,
        channel === "g" ? n : rgb.g,
        channel === "b" ? n : rgb.b
      )
    )
  }

  async function pickFromScreen() {
    if (!supportsEyeDropper) return
    try {
      // EyeDropper is Chromium-only; typed loosely for TS.
      const EyeDropperCtor = (
        window as unknown as {
          EyeDropper: new () => { open: () => Promise<{ sRGBHex: string }> }
        }
      ).EyeDropper
      const result = await new EyeDropperCtor().open()
      const next = normalizeHex(result.sRGBHex)
      if (next) onChange(next)
    } catch {
      // User cancelled.
    }
  }

  return (
    <div className="flex w-[220px] flex-col gap-3">
      <HexColorPicker
        color={hex}
        onChange={(c) => {
          const next = normalizeHex(c)
          if (next) onChange(next)
        }}
        className="favi-color-picker"
      />

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          disabled={!supportsEyeDropper}
          aria-label="Pick color from screen"
          title={
            supportsEyeDropper
              ? "Pick color from screen"
              : "Eyedropper not supported in this browser"
          }
          onClick={() => void pickFromScreen()}
        >
          <PipetteIcon />
        </Button>
        <span
          className="border-border size-7 shrink-0 rounded-full border"
          style={{ backgroundColor: hex }}
          aria-hidden
        />
        <div className="min-w-0 flex-1 px-0.5">
          <HueSlider hue={hsv.h} onChange={setFromHue} />
        </div>
      </div>

      {format === "hex" ? (
        <div className="grid grid-cols-[1fr_auto] items-center gap-x-1.5 gap-y-1">
          <Input
            value={hexDraft}
            onChange={(e) => {
              const next = e.target.value
              setHexDraft(next)
              const parsed = normalizeHex(next)
              if (parsed) onChange(parsed)
            }}
            onBlur={() => setHexDraft(hex)}
            spellCheck={false}
            aria-label="Hex"
            className="font-mono uppercase"
          />
          <span className="size-6" aria-hidden />
          <span className="text-muted-foreground text-center text-[10px]">
            Hex
          </span>
          <FormatSelect format={format} onChange={setFormat} />
        </div>
      ) : (
        <div className="grid grid-cols-[1fr_1fr_1fr_auto] items-center gap-x-1.5 gap-y-1">
          {(
            [
              ["r", rgb.r],
              ["g", rgb.g],
              ["b", rgb.b],
            ] as const
          ).map(([channel, channelValue]) => (
            <Input
              key={channel}
              type="number"
              min={0}
              max={255}
              value={channelValue}
              onChange={(e) => setRgbChannel(channel, e.target.value)}
              aria-label={channel.toUpperCase()}
              className="px-1 text-center tabular-nums"
            />
          ))}
          <span className="size-6" aria-hidden />
          {(["r", "g", "b"] as const).map((channel) => (
            <span
              key={channel}
              className="text-muted-foreground text-center text-[10px] uppercase"
            >
              {channel}
            </span>
          ))}
          <FormatSelect format={format} onChange={setFormat} />
        </div>
      )}
    </div>
  )
}

function FormatSelect({
  format,
  onChange,
}: {
  format: ColorFormat
  onChange: (format: ColorFormat) => void
}) {
  return (
    <Select
      value={format}
      onValueChange={(v) => onChange((v as ColorFormat) ?? "rgb")}
    >
      <SelectTrigger
        size="sm"
        aria-label="Color format"
        className="size-6 shrink-0 justify-center px-0 [&>svg:last-child]:hidden"
      >
        <ChevronsUpDownIcon className="size-3.5 opacity-70" />
        <SelectValue className="sr-only" />
      </SelectTrigger>
      <SelectContent align="end">
        <SelectGroup>
          <SelectItem value="hex">Hex</SelectItem>
          <SelectItem value="rgb">RGB</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

function ColorPicker({
  value,
  onChange,
  className,
  disabled,
  id,
  "aria-label": ariaLabel = "Pick color",
}: ColorPickerProps) {
  const hex = value ? normalizeHex(value) : null
  const displayHex = hex ?? "#000000"
  const [open, setOpen] = React.useState(false)
  const [view, setView] = React.useState<PickerView>("presets")

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) setView("presets")
  }

  function pick(next: string | null) {
    if (next == null) {
      onChange(null)
      return
    }
    onChange(normalizeHex(next) ?? next)
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        disabled={disabled}
        id={id}
        aria-label={ariaLabel}
        render={
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn("h-8 w-full justify-start gap-2 px-2", className)}
          />
        }
      >
        <span
          className="border-border size-4 shrink-0 rounded-sm border"
          style={hex ? { backgroundColor: hex } : NONE_SWATCH_STYLE}
        />
        <span className="font-mono text-xs uppercase">
          {hex ?? "none"}
        </span>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-3">
        {view === "presets" ? (
          <TailwindColorGrid
            value={hex}
            onChange={pick}
            onOpenCustom={() => setView("custom")}
          />
        ) : (
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 w-fit gap-1 px-1.5 text-xs"
              onClick={() => setView("presets")}
            >
              <ChevronLeftIcon className="size-3.5" />
              Tailwind colors
            </Button>
            <ColorPickerPanel value={displayHex} onChange={pick} />
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

export { ColorPicker, ColorPickerPanel }
