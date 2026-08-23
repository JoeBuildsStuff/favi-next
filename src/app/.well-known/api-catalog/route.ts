import {
  API_CATALOG,
  API_CATALOG_CONTENT_TYPE,
  API_CATALOG_LINK,
} from "@/lib/api-catalog"

function catalogHeaders() {
  return {
    "Content-Type": API_CATALOG_CONTENT_TYPE,
    Link: API_CATALOG_LINK,
    "Cache-Control": "public, max-age=300",
  }
}

export function GET() {
  return new Response(JSON.stringify(API_CATALOG), {
    headers: catalogHeaders(),
  })
}

export function HEAD() {
  return new Response(null, {
    headers: catalogHeaders(),
  })
}
