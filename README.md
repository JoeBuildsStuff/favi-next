# favi-next

Search Lucide, Tabler, Phosphor, Hugeicons, and Remix Icon, compose a favicon (color, plate, dark mode, or initials), and export a zip with SVG, ICO, apple-touch, and PWA assets.

Icon packs are npm dependencies. A JSON index is built with `pnpm icons:index`; search is an in-memory filter. PNG/ICO/zip export uses `@resvg/resvg-js`.

## Run locally

```bash
pnpm install
pnpm icons:index   # ~26k icons from npm packs; skipped on later `pnpm dev` if generated/
pnpm dev           # http://127.0.0.1:3000
```

Health: http://127.0.0.1:3000/api/health

## API

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Status and indexed icon count |
| `GET` | `/api/libraries` | Packs, styles, and counts |
| `GET` | `/api/icons` | Search (`q`, `library`, `style`, `limit`, `offset`) |
| `GET` | `/api/icons/:library/:name` | Exact icon (`style` query) |
| `POST` | `/api/export` | Favicon zip (JSON body) |

Example:

```bash
curl -sS "http://127.0.0.1:3000/api/icons?q=image&library=lucide&style=outline&limit=12"
```
