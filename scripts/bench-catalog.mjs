import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { spawnSync } from "node:child_process"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const indexPath = path.join(root, "generated", "icon-index.json")

if (!fs.existsSync(indexPath)) {
  console.error(
    "Icon index missing. Run `pnpm icons:index` from the project root."
  )
  process.exit(1)
}

const vitest = path.join(root, "node_modules", ".bin", "vitest")
const result = spawnSync(
  vitest,
  [
    "run",
    "src/server/catalog/catalog.bench.test.ts",
    "--disableConsoleIntercept",
  ],
  {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, BENCH_CATALOG: "1" },
  }
)

process.exit(result.status ?? 1)
