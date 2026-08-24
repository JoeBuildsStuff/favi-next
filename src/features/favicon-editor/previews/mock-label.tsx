import type { ReactNode } from "react"

export function MockLabel({
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
