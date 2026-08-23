export const SITE_NAME = "favi"
export const SITE_TAGLINE = "favicon picker and HTTP API"
export const SITE_ORIGIN = "https://getfavi.vercel.app"
export const SITE_GITHUB = "https://github.com/JoeBuildsStuff/favi-next"
export const SITE_DESCRIPTION =
  "favi is a public favicon picker and HTTP API for free icon libraries (Lucide, Tabler, Phosphor, Hugeicons, Remix Icon). Search icons, recolor them, compose initials, and download a favicon zip (SVG, ICO, apple-touch, and PWA assets) from getfavi.vercel.app."

export const SITE = {
  name: SITE_NAME,
  alternateNames: ["getfavi", "favi-next", "getfavi.vercel.app"],
  title: `${SITE_NAME} — ${SITE_TAGLINE}`,
  description: SITE_DESCRIPTION,
  url: SITE_ORIGIN,
  github: SITE_GITHUB,
  skillInstall: "npx skills add JoeBuildsStuff/favi-next",
} as const

export function absoluteUrl(path = "/"): string {
  if (!path || path === "/") return SITE_ORIGIN
  return `${SITE_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`
}
