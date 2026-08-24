import type { ContentBlock } from "../types"

export function blocksToMarkdown(blocks: ContentBlock[]): string {
  return (
    blocks
      .map((block) => {
        if (block.type === "h") {
          return `${"#".repeat(block.level)} ${block.text}`
        }
        if (block.type === "p") {
          return block.text
        }
        if (block.type === "pre") {
          return `\`\`\`\n${block.text}\n\`\`\``
        }
        return block.items
          .map((item) => {
            const note = item.note ? `: ${item.note}` : ""
            return `- [${item.label}](${item.href})${note}`
          })
          .join("\n")
      })
      .join("\n\n") + "\n"
  )
}

export function markdownHeaders(): HeadersInit {
  return {
    "Content-Type": "text/markdown; charset=utf-8",
    Vary: "Accept, Accept-Encoding",
    "Cache-Control": "public, max-age=60, stale-while-revalidate=86400",
  }
}
