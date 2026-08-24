import { HomeCrawlerContent } from "@/components/home-crawler-content"
import { PreviewPage } from "@/components/preview-page"
import { FaviconSelectionProvider } from "@/context/favicon-selection"
import { parseFaviconConfigFromRecord } from "@/features/favicon-editor/model/parse-search-params"

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const resolved = await searchParams
  const initialConfig = parseFaviconConfigFromRecord(resolved)
  return (
    <>
      <HomeCrawlerContent />
      <div className="home-picker">
        <FaviconSelectionProvider initialConfig={initialConfig}>
          <PreviewPage />
        </FaviconSelectionProvider>
      </div>
    </>
  )
}
