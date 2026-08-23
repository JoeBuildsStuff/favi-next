import { ContentBlocks } from "@/components/content-blocks"
import { homepageBlocks } from "@/lib/agent-pages"

/**
 * Server-rendered article for no-JS crawlers. Hidden after `html.js` so the
 * visual picker stays the same for browser users.
 */
export function HomeCrawlerContent() {
  return (
    <article className="home-crawler mx-auto max-w-3xl px-6 py-10">
      <ContentBlocks blocks={homepageBlocks} />
    </article>
  )
}
