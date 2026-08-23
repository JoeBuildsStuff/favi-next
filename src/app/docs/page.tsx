import type { Metadata } from "next"

import { AgentDocShell } from "@/components/agent-doc-shell"
import { developerBlocks } from "@/lib/agent-pages"

export const metadata: Metadata = {
  title: "favi developer resources",
  description:
    "favi developer resources for the Vercel-hosted favicon HTTP API at getfavi.vercel.app: OpenAPI spec, authentication notes, rate limits, and the agent skill.",
  alternates: {
    canonical: "/for-agents",
    types: {
      "text/markdown": "/docs",
    },
  },
}

export default function DocsPage() {
  return <AgentDocShell blocks={developerBlocks} />
}
