import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { AgentDocShell } from "@/components/agent-doc-shell"
import {
  DEVELOPER_DOC_SLUGS,
  getAgentPage,
  type DeveloperDocSlug,
} from "@/lib/agent-pages"

function isDocSlug(value: string): value is DeveloperDocSlug {
  return (DEVELOPER_DOC_SLUGS as readonly string[]).includes(value)
}

export function generateStaticParams() {
  return DEVELOPER_DOC_SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  if (!isDocSlug(slug)) {
    return { title: "Page not found" }
  }
  const page = getAgentPage(`/docs/${slug}`)
  return {
    title: page.title,
    description: `favi developer resources: ${page.title} for the Vercel-hosted HTTP API at getfavi.vercel.app.`,
    alternates: {
      canonical: `/docs/${slug}`,
      types: {
        "text/markdown": `/docs/${slug}`,
      },
    },
  }
}

export default async function DeveloperDocPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  if (!isDocSlug(slug)) notFound()
  const page = getAgentPage(`/docs/${slug}`)
  return <AgentDocShell blocks={page.blocks} />
}
