import { NextResponse } from "next/server"

import { getIcon } from "@/lib/catalog"

export const runtime = "nodejs"

export async function GET(
  request: Request,
  context: { params: Promise<{ library: string; name: string }> }
) {
  const { library, name } = await context.params
  const style = new URL(request.url).searchParams.get("style")
  try {
    const icon = getIcon(library, name, style)
    if (!icon) {
      return NextResponse.json({ detail: "Icon not found" }, { status: 404 })
    }
    return NextResponse.json(icon)
  } catch (err) {
    return NextResponse.json(
      { detail: err instanceof Error ? err.message : String(err) },
      { status: 503 }
    )
  }
}
