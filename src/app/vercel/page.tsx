import type { Metadata } from "next"

import { AgentDocShell } from "@/components/agent-doc-shell"
import { vercelDocBlocks } from "@/lib/agent-pages"

export const metadata: Metadata = {
  title: "Vercel developer resources for getfavi (favi)",
  description:
    "Vercel developer resources for getfavi: API docs, OpenAPI spec, auth docs, webhooks, and MCP server notes for the Vercel-hosted favicon HTTP API.",
  alternates: {
    canonical: "/docs/vercel",
    types: {
      "text/markdown": "/vercel",
    },
  },
}

export default function VercelDeveloperResourcesPage() {
  return <AgentDocShell blocks={vercelDocBlocks} />
}
