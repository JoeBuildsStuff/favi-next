import { vercelDocBlocks } from "@/lib/agent-pages"
import { createAgentDocPage } from "@/lib/agent-pages/doc-page"

const page = createAgentDocPage({
  path: "/vercel",
  title: "Vercel developer resources for getfavi (favi)",
  description:
    "Vercel developer resources for getfavi: API docs, OpenAPI spec, auth docs, webhooks, and MCP server notes for the Vercel-hosted favicon HTTP API.",
  canonical: "/docs/vercel",
  markdownPath: "/vercel",
  blocks: vercelDocBlocks,
})

export const metadata = page.metadata
export default page.Page
