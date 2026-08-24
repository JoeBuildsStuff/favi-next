"use client"

import { useState } from "react"

import { exportFaviconZip } from "@/lib/api"
import { useFaviconSelection } from "@/context/favicon-selection"
import { normalizeInitials } from "@/lib/favicon-settings"
import { buildFaviconExportRequest } from "../model/export-request"

export function useFaviconExport() {
  const { selected, settings, siteName, sourceMode, initialsText } =
    useFaviconSelection()
  const [busy, setBusy] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)

  const letters = normalizeInitials(initialsText)
  const canExport =
    sourceMode === "initials" ? letters.length > 0 : Boolean(selected)

  async function onDownload() {
    const request = buildFaviconExportRequest({
      selected,
      settings,
      siteName,
      sourceMode,
      initialsText,
    })
    if (!request) return
    setBusy(true)
    setExportError(null)
    try {
      const blob = await exportFaviconZip(request.body)
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = request.filename
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      setExportError(e instanceof Error ? e.message : "Export failed")
    } finally {
      setBusy(false)
    }
  }

  return { busy, exportError, canExport, onDownload, sourceMode }
}
