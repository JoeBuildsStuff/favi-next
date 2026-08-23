export const SITE_NAME = "favi"
export const SITE_BRAND = "getfavi"
export const SITE_TAGLINE = "favicon picker and HTTP API"
export const SITE_ORIGIN = "https://getfavi.vercel.app"
export const SITE_GITHUB = "https://github.com/JoeBuildsStuff/favi-next"
export const SITE_CONTACT = `${SITE_GITHUB}/issues`
export const SITE_DESCRIPTION =
  "favi is a public favicon picker and HTTP API for free icon libraries (Lucide, Tabler, Phosphor, Hugeicons, Remix Icon). Search icons, recolor them, compose initials, and download a favicon zip (SVG, ICO, apple-touch, and PWA assets) from getfavi.vercel.app."

export const SITE_OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "getfavi (favi) — favicon picker and HTTP API",
} as const

export const SITE = {
  name: SITE_NAME,
  brand: SITE_BRAND,
  alternateNames: ["getfavi", "favi-next", "getfavi.vercel.app"],
  title: `${SITE_NAME} — ${SITE_TAGLINE}`,
  description: SITE_DESCRIPTION,
  url: SITE_ORIGIN,
  github: SITE_GITHUB,
  contact: SITE_CONTACT,
  skillInstall: "npx skills add JoeBuildsStuff/favi-next",
  ogImage: SITE_OG_IMAGE,
} as const

export function absoluteUrl(path = "/"): string {
  if (!path || path === "/") return SITE_ORIGIN
  return `${SITE_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`
}
