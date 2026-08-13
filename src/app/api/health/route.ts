import { NextResponse } from "next/server"

import { iconCount } from "@/lib/catalog"

export const runtime = "nodejs"

export async function GET() {
  try {
    return NextResponse.json({ status: "ok", icons: iconCount() })
  } catch (err) {
    return NextResponse.json(
      {
        status: "error",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 503 }
    )
  }
}
