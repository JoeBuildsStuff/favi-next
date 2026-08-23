import type { Metadata } from "next"

import { AgentDocShell } from "@/components/agent-doc-shell"
import { aboutBlocks } from "@/lib/agent-pages"

export const metadata: Metadata = {
  title: "About getfavi",
  description:
    "About getfavi (favi): a public favicon picker and HTTP API at https://getfavi.vercel.app, maintained as open source.",
  alternates: {
    canonical: "/about",
    types: {
      "text/markdown": "/about",
    },
  },
}

export default function AboutPage() {
  return <AgentDocShell blocks={aboutBlocks} />
}
