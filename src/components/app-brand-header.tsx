import { cn } from "@/lib/utils"

export function AppBrandHeader({
  subtitle = "Favicon settings",
  className,
}: {
  subtitle?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex h-12 w-full items-center gap-2 overflow-hidden rounded-[calc(var(--radius-sm)+2px)] p-2 text-left text-xs",
        className
      )}
    >
      {/* Decorative local SVG mark — next/image does not optimize SVGs. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/favicon.svg"
        alt=""
        width={32}
        height={32}
        className="size-8 shrink-0"
      />
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">favi</span>
        <span className="text-muted-foreground truncate text-xs">{subtitle}</span>
      </div>
    </div>
  )
}
