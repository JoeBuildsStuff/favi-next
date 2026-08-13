import { NextResponse } from "next/server"

import { getIcon } from "@/lib/catalog"
import { buildFaviconZip } from "@/lib/favicon-export"
import { normalizeInitials } from "@/lib/favicon-svg"
import type { ExportBody, PlateShape } from "@/lib/types"

export const runtime = "nodejs"

const SHAPES = new Set<PlateShape>(["rounded-square", "circle", "none"])

export async function POST(request: Request) {
  let body: ExportBody
  try {
    body = (await request.json()) as ExportBody
  } catch {
    return NextResponse.json({ detail: "Invalid JSON" }, { status: 400 })
  }

  if (body.shape && !SHAPES.has(body.shape)) {
    return NextResponse.json({ detail: "Invalid shape" }, { status: 400 })
  }
  if (body.bg_mode && body.bg_mode !== "solid" && body.bg_mode !== "linear") {
    return NextResponse.json({ detail: "Invalid bg_mode" }, { status: 400 })
  }

  const initials = normalizeInitials(body.text ?? "")
  const useInitials = Boolean((body.text ?? "").trim())
  if (useInitials && !initials) {
    return NextResponse.json(
      { detail: "text must contain 1–2 Latin letters or digits" },
      { status: 400 }
    )
  }
  if (!useInitials && (!body.library || !body.name)) {
    return NextResponse.json(
      { detail: "Provide library+name, or text for initials" },
      { status: 400 }
    )
  }

  try {
    let svgRaw: string | null = null
    if (!useInitials) {
      const icon = getIcon(body.library!, body.name!, body.style ?? "")
      if (!icon) {
        return NextResponse.json({ detail: "Icon not found" }, { status: 404 })
      }
      svgRaw = icon.svg
    }

    const { zip, filename } = await buildFaviconZip({
      svgRaw,
      text: useInitials ? initials : null,
      body,
    })

    return new NextResponse(new Uint8Array(zip), {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (err) {
    return NextResponse.json(
      { detail: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    )
  }
}
