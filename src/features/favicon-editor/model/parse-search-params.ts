import {
  parseFaviconConfigSearch,
  type ParsedFaviconConfig,
} from "@/lib/favicon-settings"

export function parseFaviconConfigFromRecord(
  record: Record<string, string | string[] | undefined>
): ParsedFaviconConfig {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(record)) {
    if (value === undefined) continue
    if (Array.isArray(value)) {
      for (const item of value) {
        params.append(key, item)
      }
    } else {
      params.set(key, value)
    }
  }
  return parseFaviconConfigSearch(params)
}
