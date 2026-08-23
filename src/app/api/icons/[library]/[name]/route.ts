import { GET_ONLY, methodNotAllowed, problemResponse } from "@/lib/api-error"
import { apiJson } from "@/lib/api-response"
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
      return problemResponse("icon_not_found", request)
    }
    return apiJson(request, icon)
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
