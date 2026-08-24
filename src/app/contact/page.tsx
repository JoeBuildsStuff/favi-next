import { contactBlocks } from "@/lib/agent-pages"
import { createAgentDocPage } from "@/lib/agent-pages/doc-page"

const page = createAgentDocPage({
  path: "/contact",
  title: "Contact getfavi",
  description:
    "Contact getfavi via GitHub Issues on JoeBuildsStuff/favi-next. Canonical site: https://getfavi.vercel.app.",
  blocks: contactBlocks,
})

export const metadata = page.metadata
export default page.Page
