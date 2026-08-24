import { developerBlocks } from "@/lib/agent-pages"
import { createAgentDocPage } from "@/lib/agent-pages/doc-page"

const page = createAgentDocPage({
  path: "/agents",
  title: "getfavi (favi) agent resources",
  description:
    "Markdown-friendly getfavi agent resources: when to use the free favicon API, how to search icons, and how to export favicon packages without browser automation.",
  blocks: developerBlocks,
})

export const metadata = page.metadata
export default page.Page
