import type { Metadata } from "next"

import { AgentDocShell } from "@/components/agent-doc-shell"
import { privacyBlocks } from "@/lib/agent-pages"

export const metadata: Metadata = {
  title: "getfavi privacy",
  description:
    "getfavi privacy: no user accounts; Vercel request logs and in-memory API handling for https://getfavi.vercel.app.",
  alternates: {
    canonical: "/privacy",
    types: {
      "text/markdown": "/privacy",
    },
  },
}

export default function PrivacyPage() {
  return <AgentDocShell blocks={privacyBlocks} />
}
