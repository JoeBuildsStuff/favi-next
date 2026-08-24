import {
  BRAND_MARKS,
  type BrandMark,
  type BrandMarkId,
} from "@/lib/brand-mock-icons"

export const BRAND_BY_ID = Object.fromEntries(
  BRAND_MARKS.map((b) => [b.id, b])
) as Record<BrandMarkId, BrandMark>

/** Tabler brand marks mocked as tiny favicon plates for browser / home screens. */
export function BrandBookmark({
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
