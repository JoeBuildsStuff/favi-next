import { NextResponse } from "next/server"

import { POST_ONLY, methodNotAllowed, problemResponse } from "@/lib/api-error"
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
    return problemResponse("invalid_json", request)
  }

  if (body.shape && !SHAPES.has(body.shape)) {
    return problemResponse("invalid_shape", request)
  }
  if (body.bg_mode && body.bg_mode !== "solid" && body.bg_mode !== "linear") {
    return problemResponse("invalid_bg_mode", request)
  }

  const initials = normalizeInitials(body.text ?? "")
  const useInitials = Boolean((body.text ?? "").trim())
  if (useInitials && !initials) {
    return problemResponse("invalid_text", request)
  }
  if (!useInitials && (!body.library || !body.name)) {
    return problemResponse("missing_export_source", request)
  }

  try {
    let svgRaw: string | null = null
    if (!useInitials) {
      const icon = getIcon(body.library!, body.name!, body.style ?? "")
      if (!icon) {
        return problemResponse("icon_not_found", request)
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
    return problemResponse("export_failed", request, {
      detail: err instanceof Error ? err.message : String(err),
    })
  }
}

export function GET(request: Request) {
  return methodNotAllowed(request, POST_ONLY)
}

export const PUT = GET
export const PATCH = GET
export const DELETE = GET
