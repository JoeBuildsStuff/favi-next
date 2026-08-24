/** Muted app-icon placeholder — same language as browser chrome stubs. */
export function WireAppIcon({
  size = 48,
  shape = "squircle",
}: {
  size?: number
  shape?: "squircle" | "round" | "soft"
}) {
  const radius =
    shape === "round" ? "50%" : shape === "soft" ? "22%" : size * 0.2237
  return (
    <span
      className="inline-block bg-zinc-300 dark:bg-zinc-600"
      style={{ width: size, height: size, borderRadius: radius }}
    />
  )
}
