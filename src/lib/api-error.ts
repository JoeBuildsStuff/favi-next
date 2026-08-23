import { absoluteUrl } from "@/lib/site"

/** RFC 9457 */
export const PROBLEM_JSON = "application/problem+json"

export type ApiErrorCode =
  | "not_found"
  | "method_not_allowed"
  | "invalid_json"
  | "invalid_shape"
  | "invalid_bg_mode"
  | "invalid_text"
  | "missing_export_source"
  | "icon_not_found"
  | "index_unavailable"
  | "export_failed"
  | "rate_limited"

type ErrorDef = {
  status: number
  title: string
  detail: string
  hint: string
}

export const API_ERROR_CATALOG: Record<ApiErrorCode, ErrorDef> = {
  not_found: {
    status: 404,
    title: "Not found",
    detail: "No HTTP API resource exists at this path.",
    hint: "GET /api for the endpoint index, GET /openapi.json for the OpenAPI spec, or GET /docs for favi developer resources.",
  },
  method_not_allowed: {
    status: 405,
    title: "Method not allowed",
    detail: "This path does not support the HTTP method you used.",
    hint: "Check the Allow header and GET /openapi.json for supported methods.",
  },
  invalid_json: {
    status: 400,
    title: "Invalid JSON",
    detail: "The request body is not valid JSON.",
    hint: "Send Content-Type: application/json with a JSON object. See POST /api/export in /openapi.json.",
  },
  invalid_shape: {
    status: 400,
    title: "Invalid shape",
    detail: "shape must be rounded-square, circle, or none.",
    hint: "Omit shape for the default rounded-square plate, or pass one of the three enum values.",
  },
  invalid_bg_mode: {
    status: 400,
    title: "Invalid bg_mode",
    detail: "bg_mode must be solid or linear.",
    hint: "Use solid (default) or linear with bg_to (and optional bg_angle) for a two-stop plate.",
  },
  invalid_text: {
    status: 400,
    title: "Invalid initials",
    detail: "text must contain 1–2 Latin letters or digits.",
    hint: "Pass text like \"JT\" for initials, or omit text and send library + name instead.",
  },
  missing_export_source: {
    status: 400,
    title: "Missing export source",
    detail: "Provide library+name, or text for initials.",
    hint: "Search with GET /api/icons?q= then POST {library,name,style}, or POST {text:\"AB\"}.",
  },
  icon_not_found: {
    status: 404,
    title: "Icon not found",
    detail: "No icon matches that library, name, and style.",
    hint: "GET /api/libraries for slugs, then GET /api/icons?q= to find a name, or GET /api/icons/{library}/{name}.",
  },
  index_unavailable: {
    status: 503,
    title: "Index unavailable",
    detail: "The icon catalog could not be loaded.",
    hint: "Retry GET /api/health. If this persists locally, run pnpm icons:index.",
  },
  export_failed: {
    status: 500,
    title: "Export failed",
    detail: "The favicon zip could not be built.",
    hint: "Retry once. Confirm library/name/style or text, then POST /api/export again.",
  },
  rate_limited: {
    status: 429,
    title: "Rate limited",
    detail: "This client IP exceeded the production rate limit.",
    hint: "Wait and retry. Do not poll. Limits: POST /api/export 20/60s; GET /api/icons 120/60s; GET /api/health and /api/libraries 40/60s.",
  },
}

export type ProblemDocument = {
  type: string
  title: string
  status: number
  detail: string
  instance: string
  code: ApiErrorCode
  hint: string
}

export function problemTypeUrl(code: ApiErrorCode): string {
  return `${absoluteUrl("/docs/errors")}#${code}`
}

export function problemDocument(
  code: ApiErrorCode,
  instance: string,
  overrides?: Partial<Pick<ProblemDocument, "detail" | "hint">>
): ProblemDocument {
  const def = API_ERROR_CATALOG[code]
  return {
    type: problemTypeUrl(code),
    title: def.title,
    status: def.status,
    detail: overrides?.detail ?? def.detail,
    instance,
    code,
    hint: overrides?.hint ?? def.hint,
  }
}

export function problemResponse(
  code: ApiErrorCode,
  request: Request,
  extra?: {
    headers?: HeadersInit
    detail?: string
    hint?: string
  }
): Response {
  const instance = new URL(request.url).pathname
  const body = problemDocument(code, instance, extra)
  const headers = new Headers(extra?.headers)
  headers.set("Content-Type", PROBLEM_JSON)
  return new Response(JSON.stringify(body), {
    status: body.status,
    headers,
  })
}

export function methodNotAllowed(request: Request, allow: readonly string[]): Response {
  return problemResponse("method_not_allowed", request, {
    headers: { Allow: allow.join(", ") },
  })
}

export const GET_ONLY = ["GET", "HEAD"] as const
export const POST_ONLY = ["POST"] as const
