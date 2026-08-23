import type { Metadata } from "next"

import { AgentDocShell } from "@/components/agent-doc-shell"
import { getfaviBlocks } from "@/lib/agent-pages"

export const metadata: Metadata = {
  title: "getfavi",
  description:
    "getfavi is the brand name of favi, the public favicon picker and HTTP API at https://getfavi.vercel.app.",
  alternates: {
    canonical: "/getfavi",
    types: {
      "text/markdown": "/getfavi",
    },
  },
}

export default function GetfaviPage() {
  return <AgentDocShell blocks={getfaviBlocks} />
}
