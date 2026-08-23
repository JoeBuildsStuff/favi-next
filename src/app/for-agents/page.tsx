import type { Metadata } from "next"

import { AgentDocShell } from "@/components/agent-doc-shell"
import { developerBlocks } from "@/lib/agent-pages"

export const metadata: Metadata = {
  title: "favi developer resources",
  description:
    "favi developer resources for the Vercel-hosted favicon HTTP API at getfavi.vercel.app: OpenAPI spec, authentication, webhooks, MCP, and the agent skill.",
  alternates: {
    canonical: "/for-agents",
    types: {
      "text/markdown": "/for-agents",
    },
  },
}

export default function ForAgentsPage() {
  return <AgentDocShell blocks={developerBlocks} />
}
