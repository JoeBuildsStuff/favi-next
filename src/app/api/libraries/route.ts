import { NextResponse } from "next/server"

import { listLibraries } from "@/lib/catalog"

export const runtime = "nodejs"

export async function GET() {
  try {
    return NextResponse.json({ libraries: listLibraries() })
  } catch (err) {
    return NextResponse.json(
      { detail: err instanceof Error ? err.message : String(err) },
      { status: 503 }
    )
  }
}
