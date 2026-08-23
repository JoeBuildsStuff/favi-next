import { FaviconSelectionProvider } from "@/context/favicon-selection"
import { HomeCrawlerContent } from "@/components/home-crawler-content"
import { PreviewPage } from "@/components/preview-page"

export default function Home() {
  return (
    <>
      <HomeCrawlerContent />
      <FaviconSelectionProvider>
        <PreviewPage />
      </FaviconSelectionProvider>
    </>
  )
}
