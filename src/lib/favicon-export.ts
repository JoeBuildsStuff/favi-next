import { Resvg } from "@resvg/resvg-js"
import JSZip from "jszip"

import {
  bodyToCompose,
  composeIconSvg,
  composeInitialsSvg,
  darkCompose,
  normalizeInitials,
  type ComposeOpts,
} from "@/lib/favicon-svg"
import type { ExportBody } from "@/lib/types"

const PWA_SIZES = [192, 512] as const
const MASKABLE_PADDING = 0.2

function svgToPng(svg: string, size: number): Buffer {
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: size },
    font: { loadSystemFonts: true },
  })
  return Buffer.from(resvg.render().asPng())
}

function pngsToIco(pngs: { size: number; data: Buffer }[]): Buffer {
  const count = pngs.length
  const headerSize = 6 + 16 * count
  let offset = headerSize
  const entries = pngs.map((p) => {
    const entry = {
      width: p.size >= 256 ? 0 : p.size,
      height: p.size >= 256 ? 0 : p.size,
      bytes: p.data.length,
      offset,
    }
    offset += p.data.length
    return entry
  })
  const buf = Buffer.alloc(offset)
  buf.writeUInt16LE(0, 0)
  buf.writeUInt16LE(1, 2)
  buf.writeUInt16LE(count, 4)
  let cursor = 6
  for (const e of entries) {
    buf.writeUInt8(e.width, cursor)
    buf.writeUInt8(e.height, cursor + 1)
    buf.writeUInt8(0, cursor + 2)
    buf.writeUInt8(0, cursor + 3)
    buf.writeUInt16LE(1, cursor + 4)
    buf.writeUInt16LE(32, cursor + 6)
    buf.writeUInt32LE(e.bytes, cursor + 8)
    buf.writeUInt32LE(e.offset, cursor + 12)
    cursor += 16
  }
  pngs.forEach((p, i) => {
    p.data.copy(buf, entries[i].offset)
  })
  return buf
}

function htmlLinks(includeDark: boolean): string {
  const lines = includeDark
    ? [
        '<link rel="icon" href="/favicon.svg" type="image/svg+xml" media="(prefers-color-scheme: light)">',
        '<link rel="icon" href="/favicon-dark.svg" type="image/svg+xml" media="(prefers-color-scheme: dark)">',
        '<link rel="icon" href="/favicon.ico" sizes="any">',
      ]
    : [
        '<link rel="icon" href="/favicon.svg" type="image/svg+xml">',
        '<link rel="icon" href="/favicon.ico" sizes="any">',
      ]
  lines.push('<link rel="apple-touch-icon" href="/apple-touch-icon.png">')
  lines.push('<link rel="manifest" href="/site.webmanifest">')
  return lines.join("\n")
}

function buildReadme(includeDark: boolean): string {
  const links = htmlLinks(includeDark)
  return [
    "Files: favicon.svg, favicon.ico, apple-touch-icon.png, android-chrome-192x192.png, android-chrome-512x512.png, site.webmanifest",
    includeDark ? "Also includes favicon-dark.svg for prefers-color-scheme: dark." : "",
    "",
    "## Generic HTML",
    "Drop the files into your site public/static root, then add to <head>:",
    "",
    links,
    "",
    "## Next.js (App Router)",
    "Copy into `public/`, or use file-based metadata:",
    "  app/icon.svg          ← from favicon.svg",
    "  app/favicon.ico       ← from favicon.ico",
    "  app/apple-icon.png    ← from apple-touch-icon.png",
    "",
  ]
    .filter((line) => line !== undefined)
    .join("\n")
}

function webmanifest(opts: ComposeOpts, siteName: string): string {
  const name = siteName.trim() || "App"
  const theme = opts.bg || "#ffffff"
  const icons = PWA_SIZES.flatMap((size) => [
    {
      src: `/android-chrome-${size}x${size}.png`,
      sizes: `${size}x${size}`,
      type: "image/png",
      purpose: "any",
    },
    {
      src: `/android-chrome-${size}x${size}.png`,
      sizes: `${size}x${size}`,
      type: "image/png",
      purpose: "maskable",
    },
  ])
  return `${JSON.stringify(
    {
      name,
      short_name: name.length <= 12 ? name : `${name.slice(0, 11)}…`,
      icons,
      theme_color: theme,
      background_color: theme,
      display: "standalone",
    },
    null,
    2
  )}\n`
}

export async function buildFaviconZip(input: {
  svgRaw?: string | null
  text?: string | null
  body: ExportBody
}): Promise<{ zip: Buffer; filename: string }> {
  const body = input.body
  const initials = normalizeInitials(input.text ?? body.text ?? "")
  const useInitials = Boolean((input.text ?? body.text ?? "").trim())
  if (useInitials && !initials) {
    throw new Error("text must contain 1–2 Latin letters or digits")
  }
  if (!useInitials && !input.svgRaw) {
    throw new Error("Provide library+name, or text for initials")
  }

  const opts = bodyToCompose(body)
  const render = (o: ComposeOpts) =>
    useInitials
      ? composeInitialsSvg(initials, o)
      : composeIconSvg(input.svgRaw!, o)

  const faviconSvg = render({ ...opts, canvas: 32 })
  const png16 = svgToPng(faviconSvg, 16)
  const png32 = svgToPng(faviconSvg, 32)
  const png48 = svgToPng(faviconSvg, 48)
  const ico = pngsToIco([
    { size: 16, data: png16 },
    { size: 32, data: png32 },
    { size: 48, data: png48 },
  ])

  const zip = new JSZip()
  zip.file("favicon.svg", faviconSvg)
  zip.file("favicon.ico", ico)
  if (body.include_dark_mode) {
    zip.file("favicon-dark.svg", render({ ...darkCompose(opts, body), canvas: 32 }))
  }

  const touchOpts: ComposeOpts = {
    ...opts,
    padding: Math.max(0.12, opts.padding * 0.7),
    shape: opts.shape === "none" ? "rounded-square" : opts.shape,
    canvas: 180,
  }
  zip.file("apple-touch-icon.png", svgToPng(render(touchOpts), 180))

  for (const size of PWA_SIZES) {
    const mask: ComposeOpts = {
      ...opts,
      bg: opts.bg ?? "#ffffff",
      padding: Math.max(MASKABLE_PADDING, opts.padding),
      shape: opts.shape === "none" ? "rounded-square" : opts.shape,
      canvas: size,
    }
    zip.file(`android-chrome-${size}x${size}.png`, svgToPng(render(mask), size))
  }

  zip.file("site.webmanifest", webmanifest(opts, body.site_name ?? "App"))
  zip.file("README.txt", buildReadme(Boolean(body.include_dark_mode)))

  const filename = useInitials
    ? `initials-${initials.toLowerCase()}-favicon.zip`
    : `${body.library}-${body.name}-favicon.zip`

  const zipBuf = await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
  })
  return { zip: zipBuf, filename }
}
