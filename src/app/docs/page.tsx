import { developerBlocks } from "@/lib/agent-pages"
import { createAgentDocPage } from "@/lib/agent-pages/doc-page"

const page = createAgentDocPage({
  path: "/docs",
  title: "getfavi (favi) developer resources",
  description:
    "getfavi developer resources for the Vercel-hosted favicon HTTP API at getfavi.vercel.app: OpenAPI spec, authentication, webhooks, MCP, and the agent skill.",
  canonical: "/for-agents",
  markdownPath: "/docs",
  blocks: developerBlocks,
})

export const metadata = page.metadata
export default page.Page
