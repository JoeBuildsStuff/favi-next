import { ContentBlocks } from "@/components/content-blocks"
import { homepageBlocks } from "@/lib/agent-pages"

/**
 * Server-rendered main/article for no-JS crawlers. Hidden after `html.js` so the
 * visual picker stays the same for browser users. ContentBlocks preserves the
 * sequential H1 → H2 → H3 document outline inside its Typeset surface.
 */
export function HomeCrawlerContent() {
  return (
    <main className="home-crawler mx-auto max-w-3xl px-6 py-10">
      <article>
        <ContentBlocks blocks={homepageBlocks} />
      </article>
    </main>
  )
}
