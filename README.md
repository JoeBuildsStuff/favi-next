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

Production: https://getfavi.vercel.app  
Agent index: https://getfavi.vercel.app/llms.txt  
Skill: https://getfavi.vercel.app/skills/favi/SKILL.md

```bash
npx skills add JoeBuildsStuff/favi-next
```

## API

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Status and indexed icon count |
| `GET` | `/api/libraries` | Packs, styles, and counts |
| `GET` | `/api/icons` | Search (`q`, `library`, `style`, `limit`, `offset`) |
| `GET` | `/api/icons/:library/:name` | Exact icon (`style` query) |
| `POST` | `/api/export` | Favicon zip (JSON body) |

### Rate limits (production)

Production (`https://getfavi.vercel.app`) rate-limits by client IP at the Vercel WAF. Local `pnpm dev` is not limited. Exceeding a limit returns **429**. Wait and retry; do not tight-loop.

| Method | Path | Limit |
| --- | --- | --- |
| `POST` | `/api/export` | 20 requests / 60s / IP |
| `GET` | `/api/icons` and `/api/icons/:library/:name` | 120 requests / 60s / IP |
| `GET` | `/api/health` and `/api/libraries` | 40 requests / 60s / IP |

Counters are per Vercel region. Search, look up, then export once — do not poll.

Example:

```bash
curl -sS "http://127.0.0.1:3000/api/icons?q=image&library=lucide&style=outline&limit=12"
```
