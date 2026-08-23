import { AgentDocShell } from "@/components/agent-doc-shell"
import { notFoundBlocks } from "@/lib/agent-pages"

export default function NotFound() {
  return <AgentDocShell blocks={notFoundBlocks} />
}
