import { developerBlocks } from "@/lib/agent-pages"
import { createAgentDocPage } from "@/lib/agent-pages/doc-page"

const page = createAgentDocPage({
  path: "/developers",
  title: "getfavi (favi) developer resources",
  description:
    "getfavi developer resources for the Vercel-hosted favicon HTTP API at getfavi.vercel.app: API docs, OpenAPI spec, auth docs, webhooks, MCP server.",
  canonical: "/for-agents",
  markdownPath: "/developers",
  blocks: developerBlocks,
})

export const metadata = page.metadata
export default page.Page
