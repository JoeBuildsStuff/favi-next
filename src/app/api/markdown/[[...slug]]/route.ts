import {
  blocksToMarkdown,
  getAgentPage,
  markdownHeaders,
} from "@/lib/agent-pages"

export const runtime = "nodejs"

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug?: string[] }> }
) {
  const { slug = [] } = await context.params
  const pathname = `/${slug.filter(Boolean).join("/")}`
  const page = getAgentPage(pathname)
  return new Response(blocksToMarkdown(page.blocks), {
    status: page.status,
    headers: markdownHeaders(),
  })
}

export async function HEAD(
  request: Request,
  context: { params: Promise<{ slug?: string[] }> }
) {
  const response = await GET(request, context)
  return new Response(null, {
    status: response.status,
    headers: response.headers,
  })
}
