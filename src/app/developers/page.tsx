import type { Metadata } from "next"

import { AgentDocShell } from "@/components/agent-doc-shell"
import { developerBlocks } from "@/lib/agent-pages"

export const metadata: Metadata = {
  title: "getfavi (favi) developer resources",
  description:
    "getfavi developer resources for the Vercel-hosted favicon HTTP API at getfavi.vercel.app: API docs, OpenAPI spec, auth docs, webhooks, MCP server.",
  alternates: {
    canonical: "/for-agents",
    types: {
      "text/markdown": "/developers",
    },
  },
}

export default function DevelopersPage() {
  return <AgentDocShell blocks={developerBlocks} />
}
