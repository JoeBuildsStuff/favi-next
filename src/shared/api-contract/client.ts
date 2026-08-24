import type { ExportBody, IconItem, Library } from "@/shared/api-contract"

export type { ExportBody as ExportOptions, IconItem, Library } from "@/shared/api-contract"

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || res.statusText)
  }
  return res.json() as Promise<T>
}

export async function fetchLibraries(): Promise<{ libraries: Library[] }> {
  return json(await fetch("/api/libraries"))
}

export async function fetchIcons(params: {
  q?: string
  library?: string | null
  style?: string | null
  limit?: number
  offset?: number
}): Promise<{ total: number; icons: IconItem[]; limit: number; offset: number }> {
  const sp = new URLSearchParams()
  if (params.q) sp.set("q", params.q)
  if (params.library) sp.set("library", params.library)
  if (params.style) sp.set("style", params.style)
  sp.set("limit", String(params.limit ?? 72))
  sp.set("offset", String(params.offset ?? 0))
  return json(await fetch(`/api/icons?${sp}`))
}

export async function fetchIcon(
  library: string,
  name: string,
  style = "outline"
): Promise<IconItem> {
  const sp = new URLSearchParams({ style })
  return json(
    await fetch(
      `/api/icons/${encodeURIComponent(library)}/${encodeURIComponent(name)}?${sp}`
    )
  )
}

export async function exportFaviconZip(body: ExportBody): Promise<Blob> {
  const res = await fetch("/api/export", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || res.statusText)
  }
  return res.blob()
}
