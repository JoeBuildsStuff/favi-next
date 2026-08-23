import { NextResponse } from "next/server"

import { GET_ONLY, methodNotAllowed, problemResponse } from "@/lib/api-error"
import { listLibraries } from "@/lib/catalog"

export const runtime = "nodejs"

export async function GET(request: Request) {
  try {
    return NextResponse.json({ libraries: listLibraries() })
  } catch (err) {
    return problemResponse("index_unavailable", request, {
      detail: err instanceof Error ? err.message : String(err),
    })
  }
}

export function POST(request: Request) {
  return methodNotAllowed(request, GET_ONLY)
}

export const PUT = POST
export const PATCH = POST
export const DELETE = POST
