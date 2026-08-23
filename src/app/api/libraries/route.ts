import { GET_ONLY, methodNotAllowed, problemResponse } from "@/lib/api-error"
import { apiJson } from "@/lib/api-response"
import { listLibraries } from "@/lib/catalog"

export const runtime = "nodejs"

export async function GET(request: Request) {
  try {
    return apiJson(request, { libraries: listLibraries() })
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
