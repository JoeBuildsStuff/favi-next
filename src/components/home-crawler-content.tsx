import { ContentBlocks } from "@/components/content-blocks"
import { homepageBlocks } from "@/lib/agent-pages"

/**
 * Server-rendered main/article for no-JS crawlers. Hidden after `html.js` so the
 * visual picker stays the same for browser users. Headings are direct children
 * of article so the document outline is H1 → H2 → H3, not a flat sibling list
 * trapped in generic wrappers.
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
