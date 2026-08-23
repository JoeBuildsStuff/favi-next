import { NextResponse } from "next/server"

import { applyApiHeaders } from "@/lib/rate-limit"

export function apiJson(
  request: Request,
  body: unknown,
  init?: ResponseInit
): NextResponse {
  const status = init?.status ?? 200
  const headers = new Headers(init?.headers)
  applyApiHeaders(headers, request, status)
  return NextResponse.json(body, { ...init, status, headers })
}

export function apiBody(
  request: Request,
  body: BodyInit | null,
  init: ResponseInit
): NextResponse {
  const status = init.status ?? 200
  const headers = new Headers(init.headers)
  applyApiHeaders(headers, request, status)
  return new NextResponse(body, { ...init, status, headers })
}
