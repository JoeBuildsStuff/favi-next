import type { IconItem } from "@/lib/api"
import {
  DEFAULT_SITE_NAME,
  normalizeInitials,
  serializeFaviconConfigSearch,
  type FaviconSettings,
  type FaviconSourceMode,
} from "@/lib/favicon-settings"

/** Public Vercel deployment agents should hit (not localhost or OptiPlex). */
export const FAVI_PUBLIC_BASE = "https://getfavi.vercel.app"

export type InstallPromptInput = {
  selected: IconItem | null
  settings: FaviconSettings
  siteName?: string
  baseUrl?: string
  sourceMode?: FaviconSourceMode
  initialsText?: string
}

function exportBody(
  selected: IconItem | null,
  settings: FaviconSettings,
  siteName: string | undefined,
  sourceMode: FaviconSourceMode,
  initialsText: string
) {
  const solidTransparent =
    settings.bgMode === "solid" &&
    settings.shape === "none" &&
    !settings.bg
  const bg = solidTransparent ? null : settings.bg
  const body: Record<string, unknown> = {
    bg,
    fill: settings.fill,
    // Use "none" so the API does not fall back to legacy `fg`.
    stroke: settings.stroke ?? "none",
    padding: settings.padding,
    stroke_scale: settings.strokeScale,
    shape: settings.shape,
    bg_mode: settings.bgMode,
    include_dark_mode: settings.includeDarkMode,
    site_name: siteName?.trim() || DEFAULT_SITE_NAME,
  }
  if (sourceMode === "initials") {
    body.text = normalizeInitials(initialsText)
  } else if (selected) {
    body.library = selected.library
    body.name = selected.name
    body.style = selected.style
  }
  if (settings.bgMode === "linear") {
    body.bg_to = settings.bgTo
    body.bg_angle = settings.bgAngle
  }
  if (settings.includeDarkMode) {
    body.dark_bg =
      settings.bgMode === "solid" &&
      settings.shape === "none" &&
      !settings.darkBg
        ? null
        : settings.darkBg
    body.dark_fill = settings.darkFill
    body.dark_stroke = settings.darkStroke ?? "none"
    if (settings.bgMode === "linear") {
      body.dark_bg_to = settings.darkBgTo
    }
  }
  return body
}

function htmlSnippet(includeDarkMode: boolean): string {
  const lines = includeDarkMode
    ? [
        `<link rel="icon" href="/favicon.svg" type="image/svg+xml" media="(prefers-color-scheme: light)" />`,
        `<link rel="icon" href="/favicon-dark.svg" type="image/svg+xml" media="(prefers-color-scheme: dark)" />`,
        `<link rel="icon" href="/favicon.ico" sizes="any" />`,
      ]
    : [
        `<link rel="icon" href="/favicon.svg" type="image/svg+xml" />`,
        `<link rel="icon" href="/favicon.ico" sizes="any" />`,
      ]
  lines.push(`<link rel="apple-touch-icon" href="/apple-touch-icon.png" />`)
  lines.push(`<link rel="manifest" href="/site.webmanifest" />`)
  return lines.join("\n")
}

function fileCopyNote(includeDarkMode: boolean): string {
  const extras = [
    ...(includeDarkMode ? ["`favicon-dark.svg`"] : []),
    "`apple-touch-icon.png`",
    "`android-chrome-192x192.png`",
    "`android-chrome-512x512.png`",
    "`site.webmanifest`",
  ]
  return `, ${extras.slice(0, -1).join(", ")}, and ${extras[extras.length - 1]}`
}

function frameworkInstallSections(includeDarkMode: boolean): string {
  const links = htmlSnippet(includeDarkMode)
  const packNotes = [
    ...(includeDarkMode ? ["includes dark-mode SVG"] : []),
    "includes `apple-touch-icon.png`",
    "includes PWA / maskable pack",
  ]
  const packNote = ` (${packNotes.join("; ")})`
  const nextDarkNote = includeDarkMode
    ? "\nAlso copy `favicon-dark.svg` into `public/` and keep the `media=\"(prefers-color-scheme: …)\"` link tags from Option A (file-based metadata only covers one icon)."
    : ""
  const filesNote = fileCopyNote(includeDarkMode)

  return `## Install into the project
1. Unzip \`favicon.zip\` into a temp directory.
2. Prefer the matching framework section below; fall back to generic HTML if unsure.
3. Remove leftover default favicon assets (e.g. \`vite.svg\`) if unused.
4. Briefly confirm the files landed and the head tags are wired.

### Generic HTML
Copy \`favicon.svg\` and \`favicon.ico\`${filesNote} into the site public/static root. Add to \`<head>\`:

\`\`\`html
${links}
\`\`\`

### Vite
Copy the zip files into \`public/\`${packNote}. Add the same tags to \`index.html\` \`<head>\`:

\`\`\`html
${links}
\`\`\`

### Next.js (App Router)
**Option A — \`public/\` + layout head:** copy files into \`public/\`, then add the tags in \`app/layout.tsx\` (or shared head):

\`\`\`html
${links}
\`\`\`

**Option B — file-based metadata:** place files under \`app/\` and skip manual favicon \`<link>\` tags:
- \`app/icon.svg\` ← from \`favicon.svg\`
- \`app/favicon.ico\` ← from \`favicon.ico\`
- \`app/apple-icon.png\` ← from \`apple-touch-icon.png\`${nextDarkNote}
Also copy \`site.webmanifest\` + \`android-chrome-*.png\` into \`public/\` and add the manifest \`<link>\` from Option A.

### Astro
Copy the zip files into \`public/\`. Add the tags in your layout head (e.g. \`src/layouts/Layout.astro\`):

\`\`\`html
${links}
\`\`\`
`
}

/** LLM-ready install prompt: skill workflow + the user's current selection. */
export function buildInstallPrompt({
  selected,
  settings,
  siteName,
  baseUrl = FAVI_PUBLIC_BASE,
  sourceMode = "library",
  initialsText = "",
}: InstallPromptInput): string {
  const resolvedSite = siteName?.trim() || DEFAULT_SITE_NAME
  const letters = normalizeInitials(initialsText)
  const body = exportBody(
    selected,
    settings,
    resolvedSite,
    sourceMode,
    letters
  )
  const bodyJson = JSON.stringify(body, null, 2)
  const site =
    resolvedSite !== DEFAULT_SITE_NAME ? resolvedSite : null
  const shareQuery = serializeFaviconConfigSearch({
    icon:
      sourceMode === "library" && selected
        ? {
            library: selected.library,
            name: selected.name,
            style: selected.style,
          }
        : null,
    settings,
    siteName: resolvedSite,
    sourceMode,
    initialsText: letters,
  })
  const shareUrl = shareQuery ? `${baseUrl}/?${shareQuery}` : `${baseUrl}/`

  const selectionBlock =
    sourceMode === "initials"
      ? `- Mode: initials / letters
- Text: \`${letters}\`${site ? `\n- Site name (manifest): ${site}` : ""}`
      : `- Library: \`${selected!.library}\` (${selected!.library_name})
- Name: \`${selected!.name}\`
- Style: \`${selected!.style}\`${site ? `\n- Site name (manifest): ${site}` : ""}`

  return `Install this favicon into the current web project using the favi HTTP API.

Prefer curl / fetch against the public API. Do not drive the browser UI. API index: ${baseUrl}/llms.txt
Skill reference: ${baseUrl}/skills/favi/SKILL.md

## Selected favicon
${selectionBlock}${
    settings.includeDarkMode
      ? "\n- Dark-mode SVG: `favicon-dark.svg` with prefers-color-scheme media links"
      : ""
  }
- Shareable UI config: ${shareUrl}

## Exact export body
POST \`${baseUrl}/api/export\` with this JSON (use these values exactly — they match the user's current favi settings):

\`\`\`json
${bodyJson}
\`\`\`

Ready-to-run:

\`\`\`bash
curl -sS -X POST ${baseUrl}/api/export \\
  -H 'Content-Type: application/json' \\
  -d '${JSON.stringify(body)}' \\
  -o favicon.zip
\`\`\`

${frameworkInstallSections(settings.includeDarkMode)}
Do not invent a different icon, colors, padding, stroke scale, or shape — use the export body above.`
}
