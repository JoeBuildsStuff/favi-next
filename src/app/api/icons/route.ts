import { NextResponse } from "next/server"

import { searchIcons } from "@/lib/catalog"

export const runtime = "nodejs"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const q = url.searchParams.get("q") ?? ""
  const library = url.searchParams.get("library")
  const style = url.searchParams.get("style")
  const limit = Number(url.searchParams.get("limit") ?? 96)
  const offset = Number(url.searchParams.get("offset") ?? 0)

  try {
    return NextResponse.json(
      searchIcons({
        q,
        library: library || null,
        style: style || null,
        limit: Number.isFinite(limit) ? limit : 96,
        offset: Number.isFinite(offset) ? offset : 0,
      })
    )
  } catch (err) {
    return NextResponse.json(
      { detail: err instanceof Error ? err.message : String(err) },
      { status: 503 }
    )
  }
}
