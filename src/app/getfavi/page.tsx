import { getfaviBlocks } from "@/lib/agent-pages"
import { createAgentDocPage } from "@/lib/agent-pages/doc-page"

const page = createAgentDocPage({
  path: "/getfavi",
  title: "getfavi",
  description:
    "getfavi is the brand name of favi, the public favicon picker and HTTP API at https://getfavi.vercel.app.",
  blocks: getfaviBlocks,
})

export const metadata = page.metadata
export default page.Page
