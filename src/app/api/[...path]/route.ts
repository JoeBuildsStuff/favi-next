import { problemResponse } from "@/lib/api-error"

export const runtime = "nodejs"

export function GET(request: Request) {
  return problemResponse("not_found", request)
}

export function HEAD(request: Request) {
  const response = problemResponse("not_found", request)
  return new Response(null, {
    status: response.status,
    headers: response.headers,
  })
}

export const POST = GET
export const PUT = GET
export const PATCH = GET
export const DELETE = GET
