---
name: favi
description: >-
  Search free icon libraries and export favicon packages (SVG, ICO, apple-touch,
  PWA / maskable icons) via the public favi API at getfavi.vercel.app.
  Use when the user wants a favicon, app icon, tab icon, PWA icon, or to
  pick/recolor an icon from Lucide, Tabler, Phosphor, Hugeicons, or Remix Icon
  without opening the UI.
---

# favi — favicon API skill

Prefer HTTP against the public API. Do not drive the browser UI unless the user asks for visual QA.

**Base URL:** `https://getfavi.vercel.app`  
**Local override:** `http://127.0.0.1:3000`

Production rate limits (per client IP, Vercel WAF). Over limit → **429**; wait and retry. Do not poll or retry in a tight loop. Local override is not rate-limited.

| Method | Path | Limit |
|--------|------|-------|
| `POST` | `/api/export` | 20 / 60s |
| `GET` | `/api/icons` and `/api/icons/:library/:name` | 120 / 60s |
| `GET` | `/api/health` and `/api/libraries` | 40 / 60s |

Typical agent flow (search → one lookup → one export) stays well under these caps.

Human UI: https://getfavi.vercel.app  
Agent index: https://getfavi.vercel.app/llms.txt  
favi developer resources: https://getfavi.vercel.app/for-agents  
OpenAPI: https://getfavi.vercel.app/openapi.json  
Source: https://github.com/JoeBuildsStuff/favi-next

## Workflow

1. Search or look up an icon
2. Confirm `library`, `name`, and `style` (or use `text` for initials)
3. `POST /api/export` with color/shape options
4. Unpack the zip into the target project and wire HTML `<link>` tags if installing as a site favicon

## API

### Health

```bash
curl -sS https://getfavi.vercel.app/api/health
```

### List libraries

```bash
curl -sS https://getfavi.vercel.app/api/libraries
```

### Search icons

```bash
curl -sS "https://getfavi.vercel.app/api/icons?q=image&library=lucide&style=outline&limit=12"
```

Query params: `q`, `library`, `style`, `limit` (1–300), `offset`.

`q` expands common synonyms locally (e.g. `photo` → `image`, `trash` → `delete`/`bin`, `gear` → `settings`) before matching.

Each hit includes `library`, `name`, `style`, and raw `svg`.

### Exact icon

```bash
curl -sS "https://getfavi.vercel.app/api/icons/lucide/image?style=outline"
```

### Export favicon zip

```bash
curl -sS -X POST https://getfavi.vercel.app/api/export \
  -H 'Content-Type: application/json' \
  -d '{
    "library": "lucide",
    "name": "image",
    "style": "outline",
    "bg": "#075985",
    "fill": null,
    "stroke": "#ffffff",
    "padding": 0.18,
    "stroke_scale": 1.25,
    "shape": "rounded-square",
    "include_dark_mode": false,
    "site_name": "My App"
  }' \
  -o favicon.zip
```

Initials / letters (no library icon) — pass `text` (1–2 Latin letters or digits) instead of `library` / `name`:

```bash
curl -sS -X POST https://getfavi.vercel.app/api/export \
  -H 'Content-Type: application/json' \
  -d '{
    "text": "JT",
    "bg": "#075985",
    "fill": "#ffffff",
    "padding": 0.1,
    "shape": "rounded-square",
    "site_name": "Joe Taylor"
  }' \
  -o favicon.zip
```

Zip contains:

- `favicon.svg`
- `favicon.ico`
- `favicon-dark.svg` (when `include_dark_mode` is true)
- `apple-touch-icon.png`
- `android-chrome-192x192.png`, `android-chrome-512x512.png`, `site.webmanifest`
- `README.txt` (HTML snippet)

### Export body defaults

| Field | Default | Notes |
|-------|---------|-------|
| `library` / `name` / `style` | — | Library icon lookup; omit when using `text` |
| `text` | — | Initials mode: 1–2 Latin letters/digits (uppercased); omit `library`/`name` |
| `bg` | `#075985` | Solid plate color, or gradient from-stop; use `null` with `shape: "none"` for transparent plate |
| `bg_mode` | `solid` | `solid` \| `linear` (2-stop linear plate gradient) |
| `bg_to` | `#0f172a` | Gradient to-stop when `bg_mode` is `linear` |
| `bg_angle` | `135` | CSS degrees (0 = to top, 90 = to right); only used for linear |
| `fill` | `null` | Icon fill color; `null` / `"none"` = no fill |
| `stroke` | inherits `fg` | Icon stroke color; `null` / `"none"` = no stroke; default `#ffffff` if unset |
| `fg` | `#ffffff` | Legacy alias for `stroke` when `stroke` omitted |
| `padding` | `0.18` | 0–0.4 inset |
| `stroke_scale` | `1.25` | 0.5–3.0 |
| `shape` | `rounded-square` | `rounded-square` \| `circle` \| `none` |
| `include_dark_mode` | `false` | Adds `favicon-dark.svg` + `prefers-color-scheme` link tags |
| `dark_bg` | `#ffffff` | Plate / gradient from for dark SVG when dark mode is on |
| `dark_bg_to` | `#e2e8f0` | Dark gradient to-stop when `bg_mode` is `linear` |
| `dark_fill` | `null` | Fill for dark SVG |
| `dark_stroke` | inherits `dark_fg` | Stroke for dark SVG; default `#075985` if unset |
| `site_name` | `App` | Manifest `name` / `short_name` |

Apple-touch and the PWA / maskable pack are always included. There is no `include_apple_touch` flag.

## Install into a web project

After export, unzip and follow the matching stack. Zip `README.txt` has the same snippets.

```bash
unzip -o favicon.zip -d /tmp/favi-favicon
```

### Vite

```bash
cp /tmp/favi-favicon/favicon.svg /tmp/favi-favicon/favicon.ico \
  /tmp/favi-favicon/apple-touch-icon.png \
  /tmp/favi-favicon/android-chrome-192x192.png \
  /tmp/favi-favicon/android-chrome-512x512.png \
  /tmp/favi-favicon/site.webmanifest web/public/
```

Add to `index.html` `<head>`:

```html
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<link rel="icon" href="/favicon.ico" sizes="any" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />
```

### Next.js (App Router)

- **`public/` + layout:** copy files into `public/`, add the same `<link>` tags in `app/layout.tsx`.
- **File-based metadata:** `app/icon.svg`, `app/favicon.ico`, `app/apple-icon.png` (from `apple-touch-icon.png`) — Next wires these automatically. Still put `site.webmanifest` + `android-chrome-*.png` in `public/` and add the manifest `<link>` when using the PWA pack.

### Astro

Copy files into `public/`. Add the `<link>` tags in the layout head (e.g. `src/layouts/Layout.astro`).

### Generic HTML

Same files into the static/public root; same `<link>` tags in `<head>`.

Remove leftover default assets (e.g. `vite.svg`) if unused. Prefer the framework section that matches the target project.

## Choosing an icon

- Prefer exact names when known (`lucide` + `image` + `outline`)
- Otherwise search with a short `q` (synonyms work: `photo`, `bin`, `gear`, …), skim the first page, then export
- Match library style names from `/api/libraries` (`outline`, `filled`, etc.)
- For monogram favicons, export with `text` (`"JT"`, `"F"`) instead of a library icon
- Keep contrast high for tiny favicon sizes (dark plate + light glyph is a safe default)

## Install this skill

```bash
npx skills add JoeBuildsStuff/favi-next
# or specifically:
npx skills add JoeBuildsStuff/favi-next --skill favi
```
