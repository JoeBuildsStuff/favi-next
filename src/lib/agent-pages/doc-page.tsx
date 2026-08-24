import type { Metadata } from "next"
import type { JSX } from "react"

import { AgentDocShell } from "@/components/agent-doc-shell"

import type { ContentBlock } from "./types"

export function createAgentDocMetadata(opts: {
  path: string
  title: string
  description: string
  canonical?: string
  markdownPath?: string
}): Metadata {
  const canonical = opts.canonical ?? opts.path
  const markdownPath = opts.markdownPath ?? opts.path
  return {
    title: opts.title,
    description: opts.description,
    alternates: {
      canonical,
      types: {
        "text/markdown": markdownPath,
      },
    },
  }
}

export function createAgentDocPage(opts: {
  path: string
  title: string
  description: string
  canonical?: string
  markdownPath?: string
  blocks: ContentBlock[]
}): { metadata: Metadata; Page: () => JSX.Element } {
  const metadata = createAgentDocMetadata(opts)
  function Page() {
    return <AgentDocShell blocks={opts.blocks} />
  }
  return { metadata, Page }
}
