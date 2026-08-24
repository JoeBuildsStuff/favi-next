import { aboutBlocks } from "@/lib/agent-pages"
import { createAgentDocPage } from "@/lib/agent-pages/doc-page"

const page = createAgentDocPage({
  path: "/about",
  title: "About getfavi",
  description:
    "About getfavi (favi): a public favicon picker and HTTP API at https://getfavi.vercel.app, maintained as open source.",
  blocks: aboutBlocks,
})

export const metadata = page.metadata
export default page.Page
