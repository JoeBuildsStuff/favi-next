import { ContentBlocks } from "@/components/content-blocks"
import { homepageBlocks } from "@/lib/agent-pages"

/** Server-rendered outline so crawlers see an H1 and 500+ chars without JS. */
export function HomeCrawlerContent() {
  return (
    <section className="sr-only" aria-label="About favi">
      <ContentBlocks blocks={homepageBlocks} />
    </section>
  )
}
