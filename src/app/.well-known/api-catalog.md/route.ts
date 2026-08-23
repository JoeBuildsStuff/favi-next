import {
  API_CATALOG_LINK,
  API_CATALOG_MARKDOWN,
  API_CATALOG_MARKDOWN_CONTENT_TYPE,
} from "@/lib/api-catalog"

function catalogMarkdownHeaders() {
  return {
    "Content-Type": API_CATALOG_MARKDOWN_CONTENT_TYPE,
    Link: API_CATALOG_LINK,
    "Cache-Control": "public, max-age=300",
  }
}

export function GET() {
  return new Response(API_CATALOG_MARKDOWN, {
    headers: catalogMarkdownHeaders(),
  })
}

export function HEAD() {
  return new Response(null, {
    headers: catalogMarkdownHeaders(),
  })
}
