import { privacyBlocks } from "@/lib/agent-pages"
import { createAgentDocPage } from "@/lib/agent-pages/doc-page"

const page = createAgentDocPage({
  path: "/privacy",
  title: "getfavi privacy",
  description:
    "getfavi privacy: no user accounts; Vercel request logs and in-memory API handling for https://getfavi.vercel.app.",
  blocks: privacyBlocks,
})

export const metadata = page.metadata
export default page.Page
