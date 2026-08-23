import type { Metadata } from "next"

import { AgentDocShell } from "@/components/agent-doc-shell"
import { developerBlocks } from "@/lib/agent-pages"

export const metadata: Metadata = {
  title: "getfavi (favi) agent resources",
  description:
    "Markdown-friendly getfavi agent resources: when to use the free favicon API, how to search icons, and how to export favicon packages without browser automation.",
  alternates: {
    canonical: "/agents",
    types: {
      "text/markdown": "/agents",
    },
  },
}

export default function AgentsPage() {
  return <AgentDocShell blocks={developerBlocks} />
}
