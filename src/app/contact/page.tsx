import type { Metadata } from "next"

import { AgentDocShell } from "@/components/agent-doc-shell"
import { contactBlocks } from "@/lib/agent-pages"

export const metadata: Metadata = {
  title: "Contact getfavi",
  description:
    "Contact getfavi via GitHub Issues on JoeBuildsStuff/favi-next. Canonical site: https://getfavi.vercel.app.",
  alternates: {
    canonical: "/contact",
    types: {
      "text/markdown": "/contact",
    },
  },
}

export default function ContactPage() {
  return <AgentDocShell blocks={contactBlocks} />
}
