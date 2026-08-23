import Link from "next/link"

import { ContentBlocks } from "@/components/content-blocks"
import type { ContentBlock } from "@/lib/agent-pages"

export function AgentDocShell({
  blocks,
}: {
  blocks: ContentBlock[]
}) {
  return (
    <div className="bg-background text-foreground min-h-full">
      <header className="border-border border-b px-6 py-4">
        <Link href="/" className="text-sm font-semibold">
          favi
        </Link>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-10">
        <ContentBlocks blocks={blocks} />
      </main>
    </div>
  )
}
