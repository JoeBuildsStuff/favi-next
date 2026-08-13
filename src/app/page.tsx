"use client"

import { FaviconSelectionProvider } from "@/context/favicon-selection"
import { PreviewPage } from "@/components/preview-page"

export default function Home() {
  return (
    <FaviconSelectionProvider>
      <PreviewPage />
    </FaviconSelectionProvider>
  )
}
